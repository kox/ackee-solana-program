'use client';

import { Keypair } from '@solana/web3.js';
import { useBasicProgram } from './basic-data-access';

export function InitializeJobList({
  jobListKeypair
}: {
  jobListKeypair: Keypair
}) {
  const { initializeJobList } = useBasicProgram();

  /* if (getJobListAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (getJobListAccount.data?.value) {
    return null; // Job list already initialized
  } */

  return (
    <>
      <h3>Initialize Job List</h3>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => initializeJobList.mutateAsync(jobListKeypair)}
        disabled={initializeJobList.isPending}
      >
        Initialize {initializeJobList.isPending && '...'}
      </button>
    </>
  );
}


/* export function InitializeJobList() {
  const { initializeJobList } = useBasicProgram();

  return (
    <>
      <h3>Initialize Job List</h3>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => initializeJobList.mutate()}
        disabled={initializeJobList.isPending}
      >
        Initialize {initializeJobList.isPending && '...'}
      </button>
    </>
  );
} */
