package adaptor

import (
	"bytes"
	"encoding/hex"
	"testing"

	"github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/chaincfg/chainhash"

	"tanos/pkg/crypto"
)

// generatePrivKey creates a test private key
func generatePrivKey() *btcec.PrivateKey {
	priv, err := btcec.NewPrivateKey()
	if err != nil {
		panic(err)
	}
	return priv
}

// TestAdaptorSignatureVerification tests the creation and verification of adaptor signatures
// focusing on BIP340 parity handling.
func TestAdaptorSignatureVerification(t *testing.T) {
	// Generate test keys
	privKey := generatePrivKey()

	// Generate a test message (simulating a transaction hash)
	message := chainhash.DoubleHashB([]byte("test message for adaptor signature"))

	// Generate a test adaptor point (simulating a commitment point)
	adaptorPrivKey := generatePrivKey()
	adaptorPoint := adaptorPrivKey.PubKey()

	// Create the adaptor signature
	adaptorSig, err := New(privKey, adaptorPoint, message)
	if err != nil {
		t.Fatalf("Failed to create adaptor signature: %v", err)
	}

	// Verify the adaptor signature
	if !adaptorSig.Verify(adaptorPoint) {
		t.Fatalf("Adaptor signature failed verification")
	}

	// Secret from the adaptor
	secret := generatePrivKey().Key

	// Complete the signature with the secret
	completedSig := adaptorSig.Complete(&secret)

	// Generate the final signature
	finalSig := adaptorSig.GenerateFinalSignature(completedSig)

	// Extract the secret back from the completed signature
	extractedSecret := adaptorSig.ExtractSecret(completedSig)

	// Verify the extracted secret matches the original
	secretBytes := crypto.SerializeModNScalar(&secret)
	extractedSecretBytes := crypto.SerializeModNScalar(extractedSecret)
	if !bytes.Equal(secretBytes, extractedSecretBytes) {
		t.Fatalf("Extracted secret doesn't match original")
	}

	t.Logf("Adaptor signature verification successful")
	t.Logf("Final signature: %s", hex.EncodeToString(finalSig))
}

// TestParityHandling tests the adaptor signature verification with both even and odd Y coordinates
// to ensure proper BIP340 parity handling.
func TestParityHandling(t *testing.T) {
	testCases := 10 // Run multiple tests to increase chances of hitting both even and odd cases
	var evenCases, oddCases int

	for i := 0; i < testCases; i++ {
		// Generate a fresh set of keys and message for each test
		privKey := generatePrivKey()
		message := chainhash.DoubleHashB([]byte("test message " + string(rune(i))))
		adaptorPrivKey := generatePrivKey()
		adaptorPoint := adaptorPrivKey.PubKey()

		// Create the adaptor signature
		adaptorSig, err := New(privKey, adaptorPoint, message)
		if err != nil {
			t.Fatalf("Test %d: Failed to create adaptor signature: %v", i, err)
		}

		// Check the parity of R'.Y
		isOdd := adaptorSig.NoncePoint.Y().Bit(0) == 1
		if isOdd {
			oddCases++
		} else {
			evenCases++
		}

		// Verify the adaptor signature
		if !adaptorSig.Verify(adaptorPoint) {
			t.Fatalf("Test %d: Adaptor signature failed verification (R'.Y is odd: %v)", i, isOdd)
		}

		t.Logf("Test %d: Verified adaptor signature with R'.Y parity: %v", i, isOdd)
	}

	t.Logf("Successfully verified %d signatures (%d with even Y, %d with odd Y)",
		testCases, evenCases, oddCases)
}
