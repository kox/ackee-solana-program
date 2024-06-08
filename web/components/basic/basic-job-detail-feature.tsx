'use client';

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useBasicProgram, useBasicProgramAccount } from './basic-data-access';
import { Basic, BasicIDL, Job } from '@profiler/anchor';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQueryClient, useQueries } from '@tanstack/react-query';
import { Program } from '@coral-xyz/anchor';

export default function JobAccountDetailFeature() {
  const queryClient = useQueryClient();
  const { program } = useBasicProgram();
  const pathname = usePathname()
  const accountString = pathname.substring(pathname.lastIndexOf('/') + 1);
  const account = new PublicKey(accountString);

  const { accountQuery, createJobMutation } = useBasicProgramAccount({ account });

  // Fetch details for each job account
  const jobDetailsQueries = useQueries({
    queries: (accountQuery.data?.jobs ?? []).map((jobAccountKey) => ({
      queryKey: ['jobDetails', jobAccountKey.toString()],
      queryFn: () => fetchJobDetails(jobAccountKey, program),
    })),
  });

  const jobs = useMemo(() => {
    if (jobDetailsQueries.every((query) => query.isSuccess)) {
      return jobDetailsQueries.map((query) => query.data);
    }
    return [];
  }, [jobDetailsQueries]);

  const [jobName, setJobName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    const keypair = Keypair.generate();
    await createJobMutation.mutateAsync({
      keypair,
      jobName,
      companyName,
      description,
      skills: skills.split(',').map((skill: string) => skill.trim()),
    });

    // Invalidate and refetch the job list and job details queries
    queryClient.invalidateQueries(['jobList', account.toString()]);
    (accountQuery.data?.jobs ?? []).forEach(jobAccountKey => {
      queryClient.invalidateQueries(['jobDetails', jobAccountKey.toString()]);
    });
  };

  return (
    <div>
      <h1>Jobs for Account: {accountString}</h1>

      {accountQuery.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div className="overflow-x-auto">
          <h2>Jobs</h2>
          <ul className="min-w-full border border-gray-200">
          <li className="flex border-b border-gray-200 bg-gray-100">
            <div className="w-1/4 p-2 font-semibold">Job Name</div>
            <div className="w-1/4 p-2 font-semibold">Company Name</div>
            <div className="w-1/4 p-2 font-semibold">Description</div>
            <div className="w-1/4 p-2 font-semibold">Skills</div>
          </li>
            {jobs.length > 0 ? (
              jobs.map((job: Job | undefined, index: number) => {
                if (job) {
                  return (
                    <li key={index} className='flex border-b border-gray-500 bg-gray-700'>
                      <h3 className='w-1/4 p-2 font-semibold'>{job.jobName}</h3>
                      <h4 className='w-1/4 p-2 font-semibold'>{job.companyName}</h4>
                      <p className='w-1/4 p-2 font-semibold'>{job.description}</p>
                      <p className='w-1/4 p-2 font-semibold'>Skills: {job.skills.join(', ')}</p>
                    </li>
                  );
                } else {
                  return (
                    <li key={index}>
                      <p>Job data not available</p>
                    </li>
                  );
                }
              })
            ) : (
              <p>No jobs found</p>
            )}
          </ul>
        </div>
      )}

      <h2>Add a New Job</h2>
      <form onSubmit={handleCreateJob}>
        <div>
          <label>Job Name</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Skills (comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-xs lg:btn-md btn-primary"
          type="submit"
          disabled={createJobMutation.isPending}
        >
          Create Job {createJobMutation.isPending && '...'}
        </button>
      </form>
    </div>
  );
}

async function fetchJobDetails(jobAccountKey: PublicKey, program: Program<Basic>): Promise<Job> {
  return program.account.job.fetch(jobAccountKey);
}

