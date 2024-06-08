import * as anchor from '@coral-xyz/anchor';
import { Basic } from '../target/types/basic';
import assert from 'assert';

describe('basic', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Basic as anchor.Program<Basic>;

  it('Initializes the job list', async () => {
    const [jobListPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("job_list")],
      program.programId
    );

    await program.methods.initialize()
    .accounts({
      jobList: jobListPDA,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

    const account = await program.account.jobList.fetch(jobListPDA);
    console.log(account);
    assert.strictEqual(account.count.toNumber(), 0);
    assert.strictEqual(account.jobs.length, 0);
  });

  /* TODO: Need to fix an error while initializing

  it('Creates multiple jobs', async () => {
    const [jobListPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("job_list")],
      program.programId
    );

    // Initialize the job list
    await program.methods.initialize()
      .accounts({
        jobList: jobListPDA,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();


    const jobs = [
      {
        keypair: anchor.web3.Keypair.generate(),
        jobName: "Frontend Developer",
        companyName: "XYZ Inc",
        description: "Build and maintain web applications.",
        skills: ["JavaScript", "React", "CSS"]
      },
      {
        keypair: anchor.web3.Keypair.generate(),
        jobName: "Backend Developer",
        companyName: "XYZ Inc",
        description: "Develop server-side logic.",
        skills: ["Node.js", "Express", "MongoDB"]
      }
    ];

    for (const job of jobs) {
      await program.methods.createJob(
        job.jobName,
        job.companyName,
        job.description,
        job.skills
      )
      .accounts({
        job: job.keypair.publicKey,
        jobList: jobListPDA,
        // jobList: jobList.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([job.keypair])
      .rpc();

      const account = await program.account.job.fetch(job.keypair.publicKey);
      console.log(account);
      assert.strictEqual(account.jobName, job.jobName);
      assert.strictEqual(account.companyName, job.companyName);
      assert.strictEqual(account.description, job.description);
      assert.deepStrictEqual(account.skills, job.skills);
    }

    // Fetch the job list
    const jobListAccount = await program.account.jobList.fetch(jobListPDA);
    // const jobListAccount = await program.account.jobList.fetch(jobList.publicKey);
    console.log(jobListAccount);
    assert.strictEqual(jobListAccount.count.toNumber(), 2);
    assert.strictEqual(jobListAccount.jobs.length, 2);
  }); */
});
