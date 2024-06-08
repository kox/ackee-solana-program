// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Basic } from '../target/types/basic';
import idl from '../target/idl/basic.json';

const BasicIDL = idl;

export interface Job {
  authority: PublicKey;
  jobName: string;
  companyName: string;
  description: string;
  skills: string[];
}

export interface JobList {
  count: number;
  jobs: PublicKey[];
}

export { Basic, BasicIDL };

// The programId is imported from the program IDL.
export const BASIC_PROGRAM_ID = new PublicKey(BasicIDL.address);

// This is a helper function to get the Basic Anchor program.
export function getBasicProgram(provider: AnchorProvider) {
  return new Program(BasicIDL as Basic, provider);
}

export function getBasicProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('6y3BPsRqKBc4skcVmza2BkfRFRpd8yUjc7bYY8WyjqKc');
    case 'mainnet-beta':
    default:
      return BASIC_PROGRAM_ID;
  }
}
