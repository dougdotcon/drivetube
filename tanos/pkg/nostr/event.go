// Package nostr provides functionality for working with Nostr events
// and Nostr-related cryptographic operations.
package nostr

import (
	"fmt"
	"time"

	secp "github.com/btcsuite/btcd/btcec/v2"
	nostrlib "github.com/nbd-wtf/go-nostr"

	"tanos/pkg/crypto"
)

// GeneratePrivateKey creates a new random private key for Nostr.
func GeneratePrivateKey() string {
	return nostrlib.GeneratePrivateKey()
}

// GetPublicKey derives a public key from a private key.
func GetPublicKey(privateKey string) (string, error) {
	return nostrlib.GetPublicKey(privateKey)
}

// CreateSignedEvent constructs and signs a Nostr event using a given private key.
func CreateSignedEvent(privKeyHex, content string) (nostrlib.Event, error) {
	ev := nostrlib.Event{
		CreatedAt: nostrlib.Timestamp(time.Now().Unix()),
		Kind:      1, // Regular note
		Tags:      []nostrlib.Tag{},
		Content:   content,
	}

	if privKeyHex != "" {
		pub, err := nostrlib.GetPublicKey(privKeyHex)
		if err != nil {
			return nostrlib.Event{}, err
		}
		ev.PubKey = pub
	}

	if err := ev.Sign(privKeyHex); err != nil {
		return nostrlib.Event{}, err
	}

	return ev, nil
}

// ExtractSecretFromSignature extracts the secret (s value) from a Nostr signature.
// In a Schnorr signature, the second 32 bytes contain the scalar s.
func ExtractSecretFromSignature(sig string) (*secp.ModNScalar, error) {
	sigBytes, err := crypto.HexDecode(sig)
	if err != nil || len(sigBytes) < 64 {
		return nil, fmt.Errorf("invalid signature: %v", err)
	}

	// Extract the s value (bytes 32-63)
	sBytes := sigBytes[32:64]

	// Convert to ModNScalar
	secret := new(secp.ModNScalar)
	if overflow := secret.SetByteSlice(sBytes); overflow {
		return nil, fmt.Errorf("secret scalar overflow in signature")
	}

	return secret, nil
}
