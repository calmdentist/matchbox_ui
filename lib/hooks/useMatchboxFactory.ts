import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { MATCHBOX_FACTORY_ADDRESS, ABIS } from '../contracts';
import { keccak256, toBytes, decodeEventLog } from 'viem';
import { useMemo } from 'react';

export function useCreateMatchbox() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Parse the transaction receipt to get the deployed Matchbox address
  const deployedAddress = useMemo(() => {
    if (!receipt || !receipt.logs) {
      return null;
    }

    try {
      // Look for the MatchboxCreated event in the logs
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: ABIS.MatchboxFactory,
            data: log.data,
            topics: log.topics,
          });
          
          // Check if this is the MatchboxCreated event
          if (decoded.eventName === 'MatchboxCreated') {
            const args = decoded.args as { matchbox?: `0x${string}` };
            return args.matchbox || null;
          }
        } catch {
          // Not the event we're looking for, continue
          continue;
        }
      }
    } catch (err) {
      console.error('Failed to parse transaction receipt:', err);
    }

    return null;
  }, [receipt]);

  const createMatchbox = async () => {
    // Generate a random salt for deterministic deployment
    const salt = keccak256(toBytes(Date.now().toString() + Math.random().toString()));
    
    writeContract({
      address: MATCHBOX_FACTORY_ADDRESS,
      abi: ABIS.MatchboxFactory,
      functionName: 'createMatchbox',
      args: [salt],
    });
  };

  return {
    createMatchbox,
    hash,
    deployedAddress,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useGetMatchboxesForOwner(owner?: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: MATCHBOX_FACTORY_ADDRESS,
    abi: ABIS.MatchboxFactory,
    functionName: 'getMatchboxesForOwner',
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!owner,
    },
  });

  return {
    matchboxes: data as `0x${string}`[] | undefined,
    isLoading,
    error,
  };
}

