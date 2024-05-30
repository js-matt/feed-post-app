use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("11111111111111111111111111111111");

#[program]
mod post_feed_app {
    use super::*;
    pub fn create_post(
        ctx: Context<CreatePost>,
        text: String,
        media: String,
        position: i64,
        admin: bool,
    ) -> ProgramResult {
        let post = &mut ctx.accounts.feed_post_app;
        post.admin = admin;
        post.media = media;
        post.position = position;
        post.text = text;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(init, payer = user, space=9000)]
    pub feed_post_app: Account<'info, FeedPostApp>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct FeedPostApp {
    pub text: String,
    pub media: String,
    pub position: i64,
    pub admin: bool,
}
