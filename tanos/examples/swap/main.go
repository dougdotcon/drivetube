// An example implementation of a TANOS (Taproot Adaptor for Nostr-Orchestrated Swaps) atomic swap.
// This demonstrates how to use the TANOS library to swap a Nostr event signature for Bitcoin.
package main

import (
	"fmt"

	"github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/chaincfg"

	"tanos/pkg/bitcoin"
	"tanos/pkg/crypto"
	"tanos/pkg/nostr"
	"tanos/pkg/tanos"
)

func main() {
	fmt.Println("TANOS: Taproot Adaptor for Nostr-Orchestrated Swaps")
	fmt.Println("------------------------------------------------------")

	// Step 1: Create a seller (Nostr content creator)
	sellerPrivKey := nostr.GeneratePrivateKey()
	seller, err := tanos.NewSeller(sellerPrivKey)
	if err != nil {
		panic(fmt.Errorf("failed to create seller: %v", err))
	}
	fmt.Println("Seller Public Key:", seller.NostrPubKey)

	// Step 2: Create a buyer (Bitcoin holder)
	buyer, err := tanos.NewBuyer()
	if err != nil {
		panic(fmt.Errorf("failed to create buyer: %v", err))
	}
	fmt.Println("Buyer Public Key:", crypto.HexEncode(buyer.PublicKey.SerializeCompressed()))

	// Step 3: Seller creates a Nostr event (but keeps signature secret initially)
	err = seller.CreateEvent("Nostr event for TANOS atomic swap")
	if err != nil {
		panic(fmt.Errorf("failed to create event: %v", err))
	}
	fmt.Println("Event ID:", seller.Event.ID)
	fmt.Println("Nonce R (from nostr sig):", crypto.HexEncode(seller.Nonce.SerializeCompressed()))
	fmt.Println("Adaptor Commitment Point (T):", crypto.HexEncode(seller.Commitment.SerializeCompressed()))

	// Step 4: Buyer creates and broadcasts a Bitcoin transaction with funds
	// IMPORTANT: Buyer pays Bitcoin to obtain the Nostr signature
	fmt.Println("\n--- Bitcoin Transaction Setup (Locking Phase) ---")
	params := &chaincfg.TestNet3Params
	dummyPrevTxID := "0000000000000000000000000000000000000000000000000000000000000000"
	dummyPrevOutputIndex := uint32(0)

	err = buyer.CreateLockingTransaction(
		100000, // 0.001 BTC in satoshis
		dummyPrevTxID,
		dummyPrevOutputIndex,
		params,
	)
	if err != nil {
		panic(fmt.Errorf("failed to create locking transaction: %v", err))
	}

	// Generate transaction and verify it's valid
	_, err = bitcoin.SerializeTx(buyer.LockingTx)
	if err != nil {
		panic(err)
	}
	fmt.Println("Bitcoin Transaction (locking funds) Ready for Broadcast:")
	fmt.Println("Transaction hash:", buyer.LockingTx.TxHash().String())
	fmt.Println("Buyer locks Bitcoin in a transaction that can only be spent with knowledge of the Nostr signature")

	// Step 5: Buyer creates an adaptor signature
	err = buyer.CreateAdaptorSignature(seller.Commitment)
	if err != nil {
		panic(fmt.Errorf("failed to create adaptor signature: %v", err))
	}
	fmt.Println("Bitcoin Adaptor Signature created")

	// Verify the adaptor signature
	if buyer.VerifyAdaptorSignature(seller.Commitment) {
		fmt.Println("Bitcoin adaptor signature verification: VALID")
	} else {
		fmt.Println("Bitcoin adaptor signature verification: INVALID")
	}

	// Step 6: Swap execution - Seller reveals Nostr signature to complete the swap
	fmt.Println("\n--- Swap Execution (Exchange Phase) ---")
	fmt.Println("Seller reveals Nostr signature spending the transaction:", seller.Event.Sig)

	// Step 7: Buyer completes the Bitcoin signature using the revealed Nostr signature
	finalSig, err := buyer.CompleteAdaptorSignature(seller.Event.Sig)
	if err != nil {
		panic(fmt.Errorf("failed to complete adaptor signature: %v", err))
	}
	fmt.Println("Final Bitcoin Schnorr Signature:", crypto.HexEncode(finalSig))

	// Step 8: Buyer verifies the signature and uses the authentic Nostr event
	fmt.Println("\n--- Nostr Event Authentication ---")

	// Extract the secret from the completed signature
	completedSigBytes := finalSig[32:]
	completedSigScalar := new(btcec.ModNScalar)
	if overflow := completedSigScalar.SetByteSlice(completedSigBytes); overflow {
		panic(fmt.Errorf("scalar overflow in completed signature"))
	}

	// Verify the secret matches
	matches, err := buyer.VerifyNostrSecret(completedSigScalar, seller.Event.Sig)
	if err != nil {
		panic(fmt.Errorf("failed to verify secret: %v", err))
	}
	fmt.Printf("Nostr signature verification: %v\n", matches)
}
