// Importing the Anchor framework's prelude, which includes commonly used types, macros, and functions.
// This is like importing a standard library for Anchor, giving you access to tools for Solana development.
use anchor_lang::prelude::*;

// This macro declares the unique program ID for your Solana program.
// Think of it as the address of your smart contract on the Solana blockchain.
// The string "3i37TGWLibt8YpYaKjpxoMPbabVzPZPsKZVDyFAaE5UP" is a public key generated for your program.
// You'll need this ID when deploying the program to Solana, and it ensures your program is uniquely identifiable.
declare_id!("3i37TGWLibt8YpYaKjpxoMPbabVzPZPsKZVDyFAaE5UP");

// The #[program] attribute marks this module as a Solana program (smart contract).
// It tells Anchor that the functions inside this module are entry points that can be called from the blockchain.
// The module name "hello_world" is the name of your program, and it can be anything you choose.
#[program]
pub mod hello_world {
    // This brings in everything from the parent scope (like the Anchor prelude) into this module.
    // It ensures you can use Anchor's types and functions inside this module without extra imports.
    use super::*;

    // This is your first function (or "instruction") in the program, named "initialize".
    // In Solana, functions like this are entry points that clients (like your frontend) can call.
    // The function takes a "ctx" parameter of type Context<Initialize>, which holds the accounts and program data.
    // It returns a Result<()> type, meaning it either succeeds (Ok(())) or fails with an error (Err).
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // The msg! macro logs a message to the Solana blockchain's logs.
        // Here, it prints "Greetings from: " followed by the program ID (the one declared above).
        // The {:?} is a Rust debug placeholder, and ctx.program_id is the ID of this program.
        // This is useful for debugging or confirming that the program ran.
        msg!("Greetings from: {:?}", ctx.program_id);
        
        // This returns Ok(()), indicating the function executed successfully.
        // In Solana, returning Ok(()) means the transaction completed without errors.
        // If there were an error, you’d return Err with an error type, but here it’s a simple success.
        Ok(())
    }
}

// This #[derive(Accounts)] attribute tells Anchor to automatically generate code for handling accounts.
// The struct "Initialize" defines the accounts required for the "initialize" function above.
// In Solana, every function call (instruction) needs to specify which accounts it will read from or write to.
#[derive(Accounts)]
pub struct Initialize {
    // Currently, this struct is empty, meaning the "initialize" function doesn’t require any specific accounts.
    // In a real program, you’d list accounts here, like a user account or a data account to store state.
    // For example, you might add something like:
    // #[account(mut)] pub user: Signer<'info>,
    // This would mean the function expects a mutable account (mut) that signs the transaction (Signer).
}