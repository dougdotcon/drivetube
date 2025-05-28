// Package crypto provides cryptographic utilities for the TANOS library.
package crypto

import (
	"encoding/hex"
	"fmt"
	"math/big"

	"github.com/btcsuite/btcd/btcec/v2"
)

// HexEncode converts a byte slice to a hexadecimal string.
func HexEncode(data []byte) string {
	return hex.EncodeToString(data)
}

// HexDecode converts a hexadecimal string to a byte slice.
func HexDecode(s string) ([]byte, error) {
	return hex.DecodeString(s)
}

// PadTo32 adds left zero-padding to ensure the slice has 32 bytes.
// This is optimized to avoid unnecessary allocations by using a fixed-size array.
func PadTo32(b []byte) []byte {
	if len(b) >= 32 {
		return b[:32] // return only the first 32 bytes if larger
	}

	// Create a fixed array and copy directly to the correct position
	var padded [32]byte
	copy(padded[32-len(b):], b) // copy directly at the right position
	return padded[:]
}

// SerializeModNScalar converts a ModNScalar to []byte
func SerializeModNScalar(s *btcec.ModNScalar) []byte {
	var b [32]byte
	s.PutBytes(&b)
	return b[:]
}

// NegatePoint returns a new point that is the negation (-P) of the input point P.
// In elliptic curve cryptography, negating a point means keeping the same x-coordinate
// but negating the y-coordinate.
func NegatePoint(p *btcec.PublicKey) (*btcec.PublicKey, error) {
	// Create a new point with the same X but negated Y
	fx := new(btcec.FieldVal)
	fy := new(btcec.FieldVal)

	// Copy X
	if overflow := fx.SetByteSlice(p.X().Bytes()); overflow {
		return nil, fmt.Errorf("x-coordinate overflow when negating point")
	}

	// Negate Y value (p - y) where p is the field prime
	negY := new(big.Int).Sub(btcec.S256().P, p.Y())

	if overflow := fy.SetByteSlice(negY.Bytes()); overflow {
		return nil, fmt.Errorf("y-coordinate overflow when negating point")
	}

	return btcec.NewPublicKey(fx, fy), nil
}
