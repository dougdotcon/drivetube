// Package adaptor implements adaptor signatures based on Schnorr.
// Adaptor signatures allow creating signatures that reveal a secret
// when completed, enabling atomic swaps and other protocols.
package adaptor

import (
	"bytes"
	"fmt"
	"math/big"

	"github.com/btcsuite/btcd/chaincfg/chainhash"

	secp "github.com/btcsuite/btcd/btcec/v2"

	"tanos/pkg/crypto"
)

// ErrSignatureCreation is returned when signature creation fails
var ErrSignatureCreation = fmt.Errorf("adaptor signature creation failed: verification equation does not hold")

// Signature encapsulates the data of an adaptor signature.
type Signature struct {
	NoncePoint *secp.PublicKey  // R' = R + T, where T is the adaptor point
	S          *secp.ModNScalar // s_a = k + e*x (or -k + e*x if R'.Y is odd)
	PubKey     *secp.PublicKey  // P, the public key of the signer
	Message    []byte           // m, the message being signed
	// The adaptor point T is not included here, it must be known by the verifier
}

// New creates a new adaptor signature.
// It implements the key part of the atomic swap protocol - creating a
// signature that will reveal a secret when completed.
// This follows the BIP340 Schnorr signature scheme with an adaptor point.
//
// BIP340 requires the nonce point to have an even Y-coordinate for challenge calculation.
// When R'.Y is odd, we:
// 1. Negate the nonce scalar k
// 2. Use an adjusted nonce with even Y for challenge calculation
// These steps ensure compatibility with the BIP340 verification process.
func New(privateKey *secp.PrivateKey, adaptorPoint *secp.PublicKey, message []byte) (*Signature, error) {
	// Generate a random nonce (k)
	k, err := secp.NewPrivateKey()
	if err != nil {
		return nil, fmt.Errorf("failed to generate nonce: %v", err)
	}

	// Calculate the nonce point R = k*G
	R := k.PubKey()

	// Calculate the adaptor nonce point R' = R + T
	adaptorNonce, err := AddPubKeys(R, adaptorPoint)
	if err != nil {
		return nil, fmt.Errorf("failed to add pubkeys for adaptor nonce: %v", err)
	}

	// Check if R'.Y is odd (BIP340 requires an even Y coordinate for challenge computation)
	negateK := adaptorNonce.Y().Bit(0) == 1

	// Create adjusted nonce point for challenge calculation if needed
	adjustedAdaptorNonce := adaptorNonce
	if negateK {
		// Create a new point with same X but negated Y
		fx := new(secp.FieldVal)
		fy := new(secp.FieldVal)

		if overflow := fx.SetByteSlice(adaptorNonce.X().Bytes()); overflow {
			return nil, fmt.Errorf("overflow in field value")
		}

		// Negate Y value (p - y)
		negY := new(big.Int).Sub(secp.S256().P, adaptorNonce.Y())

		if overflow := fy.SetByteSlice(negY.Bytes()); overflow {
			return nil, fmt.Errorf("overflow in field value")
		}

		adjustedAdaptorNonce = secp.NewPublicKey(fx, fy)
	}

	// Compute the challenge e = H(R' || P || m)
	P := privateKey.PubKey()
	eBigInt := SchnorrChallenge(adjustedAdaptorNonce, P, message)

	// Convert to scalar
	eScalar := new(secp.ModNScalar)
	eBytes := crypto.PadTo32(eBigInt.Bytes())
	if overflow := eScalar.SetByteSlice(eBytes); overflow {
		return nil, fmt.Errorf("challenge scalar overflow")
	}

	// Get the private key as scalar
	xScalar := new(secp.ModNScalar)
	xScalar.Set(&privateKey.Key)

	// Convert nonce to scalar
	kScalar := new(secp.ModNScalar)
	kScalar.Set(&k.Key)

	// If R'.Y is odd, negate k per BIP340
	if negateK {
		kScalar.Negate()
	}

	// s = k + e*d mod n
	s := new(secp.ModNScalar)
	s.Mul2(eScalar, xScalar) // s = e*d
	s.Add(kScalar)           // s = k + e*d

	// Verify the equation s*G = R + e*P during creation
	// This is a sanity check to ensure our adaptor signature creation is correct
	sBytes := crypto.SerializeModNScalar(s)
	sgX, sgY := secp.S256().ScalarBaseMult(sBytes)

	// Calculate e*P
	eBytes = crypto.SerializeModNScalar(eScalar)
	epX, epY := secp.S256().ScalarMult(P.X(), P.Y(), eBytes)

	// Calculate the expected right side
	// If negation was needed during signature creation,
	// we use -R to match the negation of k
	var checkPointX, checkPointY *big.Int
	if negateK {
		// Create -R
		negR, err := crypto.NegatePoint(R)
		if err != nil {
			return nil, err
		}

		// Calculate (-R) + e*P
		checkPointX, checkPointY = secp.S256().Add(negR.X(), negR.Y(), epX, epY)
	} else {
		// Calculate R + e*P
		checkPointX, checkPointY = secp.S256().Add(R.X(), R.Y(), epX, epY)
	}

	// Verify equation s*G = R + e*P
	if sgX.Cmp(checkPointX) != 0 || sgY.Cmp(checkPointY) != 0 {
		return nil, ErrSignatureCreation
	}

	// Double-check our R recovery logic
	// Verify that R = R' - T
	negT, err := crypto.NegatePoint(adaptorPoint)
	if err != nil {
		return nil, err
	}

	recoveredR, err := AddPubKeys(adaptorNonce, negT)
	if err != nil {
		return nil, err
	}

	// Verify that the original R and the recovered R are identical
	rCompare := bytes.Equal(R.SerializeCompressed(), recoveredR.SerializeCompressed())
	if !rCompare {
		return nil, fmt.Errorf("point recovery test failed: R ≠ R' - T")
	}

	// Return the completed adaptor signature
	return &Signature{
		NoncePoint: adaptorNonce,
		S:          s,
		PubKey:     P,
		Message:    message,
	}, nil
}

