// Package bitcoin provides functionality for working with Bitcoin transactions,
// particularly focusing on Taproot (P2TR) address creation and transaction handling.
package bitcoin

import (
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"fmt"

	secp "github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/btcec/v2/schnorr"
	"github.com/btcsuite/btcd/btcutil"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcd/chaincfg/chainhash"
	"github.com/btcsuite/btcd/txscript"
	"github.com/btcsuite/btcd/wire"

	"tanos/pkg/adaptor"
	"tanos/pkg/crypto"
)

// CreateP2TRAddress creates a Pay-to-Taproot address from a public key.
// It implements the BIP341 specification for Taproot addresses.
func CreateP2TRAddress(pubKey *secp.PublicKey, params *chaincfg.Params) (string, []byte, error) {
	// For BIP341, we need the "x-only" public key (only the x-coordinate)
	//
	// Note on future improvements:
	// Instead of manually implementing the BIP341 tweaking, schnorr.TweakPubKey()
	// could be used when this function becomes available in a future library.
	// This would simplify the Taproot tweak calculation and ensure full compatibility
	// with the Bitcoin protocol.
	//
	// Example future pseudocode:
	// tweakedKey, _ := schnorr.TweakPubKey(pubKey, nil) // nil for key-only spending path
	// witnessProgram := tweakedKey.XBytes() // get only the 32 bytes of x-coordinate

	// Extract the x-coordinate as an x-only pubkey (32 bytes)
	xOnly := crypto.PadTo32(pubKey.X().Bytes())

	// Calculate the Taproot tweak according to BIP341
	tweakHash := chainhash.TaggedHash(chainhash.TagTapTweak, xOnly)

	// Create a ModNScalar from the tweak hash
	tweakScalar := new(secp.ModNScalar)
	if overflow := tweakScalar.SetByteSlice(tweakHash[:]); overflow {
		return "", nil, fmt.Errorf("tweak overflow")
	}

	// Calculate the tweaked key: P' = P + t*G
	tweakPrivKey := secp.PrivKeyFromScalar(tweakScalar)
	tweakPubKey := tweakPrivKey.PubKey()

	// Calculate P + H(P||c)*G
	tweakedPubKey, err := adaptor.AddPubKeys(pubKey, tweakPubKey)
	if err != nil {
		return "", nil, fmt.Errorf("failed to add public keys: %v", err)
	}

	// Extract the x-coordinate of the tweakedPubKey as an x-only pubkey (32 bytes)
	witnessProgram := crypto.PadTo32(tweakedPubKey.X().Bytes())

	// Sanity check that we have exactly 32 bytes
	if len(witnessProgram) != 32 {
		return "", nil, fmt.Errorf("invalid witness program length: %d, expected 32", len(witnessProgram))
	}

	// Create the P2TR script
	builder := txscript.NewScriptBuilder()
	builder.AddOp(txscript.OP_1) // SegWit version 1 (taproot)
	builder.AddData(witnessProgram)
	pkScript, err := builder.Script()
	if err != nil {
		return "", nil, err
	}

	// Create a valid bech32m Taproot address using btcutil
	taprootAddress, err := btcutil.NewAddressTaproot(witnessProgram, params)
	if err != nil {
		return "", nil, fmt.Errorf("failed to create taproot address: %v", err)
	}

	return taprootAddress.String(), pkScript, nil
}

// CreateLockingTransaction creates a Bitcoin transaction that locks coins to a P2TR address.
// This transaction represents the funding transaction in the atomic swap.
func CreateLockingTransaction(
	buyerPubKey *secp.PublicKey,
	amount int64,
	prevTxID string,
	prevOutputIndex uint32,
	params *chaincfg.Params,
) (*wire.MsgTx, []byte, error) {
	// Create a new transaction
	tx := wire.NewMsgTx(2) // Version 2 for taproot support

	// Parse previous transaction ID
	prevHash, err := chainhash.NewHashFromStr(prevTxID)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid previous transaction ID: %v", err)
	}

	// Add the input using the provided previous outpoint
	prevOut := wire.NewOutPoint(prevHash, prevOutputIndex)
	txIn := wire.NewTxIn(prevOut, nil, nil)
	tx.AddTxIn(txIn)

	// Create a P2TR address and script for the output
	_, pkScript, err := CreateP2TRAddress(buyerPubKey, params)
	if err != nil {
		return nil, nil, err
	}

	// Add the output
	txOut := wire.NewTxOut(amount, pkScript)
	tx.AddTxOut(txOut)

	return tx, pkScript, nil
}

// SerializeTx serializes a Bitcoin transaction to hex.
func SerializeTx(tx *wire.MsgTx) (string, error) {
	var buf bytes.Buffer
	if err := tx.Serialize(&buf); err != nil {
		return "", err
	}
	return crypto.HexEncode(buf.Bytes()), nil
}

