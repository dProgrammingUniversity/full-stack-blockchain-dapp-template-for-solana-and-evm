// Importing the Anchor framework's JavaScript/TypeScript library.
// This library provides tools to interact with Solana programs, like sending transactions and querying data.
// It’s used here to test your `hello_world` program.
import * as anchor from "@coral-xyz/anchor";

// Importing the `Program` type from Anchor.
// This type represents your Solana program (smart contract) in TypeScript, allowing you to call its functions.
import { Program } from "@coral-xyz/anchor";

// Importing the TypeScript types generated for your `hello_world` program.
// These types are automatically created by Anchor based on your Rust program (from the earlier code).
// They define the structure of your program, including its instructions (like `initialize`) and accounts.
import { HelloWorld } from "../target/types/hello_world";

// The `describe` block is part of a testing framework (Mocha, used by Anchor).
// It groups related tests together under a name, here "hello_world", to organize your test suite.
// Think of it as a way to say, "These are all the tests for the hello_world program."
describe("hello_world", () => {
  // This line sets up the Anchor client to use the local Solana cluster for testing.
  // `anchor.AnchorProvider.env()` automatically configures the provider based on your environment.
  // By default, it connects to a local Solana cluster (running on your machine at `http://127.0.0.1:8899`).
  // A provider is like a bridge between your test and the Solana blockchain—it handles wallet signing, network connections, etc.
  anchor.setProvider(anchor.AnchorProvider.env());

  // This line creates a program instance for your `hello_world` program.
  // `anchor.workspace.helloWorld` loads the program from your project’s workspace (defined in `Anchor.toml`).
  // `as Program<HelloWorld>` casts it to the `Program` type with the `HelloWorld` TypeScript interface.
  // This `program` object lets you call the `initialize` function and interact with your program on the blockchain.
  const program = anchor.workspace.helloWorld as Program<HelloWorld>;

  // The `it` block defines a single test case, named "Is initialized!".
  // This test will call the `initialize` function in your program and verify that it works.
  // `async () => {}` indicates this test is asynchronous because it interacts with the blockchain, which takes time.
  it("Is initialized!", async () => {
    // This line calls the `initialize` function on your program.
    // `program.methods.initialize()` prepares the instruction to call `initialize` (from your Rust program).
    // `.rpc()` sends the transaction to the Solana cluster and waits for it to be confirmed.
    // The result, `tx`, is the transaction signature (a unique ID for the transaction on the blockchain).
    const tx = await program.methods.initialize().rpc();

    // This logs the transaction signature to the console so you can see it after the test runs.
    // You can use this signature to look up the transaction on the Solana blockchain (e.g., using a blockchain explorer).
    // For example, if you’re testing on a local cluster, you might check the logs to see the "Greetings from: ..." message.
    console.log("Your transaction signature", tx);
  });
});