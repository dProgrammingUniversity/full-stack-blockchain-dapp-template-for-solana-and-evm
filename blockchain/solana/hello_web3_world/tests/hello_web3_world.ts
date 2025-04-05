import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWeb3World } from "../target/types/hello_web3_world";
import { expect } from "chai";

describe("hello_web3_world", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HelloWeb3World as Program<HelloWeb3World>;
  
  // We'll use this message account for testing
  const messageAccount = anchor.web3.Keypair.generate();

  // Configure longer timeout for devnet
  const opts = {
    commitment: 'confirmed' as anchor.web3.Commitment,
    preflightCommitment: 'processed' as anchor.web3.Commitment,
    maxRetries: 5,
  };

  it("Initialize message on chain", async () => {
    try {
      // Initialize the message account
      const tx = await program.methods
        .initialize()
        .accounts({
          message: messageAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .signers([messageAccount])
        .rpc(opts);

      console.log("Initialize transaction signature:", tx);

      // Wait for transaction confirmation with longer timeout
      await provider.connection.confirmTransaction({
        signature: tx,
        blockhash: (await provider.connection.getLatestBlockhash()).blockhash,
        lastValidBlockHeight: (await provider.connection.getLatestBlockhash()).lastValidBlockHeight,
      }, 'confirmed');

      // Fetch the created account
      const account = await program.account.messageAccount.fetch(messageAccount.publicKey);
      console.log("On-chain message:", account.content);
      
      // Verify the message content
      expect(account.content).to.equal("Hello Web3 World On Solana Blockchain");
    } catch (error) {
      console.error("Error details:", error);
      throw error;
    }
  });

  it("Can retrieve message from chain", async () => {
    try {
      // Call get_message to retrieve the stored message
      const tx = await program.methods
        .getMessage()
        .accounts({
          message: messageAccount.publicKey,
        })
        .rpc(opts);

      console.log("Get message transaction signature:", tx);

      // Wait for transaction confirmation with longer timeout
      await provider.connection.confirmTransaction({
        signature: tx,
        blockhash: (await provider.connection.getLatestBlockhash()).blockhash,
        lastValidBlockHeight: (await provider.connection.getLatestBlockhash()).lastValidBlockHeight,
      }, 'confirmed');

      // Fetch and verify the message again
      const account = await program.account.messageAccount.fetch(messageAccount.publicKey);
      expect(account.content).to.equal("Hello Web3 World On Solana Blockchain");
    } catch (error) {
      console.error("Error details:", error);
      throw error;
    }
  });
});