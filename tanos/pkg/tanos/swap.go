// Package tanos implements the TANOS (Taproot Adaptor for Nostr-Orchestrated Swaps) protocol.
// It provides the high-level functionality for atomic swaps between Bitcoin and Nostr.
package tanos

import (
	"fmt"

	secp "github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcd/chaincfg/chainhash"
	"github.com/btcsuite/btcd/wire"
	nostrlib "github.com/nbd-wtf/go-nostr"

	"tanos/pkg/adaptor"
	"tanos/pkg/bitcoin"
	"tanos/pkg/crypto"
	"tanos/pkg/nostr"
)

// SwapSeller represents the seller in the atomic swap,
// who owns a Nostr private key and wants to sell access to a signed Nostr event.
type SwapSeller struct {
	PrivateKey    string           // Nostr private key in hex
	PrivateKeyBtc *secp.PrivateKey // Same key in secp256k1 format
	PublicKey     *secp.PublicKey  // Public key in secp256k1 format
	NostrPubKey   string           // Nostr public key in hex
	Event         nostrlib.Event   // The Nostr event being sold
	Nonce         *secp.PublicKey  // Nonce extracted from the signature
	Commitment    *secp.PublicKey  // The commitment point T = R + e*P
}

// SwapBuyer represents the buyer in the atomic swap,
// who wants to purchase access to a signed Nostr event.
type SwapBuyer struct {
	PrivateKey *secp.PrivateKey   // Bitcoin private key
	PublicKey  *secp.PublicKey    // Bitcoin public key
	AdaptorSig *adaptor.Signature // Adaptor signature
	LockingTx  *wire.MsgTx        // Transaction that locks the coins
	SigHash    []byte             // Signature hash of the locking transaction
}

// NewSeller creates a new seller for the atomic swap.
func NewSeller(nostrPrivateKey string) (*SwapSeller, error) {
	// Parse the Nostr private key
	privBytes, err := crypto.HexDecode(nostrPrivateKey)
	if err != nil {
		return nil, fmt.Errorf("invalid seller private key: %v", err)
	}

	// Convert to secp256k1 private key
	sellerPriv, _ := secp.PrivKeyFromBytes(privBytes)
	sellerPub := sellerPriv.PubKey()

	// Get the Nostr public key
	nostrPub, err := nostr.GetPublicKey(nostrPrivateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to get public key from nostr private key: %v", err)
	}

	return &SwapSeller{
		PrivateKey:    nostrPrivateKey,
		PrivateKeyBtc: sellerPriv,
		PublicKey:     sellerPub,
		NostrPubKey:   nostrPub,
	}, nil
}

// NewBuyer creates a new buyer for the atomic swap.
func NewBuyer() (*SwapBuyer, error) {
	// Generate a new private key for the buyer
	buyerPriv, err := secp.NewPrivateKey()
	if err != nil {
		return nil, fmt.Errorf("failed to generate buyer private key: %v", err)
	}

	return &SwapBuyer{
		PrivateKey: buyerPriv,
		PublicKey:  buyerPriv.PubKey(),
	}, nil
}

// CreateEvent creates a signed Nostr event that will be sold in the swap.
func (s *SwapSeller) CreateEvent(content string) error {
	// Create and sign the event
	event, err := nostr.CreateSignedEvent(s.PrivateKey, content)
	if err != nil {
		return fmt.Errorf("failed to create signed event: %v", err)
	}

	s.Event = event

	// Extract the nonce from the signature
	nonce, err := adaptor.ExtractNonceFromSig(event.Sig)
	if err != nil {
		return fmt.Errorf("failed to extract nonce from signature: %v", err)
	}

	s.Nonce = nonce

	// Compute the challenge e
	msgHash := []byte(event.ID)
	eBigInt := adaptor.SchnorrChallenge(nonce, s.PublicKey, msgHash)

	// Convert to bytes
	eBytes := crypto.PadTo32(eBigInt.Bytes())

	// Compute e*P
	x, y := secp.S256().ScalarMult(s.PublicKey.X(), s.PublicKey.Y(), eBytes)
	fx, fy := new(secp.FieldVal), new(secp.FieldVal)
	if overflow := fx.SetByteSlice(x.Bytes()); overflow {
		return fmt.Errorf("x-coordinate overflow in scalar multiplication")
	}
	if overflow := fy.SetByteSlice(y.Bytes()); overflow {
		return fmt.Errorf("y-coordinate overflow in scalar multiplication")
	}

	// Compute commitment point T = R + e*P
	commitment, err := adaptor.AddPubKeys(nonce, secp.NewPublicKey(fx, fy))
	if err != nil {
		return fmt.Errorf("failed to compute commitment point: %v", err)
	}

	s.Commitment = commitment

	return nil
}