// CalculateSighash calculates the signature hash for a taproot input.
// This is a simplified version for demonstration purposes.
func CalculateSighash(tx *wire.MsgTx, inputIndex int, scriptPubKey []byte) ([]byte, error) {
	// This is a simplified sighash calculation for demonstration purposes
	// In a real implementation, you would use the proper taproot sighash algorithm

	// For now, we'll use a simple hash of the transaction
	var buf bytes.Buffer
	if err := tx.Serialize(&buf); err != nil {
		return nil, err
	}

	// Add the output script being spent for context
	buf.Write(scriptPubKey)

	// Hash the data
	hash := sha256.Sum256(buf.Bytes())
	return hash[:], nil
}

// CreateSpendingTransaction creates a Bitcoin transaction that spends a previous UTXO
// and locks the funds in a new Taproot output that can be spent with an adaptor signature.
// This enables passing funds from one atomic swap to another by spending previous outputs.
func CreateSpendingTransaction(
	prevTxID string,
	prevOutputIndex uint32,
	prevOutputValue int64,
	prevOutputScript []byte,
	fee int64,
	signerPrivKey *secp.PrivateKey,
	newOutputPubKey *secp.PublicKey,
	params *chaincfg.Params,
) (*wire.MsgTx, []byte, error) {
	// Parse previous transaction ID
	prevHash, err := chainhash.NewHashFromStr(prevTxID)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid previous transaction ID: %v", err)
	}

	// Create previous outpoint reference
	prevOut := wire.NewOutPoint(prevHash, prevOutputIndex)

	// Create a new transaction
	tx := wire.NewMsgTx(2) // Version 2 for taproot support

	// Add the input
	txIn := wire.NewTxIn(prevOut, nil, nil)
	tx.AddTxIn(txIn)

	// Create a P2TR address and script for the output
	_, pkScript, err := CreateP2TRAddress(newOutputPubKey, params)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create taproot address: %v", err)
	}

	// Add the output (with amount minus fee)
	outputAmount := prevOutputValue - fee
	if outputAmount <= 0 {
		return nil, nil, fmt.Errorf("fee too high: %d, exceeds amount: %d", fee, prevOutputValue)
	}
	txOut := wire.NewTxOut(outputAmount, pkScript)
	tx.AddTxOut(txOut)

	// Since the ComputeTaprootSignatureHash is not directly available,
	// we'll use a simplified approach for demonstration purposes.
	// In a production environment, you'd use the proper BIP341 sighash calculation

	// Simplified sighash calculation for demonstration
	var sigHash []byte
	{
		// Create a buffer to serialize the transaction
		var buf bytes.Buffer
		if err := tx.Serialize(&buf); err != nil {
			return nil, nil, fmt.Errorf("failed to serialize tx: %v", err)
		}

		// Add the output script being spent for context
		buf.Write(prevOutputScript)

		// Add the output value being spent for context
		valueBytes := make([]byte, 8)
		binary.LittleEndian.PutUint64(valueBytes, uint64(prevOutputValue))
		buf.Write(valueBytes)

		// Add the input index for context
		indexBytes := make([]byte, 4)
		binary.LittleEndian.PutUint32(indexBytes, 0) // index 0
		buf.Write(indexBytes)

		// Hash the data
		hash := sha256.Sum256(buf.Bytes())
		sigHash = hash[:]
	}

	// Sign the hash with the private key using Schnorr signature
	sig, err := schnorr.Sign(signerPrivKey, sigHash)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to create schnorr signature: %v", err)
	}

	// Add the signature to the witness data
	tx.TxIn[0].Witness = wire.TxWitness{sig.Serialize()}

	return tx, pkScript, nil
}

// CreateNostrSignatureLockScript creates a Taproot script that locks funds
// to be spent only with a valid Nostr signature. It uses the commitment
// point derived from the Nostr event's signature nonce.
//
// The script is constructed with the following spending path:
// 1. Key path: the Nostr public key, tweaked with the commitment
// 2. Script path (optional): can include additional spending conditions
//
// When used in conjunction with adaptor signatures, this enables atomic swaps
// between Bitcoin and Nostr events, as the act of spending the output reveals
// the secret needed to recover the Nostr signature.
func CreateNostrSignatureLockScript(
	nostrPubKey *secp.PublicKey,
	commitment *secp.PublicKey,
	params *chaincfg.Params,
) (string, []byte, error) {
	// Combine the nostrPubKey and commitment to create a tweaked key
	// that can only be spent with knowledge of the Nostr signature
	tweakedKey, err := adaptor.AddPubKeys(nostrPubKey, commitment)
	if err != nil {
		return "", nil, fmt.Errorf("failed to create tweaked key: %v", err)
	}

	// Generate a Pay-to-Taproot address using the tweaked key
	taprootAddress, pkScript, err := CreateP2TRAddress(tweakedKey, params)
	if err != nil {
		return "", nil, fmt.Errorf("failed to create taproot address: %v", err)
	}

	return taprootAddress, pkScript, nil
}
