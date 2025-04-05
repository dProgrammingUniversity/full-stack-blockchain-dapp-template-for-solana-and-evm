use anchor_lang::prelude::*;

declare_id!("B3bja5VkrceMnN5b6wQZy3CKKB8eE58XGVnwMKRHMnYe");

#[program]
pub mod hello_web3_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Get the message account from context
        let message_account = &mut ctx.accounts.message;
        
        // Set the message content
        message_account.content = String::from("Hello Web3 World On Solana Blockchain");
        
        // Log the action (optional but helpful for debugging)
        msg!("Message initialized on-chain: {}", message_account.content);
        
        Ok(())
    }

    pub fn get_message(ctx: Context<GetMessage>) -> Result<()> {
        // Get the message account
        let message_account = &ctx.accounts.message;
        
        // Log the message (optional)
        msg!("Retrieved message from chain: {}", message_account.content);
        
        Ok(())
    }
}

// Account structure to store our message
#[account]
pub struct MessageAccount {
    pub content: String,    // Stores our message string
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,                 // This is a new account
        payer = user,        // The user pays for account creation
        space = 8 + 100,     // 8 bytes for discriminator + 100 bytes for message
    )]
    pub message: Account<'info, MessageAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetMessage<'info> {
    #[account()]
    pub message: Account<'info, MessageAccount>,
}