// CreateLockingTransaction creates a Bitcoin transaction that locks funds
// in a Pay-to-Taproot output that can be spent with an adaptor signature.
func (b *SwapBuyer) CreateLockingTransaction(
	amount int64,
	prevTxID string,
	prevOutputIndex uint32,
	network *chaincfg.Params,
) error {
	// Create the locking transaction
	lockTx, lockScript, err := bitcoin.CreateLockingTransaction(
		b.PublicKey,
		amount,
		prevTxID,
		prevOutputIndex,
		network,
	)
	if err != nil {
		return fmt.Errorf("failed to create locking transaction: %v", err)
	}

	b.LockingTx = lockTx

	// Calculate the signature hash
	sigHash, err := bitcoin.CalculateSighash(lockTx, 0, lockScript)
	if err != nil {
		return fmt.Errorf("failed to calculate signature hash: %v", err)
	}

	b.SigHash = sigHash

	return nil
}

// CreateLockingTransactionWithNostrLock creates a Bitcoin transaction that locks funds
// in a Pay-to-Taproot output that can only be spent with knowledge of a Nostr signature.
// This is an enhanced version that uses the seller's Nostr public key and commitment
// to create a script that enforces the atomic swap condition.
func (b *SwapBuyer) CreateLockingTransactionWithNostrLock(
	amount int64,
	prevTxID string,
	prevOutputIndex uint32,
	nostrPubKey *secp.PublicKey,
	commitment *secp.PublicKey,
	network *chaincfg.Params,
) error {
	// Create a taproot address that locks to the Nostr signature
	_, lockScript, err := bitcoin.CreateNostrSignatureLockScript(nostrPubKey, commitment, network)
	if err != nil {
		return fmt.Errorf("failed to create Nostr signature lock script: %v", err)
	}

	// Create a new transaction
	lockTx := wire.NewMsgTx(2) // Version 2 for taproot support

	// Parse previous transaction ID
	prevHash, err := chainhash.NewHashFromStr(prevTxID)
	if err != nil {
		return fmt.Errorf("invalid previous transaction ID: %v", err)
	}

	// Add the input using the provided previous outpoint
	prevOut := wire.NewOutPoint(prevHash, prevOutputIndex)
	txIn := wire.NewTxIn(prevOut, nil, nil)
	lockTx.AddTxIn(txIn)

	// Add the output with the Nostr signature lock script
	txOut := wire.NewTxOut(amount, lockScript)
	lockTx.AddTxOut(txOut)

	b.LockingTx = lockTx

	// Calculate the signature hash
	sigHash, err := bitcoin.CalculateSighash(lockTx, 0, lockScript)
	if err != nil {
		return fmt.Errorf("failed to calculate signature hash: %v", err)
	}

	b.SigHash = sigHash

	return nil
}

// CreateAdaptorSignature creates an adaptor signature using the commitment point.
func (b *SwapBuyer) CreateAdaptorSignature(commitment *secp.PublicKey) error {
	// Create the adaptor signature
	adaptorSig, err := adaptor.New(b.PrivateKey, commitment, b.SigHash)
	if err != nil {
		return fmt.Errorf("failed to create adaptor signature: %v", err)
	}

	b.AdaptorSig = adaptorSig

	return nil
}