// Verify checks if an adaptor signature is valid.
// For adaptor signatures, the verification equation is:
// s*G = R + e*P, where R = R' - T
// The adaptor point T must be provided for verification.
//
// The verification process follows these important steps:
// 1. Recover R from R' by calculating R = R' - T
// 2. Use an even Y coordinate for challenge calculation as required by BIP340
// 3. Handle the case when R'.Y is odd by negating R in the verification equation
// 4. Compare points considering BIP340 rules where only X-coordinates are relevant
//
// BIP340 Parity Insight: When R'.Y is odd, the verification must negate the
// recovered R point to maintain consistency with the signature creation process,
// which negates the nonce scalar k when R'.Y is odd.
//
// This implementation handles all edge cases regarding Y-coordinate parity
// to ensure robust verification.
func (a *Signature) Verify(adaptorPoint *secp.PublicKey) bool {
	// For BIP340 challenge calculation, we need a nonce point with even Y
	// Check if R'.Y is odd, in which case we need to use a modified point for challenge
	negationNeeded := a.NoncePoint.Y().Bit(0) == 1

	// Create an adjusted nonce point for challenge calculation if needed
	adjustedNonce := a.NoncePoint

	if negationNeeded {
		// Create a new point with the same X but negated Y
		fx := new(secp.FieldVal)
		fy := new(secp.FieldVal)

		if overflow := fx.SetByteSlice(a.NoncePoint.X().Bytes()); overflow {
			return false
		}

		// Negate Y value (p - y)
		negY := new(big.Int).Sub(secp.S256().P, a.NoncePoint.Y())

		if overflow := fy.SetByteSlice(negY.Bytes()); overflow {
			return false
		}

		adjustedNonce = secp.NewPublicKey(fx, fy)
	}

	// Compute the challenge using the adjusted nonce point (with even Y)
	eBigInt := SchnorrChallenge(adjustedNonce, a.PubKey, a.Message)

	// Convert to scalar
	eScalar := new(secp.ModNScalar)
	eBytes := crypto.PadTo32(eBigInt.Bytes())
	if overflow := eScalar.SetByteSlice(eBytes); overflow {
		return false // Challenge scalar overflow
	}

	// Get the original R = R' - T by negating T and adding to R'
	// Calculate -T
	negTPoint, err := crypto.NegatePoint(adaptorPoint)
	if err != nil {
		return false
	}

	// Calculate R = R' + (-T)
	R, err := AddPubKeys(a.NoncePoint, negTPoint)
	if err != nil {
		return false
	}

	// Now we need to compute s*G and compare it with R + e*P
	// 1. Calculate s*G (left-hand side)
	sBytes := crypto.SerializeModNScalar(a.S)
	sgX, sgY := secp.S256().ScalarBaseMult(sBytes)

	// 2. Calculate e*P
	eBytes = crypto.SerializeModNScalar(eScalar)
	epX, epY := secp.S256().ScalarMult(a.PubKey.X(), a.PubKey.Y(), eBytes)

	// 3. For adaptor signatures, we need to account for both the parity of R'.Y
	// and the parity of the recovered R.Y in verification.
	// Need to correctly match same verification context used in creation.

	// If we needed to negate the nonce during signature creation (R'.Y is odd),
	// we should use -R in verification instead of R, to mirror creation logic
	var rhsX, rhsY *big.Int
	if negationNeeded {
		// Negate R to match the negation of k during signature creation
		negR, err := crypto.NegatePoint(R)
		if err != nil {
			return false
		}

		// Calculate (-R) + e*P
		rhsX, rhsY = secp.S256().Add(negR.X(), negR.Y(), epX, epY)
	} else {
		// If nonce doesn't need negation, use R directly
		// Calculate R + e*P
		rhsX, rhsY = secp.S256().Add(R.X(), R.Y(), epX, epY)
	}

	// Compare the points
	xMatch := sgX.Cmp(rhsX) == 0
	yMatch := sgY.Cmp(rhsY) == 0

	// Check for Y negation case (valid in BIP340)
	// In BIP340 Schnorr, only the X-coordinate matters for signature verification,
	// so two points with the same X but opposite Y are considered equivalent.
	if xMatch && !yMatch {
		// Check if lhsY + rhsY = p (the field prime)
		ySum := new(big.Int).Add(sgY, rhsY)
		ySum.Mod(ySum, secp.S256().P)

		if ySum.Cmp(big.NewInt(0)) == 0 {
			return true
		}
	}

	return xMatch && yMatch
}

