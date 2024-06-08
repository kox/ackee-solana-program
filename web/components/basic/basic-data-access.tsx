'use client';

import { useMemo } from 'react';
import { getBasicProgram, getBasicProgramId } from '@profiler/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey  } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useBasicProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBasicProgramId(cluster.network as Cluster),
    [cluster]
  );

  const program = getBasicProgram(provider);

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initializeJobList = useMutation({
    mutationKey: ['jobs', 'initialize', { cluster }],
    mutationFn: async (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({
          jobList: keypair.publicKey
        })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Job list initialized successfully!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to initialize job list');
    },
  });

  const accounts = useQuery({
    queryKey: ['jobs', 'all', { cluster }],
    queryFn: () => program.account.jobList.all(),
  });

  return {
    program,
    programId,
    getProgramAccount,
    accounts,
    initializeJobList,
    // createJobMutation,
  };
}


export function useBasicProgramAccount({ account }: { account: PublicKey}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useBasicProgram();

  const accountQuery = useQuery({
    queryKey: ['jobs', 'fetch', { cluster, account }],
    queryFn: () => program.account.jobList.fetch(account),
  });

  const createJobMutation = useMutation({
    mutationKey: ['jobs', 'createJob', {cluster}],
    mutationFn: async ({
      keypair,
      jobName,
      companyName,
      description,
      skills,
    }: {
      keypair: Keypair;
      jobName: string;
      companyName: string;
      description: string;
      skills: string[];
    }) => {
      console.log('create job');
      console.log(jobName);
      console.log(keypair.publicKey);
      return program.methods
        .createJob(
          jobName,
          companyName,
          description,
          skills
        )
        .accounts({
          jobList: account,
          job: keypair.publicKey,
          // jobList: keypair.publicKey
        })
        .signers([keypair])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Job created successfully!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create job');
    },
  });


  /* const jobs = useQuery({
    queryKey: ['']
  }) */



  /* const program = getCounterProgram(provider);


  const [jobListPDA, setJobListPDA] = useState<PublicKey | null>(null);

  const program = getBasicProgram(provider);

  useEffect(() => {
    (async () => {
      const [pda] = await PublicKey.findProgramAddress(
        [Buffer.from('job_list')],
        program.programId
      );
      setJobListPDA(pda);
    })();
  }, [program.programId]);

  const programId = program.idl.address;

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(new PublicKey(programId)),
  });

  const getJobListAccount = useQuery({
    queryKey: ['get-job-list-account', { cluster }],
    queryFn: () => {
      if (!jobListPDA) throw new Error('Job list PDA not initialized');
      return connection.getParsedAccountInfo(jobListPDA);
    },
    enabled: !!jobListPDA, // Only run the query if jobListPDA is initialized
  });

  const initializeJobList = useMutation({
    mutationKey: ['initializeJobList'],
    mutationFn: async () => {
      if (!jobListPDA) throw new Error('Job list PDA not initialized');
      return program.methods
        .initialize()
        .accounts({
          jobList: jobListPDA,
          authority: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        // .signers([provider.wallet])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Job list initialized successfully!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to initialize job list');
    },
  });

  const createJobMutation = useMutation({
    mutationKey: ['jobPosting', 'createJob'],
    mutationFn: async ({
      keypair,
      jobName,
      companyName,
      description,
      skills,
    }: {
      keypair: Keypair;
      jobName: string;
      companyName: string;
      description: string;
      skills: string[];
    }) => {
      if (!jobListPDA) throw new Error('Job list PDA not initialized');
      return program.methods
        .createJob(jobName, companyName, description, skills)
        .accounts({
          job: keypair.publicKey,
          jobList: jobListPDA,
          authority: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Job created successfully!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create job');
    },
  }); */


  return {
    /*program,
    programId,
    getProgramAccount,
     getJobListAccount,
    initializeJobList,*/
    accountQuery,
    createJobMutation,
  };
}



export const saveKeypair = (keypair: Keypair, keyName: string) => {
  localStorage.setItem(keyName, JSON.stringify(Array.from(keypair.secretKey)));
};

export const loadKeypair = (keyName: string): Keypair | null => {
  const storedKey = localStorage.getItem(keyName);
  if (storedKey) {
    const secretKey = new Uint8Array(JSON.parse(storedKey));
    return Keypair.fromSecretKey(secretKey);
  }
  return null;
};