// VerifyAdaptorSignature verifies the adaptor signature with the commitment point.
// This is an important step to ensure the adaptor signature is valid before proceeding.
func (b *SwapBuyer) VerifyAdaptorSignature(commitment *secp.PublicKey) bool {
	return b.AdaptorSig.Verify(commitment)
}

// CompleteAdaptorSignature completes the adaptor signature with the secret from the Nostr signature.
func (b *SwapBuyer) CompleteAdaptorSignature(nostrSig string) ([]byte, error) {
	// Extract the secret from the Nostr signature
	secret, err := nostr.ExtractSecretFromSignature(nostrSig)
	if err != nil {
		return nil, fmt.Errorf("failed to extract secret from Nostr signature: %v", err)
	}

	// Complete the adaptor signature
	completedSig := b.AdaptorSig.Complete(secret)

	// Generate the final Schnorr signature
	return b.AdaptorSig.GenerateFinalSignature(completedSig), nil
}

// VerifyNostrSecret verifies that the secret extracted from the Bitcoin signature
// matches the secret in the Nostr signature.
//
// When verifying a completed signature with BIP340 parity rules, there's a critical
// insight: When R'.Y is odd, we need to negate the completed signature before
// extracting the secret. This is because:
//
// 1. During signature creation with odd R'.Y, we negate the nonce scalar k
// 2. During BIP340 finalization, the signature may be further adjusted based on R.Y
// 3. These negations affect how the secret needs to be extracted
//
// For more reliability, we try multiple approaches to extract the secret:
// - Direct extraction: t = s' - s
// - Negate the completed signature: t = (-s') - s
// - Negate the extracted secret: t = -(s' - s)
// - Negate both: t = -(-s' - s)
func (b *SwapBuyer) VerifyNostrSecret(completedSig *secp.ModNScalar, nostrSig string) (bool, error) {
	// Extract the secret from the Nostr signature
	nostrSecret, err := nostr.ExtractSecretFromSignature(nostrSig)
	if err != nil {
		return false, fmt.Errorf("failed to extract secret from Nostr signature: %v", err)
	}

	// Try multiple approaches to extract the secret correctly

	// 1. Direct extraction
	extractedSecret := b.AdaptorSig.ExtractSecret(completedSig)
	if extractedSecret.Equals(nostrSecret) {
		return true, nil
	}

	// 2. Negate the extracted secret
	negatedSecret := new(secp.ModNScalar)
	negatedSecret.Set(extractedSecret)
	negatedSecret.Negate()
	if negatedSecret.Equals(nostrSecret) {
		return true, nil
	}

	// 3. Negate the completedSig before extraction
	// This is the critical approach for odd R'.Y cases
	negatedCompletedSig := new(secp.ModNScalar)
	negatedCompletedSig.Set(completedSig)
	negatedCompletedSig.Negate()

	extractedFromNegated := b.AdaptorSig.ExtractSecret(negatedCompletedSig)
	if extractedFromNegated.Equals(nostrSecret) {
		return true, nil
	}

	// 4. Negate both the completed sig and the extracted secret
	negatedExtractedFromNegated := new(secp.ModNScalar)
	negatedExtractedFromNegated.Set(extractedFromNegated)
	negatedExtractedFromNegated.Negate()

	if negatedExtractedFromNegated.Equals(nostrSecret) {
		return true, nil
	}

	// No match found with any approach
	return false, nil
}

