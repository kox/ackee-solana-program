use anchor_lang::prelude::*;

declare_id!("6y3BPsRqKBc4skcVmza2BkfRFRpd8yUjc7bYY8WyjqKc");

#[program]
pub mod basic {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
      let job_list = &mut ctx.accounts.job_list;
      job_list.count = 0;
      Ok(())
  }

    pub fn create_job(
      ctx: Context<CreateJob>,
      job_name: String,
      company_name: String,
      description: String,
      skills: Vec<String>,
    ) -> Result<()> {
        let job = &mut ctx.accounts.job;
        job.authority = *ctx.accounts.authority.key;
        job.job_name = job_name;
        job.company_name = company_name;
        job.description = description;
        job.skills = skills;

        let job_list = &mut ctx.accounts.job_list;
        job_list.jobs.push(job.key());
        job_list.count += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
      init,
      payer = authority,
      space = 8 + 8 + 32 * 100,
      seeds = [b"job_list"],
      bump,
    )] // 100 job listings initially
    pub job_list: Account<'info, JobList>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateJob<'info> {
    // #[account(init, payer = authority, space = 8 + 32 + 32 + 256 + 4 * 10 + 32 * 10)]
    #[account(init, payer = authority, space = 8 + 128 + 128 + 512 + 32 * 10)] // Adjust space as needed
    pub job: Account<'info, Job>,
    #[account(
      mut,
      seeds = [b"job_list"],
      bump,
  )]
    pub job_list: Account<'info, JobList>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Job {
    pub authority: Pubkey,
    pub job_name: String,
    pub company_name: String,
    pub description: String,
    pub skills: Vec<String>,
}

#[account]
pub struct JobList {
    pub count: u64,
    pub jobs: Vec<Pubkey>,
}
