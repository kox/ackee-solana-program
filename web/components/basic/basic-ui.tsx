'use client';

import { useMemo } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useBasicProgram, useBasicProgramAccount } from './basic-data-access';
import { InitializeJobList } from './basic-initialize-job-list';
import { useRouter } from 'next/navigation';

export function BasicCreate() {
  const { initializeJobList } = useBasicProgram();

  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => initializeJobList.mutateAsync(Keypair.generate())}
      disabled={initializeJobList.isPending}
    >
      Create {initializeJobList.isPending && '...'}
    </button>
  );
}

export function BasicJobList() {
  const { accounts, getProgramAccount } = useBasicProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <JobListCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

export function BasicProgram() {
  const { accounts, getProgramAccount } = useBasicProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <JobListCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}

      <pre>{JSON.stringify(getProgramAccount.data.value, null, 2)}</pre>
    </div>
  );
}


function JobListCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
  } = useBasicProgramAccount({ account });

  const router = useRouter();

  const jobs = useMemo(
    () => accountQuery.data?.jobs ?? 0,
    [accountQuery.data?.jobs]
  );

  const handleClick = () => {
    router.push(`/jobs/${account.toString()}`);
  };

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div
      className="card card-bordered border-base-300 border-4 text-neutral-content cursor-pointer"
      onClick={handleClick}
    >
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h3>Job List</h3>
          <p>{account.toString()}</p>
        </div>
      </div>
    </div>
  );
}