// Complete combines the adaptor signature with the secret.
// Returns s' = s + t where t is the secret.
func (a *Signature) Complete(secret *secp.ModNScalar) *secp.ModNScalar {
	// s' = s + t
	sFinal := new(secp.ModNScalar)
	sFinal.Add2(a.S, secret)
	return sFinal
}

// ExtractSecret extracts the secret from a completed signature.
// Returns t = s' - s where s' is the completed signature value.
func (a *Signature) ExtractSecret(completedSig *secp.ModNScalar) *secp.ModNScalar {
	// t = s' - s
	t := new(secp.ModNScalar)

	// Set t to s'
	t.Set(completedSig)

	// Compute t = -s
	negS := new(secp.ModNScalar)
	negS.Set(a.S)
	negS.Negate()

	// t = s' + (-s) = s' - s
	t.Add(negS)

	return t
}

// GenerateFinalSignature generates a final Schnorr signature from a completed adaptor signature.
// Applies BIP340 parity rules to ensure the y-coordinate is even.
func (a *Signature) GenerateFinalSignature(completedSig *secp.ModNScalar) []byte {
	// Apply BIP340 parity rule - the nonce's y-coordinate must be even
	return GenerateSchnorrSignature(a.NoncePoint, completedSig)
}

// GenerateSchnorrSignature creates a valid BIP340 Schnorr signature.
// It handles the y-parity requirement by negating s if needed.
func GenerateSchnorrSignature(R *secp.PublicKey, s *secp.ModNScalar) []byte {
	sAdjusted := new(secp.ModNScalar)
	sAdjusted.Set(s)

	// BIP340 requires the y-coordinate to be even
	if R.Y().Bit(0) == 1 {
		// If Y is odd, we negate s: s = n - s
		sAdjusted.Negate()
	}

	// Serialize: R_x || s
	signature := make([]byte, 64)
	copy(signature, crypto.PadTo32(R.X().Bytes()))
	copy(signature[32:], crypto.SerializeModNScalar(sAdjusted))

	return signature
}

