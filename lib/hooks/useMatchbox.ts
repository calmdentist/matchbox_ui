import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ABIS } from '../contracts';
import { Rule } from '../types';
import { parseUnits } from 'viem';

export function useInitializeSequence(matchboxAddress?: `0x${string}`) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const initializeSequence = async (rules: Rule[]) => {
    if (!matchboxAddress) {
      throw new Error('Matchbox address is required');
    }

    writeContract({
      address: matchboxAddress,
      abi: ABIS.Matchbox,
      functionName: 'initializeSequence',
      args: [rules],
    });
  };

  return {
    initializeSequence,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useExecuteFirstStep(matchboxAddress?: `0x${string}`) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const executeFirstStep = async (amountInUSDC: string, orderData: `0x${string}`) => {
    if (!matchboxAddress) {
      throw new Error('Matchbox address is required');
    }

    // Parse USDC amount (6 decimals)
    const amount = parseUnits(amountInUSDC, 6);

    writeContract({
      address: matchboxAddress,
      abi: ABIS.Matchbox,
      functionName: 'executeFirstStep',
      args: [amount, orderData],
    });
  };

  return {
    executeFirstStep,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useWithdrawFunds(matchboxAddress?: `0x${string}`) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdrawFunds = async (token: `0x${string}`, amount: bigint) => {
    if (!matchboxAddress) {
      throw new Error('Matchbox address is required');
    }

    writeContract({
      address: matchboxAddress,
      abi: ABIS.Matchbox,
      functionName: 'withdrawFunds',
      args: [token, amount],
    });
  };

  return {
    withdrawFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useGetSequence(matchboxAddress?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: matchboxAddress,
    abi: ABIS.Matchbox,
    functionName: 'getSequence',
    query: {
      enabled: !!matchboxAddress,
    },
  });

  return {
    sequence: data as Rule[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

export function useGetCurrentStep(matchboxAddress?: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: matchboxAddress,
    abi: ABIS.Matchbox,
    functionName: 'currentStep',
    query: {
      enabled: !!matchboxAddress,
    },
  });

  return {
    currentStep: data as bigint | undefined,
    isLoading,
    error,
  };
}

export function useIsActive(matchboxAddress?: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: matchboxAddress,
    abi: ABIS.Matchbox,
    functionName: 'isActive',
    query: {
      enabled: !!matchboxAddress,
    },
  });

  return {
    isActive: data as boolean | undefined,
    isLoading,
    error,
  };
}