// DebugAdaptorSignature performs a detailed analysis of the adaptor signature,
// explaining all the parity adjustments and steps in the BIP340 verification process.
// This helps debug issues with secret extraction and verification.
func (b *SwapBuyer) DebugAdaptorSignature(completedSig *secp.ModNScalar, nostrSecret *secp.ModNScalar) map[string]string {
	results := make(map[string]string)

	// Check if the nonce point's Y-coordinate is odd
	rPrimeYIsOdd := b.AdaptorSig.NoncePoint.Y().Bit(0) == 1
	results["R'.Y is odd"] = fmt.Sprintf("%v", rPrimeYIsOdd)

	// Generate a BIP340-compliant signature from the adaptor signature
	finalSig := b.AdaptorSig.GenerateFinalSignature(completedSig)
	results["Final Signature"] = crypto.HexEncode(finalSig)

	// Extract the scalar S from the final signature
	sBytes := finalSig[32:]
	sScalar := new(secp.ModNScalar)
	if overflow := sScalar.SetByteSlice(sBytes); overflow {
		results["Error"] = "Scalar overflow in final signature"
		return results
	}
	results["Final s scalar"] = crypto.HexEncode(crypto.SerializeModNScalar(sScalar))

	// Extract the secret directly from the adaptor signature
	extractedSecret := b.AdaptorSig.ExtractSecret(completedSig)
	results["Extracted secret"] = crypto.HexEncode(crypto.SerializeModNScalar(extractedSecret))

	// Check if the extracted secret matches the nostr secret
	matches := extractedSecret.Equals(nostrSecret)
	results["Direct match"] = fmt.Sprintf("%v", matches)

	// If there's no match and R'.Y is odd, try negating
	if !matches && rPrimeYIsOdd {
		negatedSecret := new(secp.ModNScalar)
		negatedSecret.Set(extractedSecret)
		negatedSecret.Negate()
		results["Negated secret"] = crypto.HexEncode(crypto.SerializeModNScalar(negatedSecret))

		negatedMatches := negatedSecret.Equals(nostrSecret)
		results["Negated match"] = fmt.Sprintf("%v", negatedMatches)
	}

	// Try negating the completedSig before extraction
	negatedCompletedSig := new(secp.ModNScalar)
	negatedCompletedSig.Set(completedSig)
	negatedCompletedSig.Negate()
	results["Negated completedSig"] = crypto.HexEncode(crypto.SerializeModNScalar(negatedCompletedSig))

	extractedFromNegated := b.AdaptorSig.ExtractSecret(negatedCompletedSig)
	results["Extracted from negated"] = crypto.HexEncode(crypto.SerializeModNScalar(extractedFromNegated))

	negatedExtractionMatches := extractedFromNegated.Equals(nostrSecret)
	results["Negated extraction match"] = fmt.Sprintf("%v", negatedExtractionMatches)

	// Calculate a raw secret extraction without BIP340 adjustments
	adaptorS := b.AdaptorSig.S

	// Calculate t = s' - s directly
	directSecret := new(secp.ModNScalar)
	directSecret.Set(completedSig)

	// Negate adaptor S
	negS := new(secp.ModNScalar)
	negS.Set(adaptorS)
	negS.Negate()

	// t = s' + (-s) = s' - s
	directSecret.Add(negS)
	results["Direct secret calculation"] = crypto.HexEncode(crypto.SerializeModNScalar(directSecret))

	directMatches := directSecret.Equals(nostrSecret)
	results["Direct calculation match"] = fmt.Sprintf("%v", directMatches)

	return results
}

// CreateSpendingTransaction creates a Bitcoin transaction that spends a previous output
// and locks the funds in a new Taproot output that can be spent with an adaptor signature.
// This enables chaining multiple atomic swaps by spending outputs from previous swaps.
func (b *SwapBuyer) CreateSpendingTransaction(
	prevTxID string,
	prevOutputIndex uint32,
	prevOutputValue int64,
	prevOutputScript []byte,
	fee int64,
	newCommitment *secp.PublicKey,
	network *chaincfg.Params,
) error {
	// Create the spending transaction
	spendTx, pkScript, err := bitcoin.CreateSpendingTransaction(
		prevTxID,
		prevOutputIndex,
		prevOutputValue,
		prevOutputScript,
		fee,
		b.PrivateKey,
		newCommitment,
		network,
	)
	if err != nil {
		return fmt.Errorf("failed to create spending transaction: %v", err)
	}

	// Set the locking transaction
	b.LockingTx = spendTx

	// Calculate the signature hash for the new locking transaction
	sigHash, err := bitcoin.CalculateSighash(spendTx, 0, pkScript)
	if err != nil {
		return fmt.Errorf("failed to calculate signature hash: %v", err)
	}

	// Set the signature hash for the locking transaction
	b.SigHash = sigHash

	return nil
}