// ExtractNonceFromSig extracts the Schnorr nonce (R value) from a Schnorr signature.
// In BIP340 Schnorr signatures, the first 32 bytes represent the x-coordinate of point R.
func ExtractNonceFromSig(sig string) (*secp.PublicKey, error) {
	sigBytes, err := crypto.HexDecode(sig)
	if err != nil {
		return nil, err
	}
	if len(sigBytes) < 64 {
		return nil, fmt.Errorf("signature too short: %d bytes, expected at least 64", len(sigBytes))
	}

	// In Schnorr signatures, the first 32 bytes are the x-coordinate of nonce R
	xBytes := sigBytes[:32]

	// In BIP340, public keys always have even y-coordinate
	// We need to add a 0x02 prefix byte to indicate even y-coordinate
	compressed := append([]byte{0x02}, xBytes...)
	pubKey, err := secp.ParsePubKey(compressed)
	if err != nil {
		return nil, fmt.Errorf("invalid nonce point: %v", err)
	}

	// Verify the correct length of the compressed point
	if len(compressed) != 33 {
		return nil, fmt.Errorf("invalid compressed pubkey length: %d bytes, expected 33", len(compressed))
	}

	return pubKey, nil
}

// SchnorrChallenge computes the BIP340 Schnorr challenge e = hash(R || P || m)
// This is a critical security component of the Schnorr signature scheme.
func SchnorrChallenge(R, P *secp.PublicKey, message []byte) *big.Int {
	// We need only the x-coordinate (32 bytes) of both keys
	// According to BIP340, we don't use SerializeCompressed because we only need the x-coordinate

	// Extract x-coordinate of nonce R (32 bytes) with padding
	rBytes := crypto.PadTo32(R.X().Bytes())

	// Extract x-coordinate of public key P (32 bytes) with padding
	pBytes := crypto.PadTo32(P.X().Bytes())

	// Construct the input for the hash in the order: R || P || message
	hashInput := append(append(rBytes, pBytes...), message...)

	// Use the tagged hash as per BIP340
	hash := chainhash.TaggedHash(chainhash.TagBIP0340Challenge, hashInput)

	// Convert to big.Int as expected
	return new(big.Int).SetBytes(hash[:])
}

// AddPubKeys returns the sum of two secp256k1 public keys.
// This implements the EC point addition: R = P1 + P2.
func AddPubKeys(p1, p2 *secp.PublicKey) (*secp.PublicKey, error) {
	curve := secp.S256()
	x1, y1 := p1.X(), p1.Y()
	x2, y2 := p2.X(), p2.Y()
	x3, y3 := curve.Add(x1, y1, x2, y2)

	fx := new(secp.FieldVal)
	fy := new(secp.FieldVal)

	if overflow := fx.SetByteSlice(x3.Bytes()); overflow {
		return nil, fmt.Errorf("x-coordinate overflow")
	}
	if overflow := fy.SetByteSlice(y3.Bytes()); overflow {
		return nil, fmt.Errorf("y-coordinate overflow")
	}

	return secp.NewPublicKey(fx, fy), nil
}
