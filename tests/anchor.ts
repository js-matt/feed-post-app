import BN from "bn.js";
import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { PostFeedApp } from "../target/types/post_feed_app";

describe("Test", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PostFeedApp as anchor.Program<PostFeedApp>;
  
  it("create_post", async () => {
    // Generate keypair for the new account
    const newAccountKp = new web3.Keypair();

    // Send transaction
    const num = new BN(2);
    const feedPostApp = anchor.web3.Keypair.generate();
    const txHash = await program.methods
      .createPost("hello", "www.imagrurl.com", num, false)
      .accounts({
        feedPostApp: feedPostApp.publicKey,
        user: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([newAccountKp])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await program.provider.connection.confirmTransaction(txHash);

    // Fetch the created account
    const account = await program.account.feedPostApp.fetch(
      feedPostApp.publicKey
    ); //get the accounts info from this fetch
    //const tx = await program.rpc.initialize();
    //console.log("Your transaction signature", tx);
    assert.ok(account.media === "www.imagrurl.com");
    assert.ok(account.admin === false);
    assert.ok(account.text === "hello");
    assert.ok(account.position === num);
  });
});
