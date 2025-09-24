import { formatEther, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useEnsName,
  useReadContract,
} from "wagmi";
import { bsc } from "wagmi/chains";

import krkuniAbi from "@/lib/krkuni-abi.json";
import { getChainName } from "@/lib/utils";
import { KRKUNI_TOKEN_ADDRESS, KRKUNI_TOKEN_DECIMALS } from "@/lib/wagmi";

export const DEFAULT_CHAIN = bsc;

export function useWalletConnection() {
  const { address, isConnected, connector } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const chainId = useChainId();

  // Native BNB balance
  const { data: nativeBalance } = useBalance({
    address,
    chainId: DEFAULT_CHAIN.id,
    query: {
      enabled: !!address,
      refetchInterval: 60000,
    },
  });

  const {
    data: krkuniBalanceRaw,
    isLoading: isKrkuniLoading,
    error: krkuniError,
  } = useReadContract({
    address: KRKUNI_TOKEN_ADDRESS as `0x${string}`,
    abi: krkuniAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: DEFAULT_CHAIN.id,
    query: {
      enabled: !!address && !!KRKUNI_TOKEN_ADDRESS,
      refetchInterval: 60000,
    },
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    connectors,
    connectAsync,
    isPending: isConnectLoading,
  } = useConnect();
  const isInstalled = typeof window !== "undefined" && window.ethereum;

  const formattedNativeBalance = nativeBalance
    ? Number.parseFloat(formatEther(nativeBalance.value)).toFixed(4)
    : "0.0000";

  const formattedKrkuniBalance = krkuniBalanceRaw
    ? Number.parseFloat(
        formatUnits(krkuniBalanceRaw as bigint, KRKUNI_TOKEN_DECIMALS)
      ).toFixed(4)
    : "0.0000";

  function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return {
    address,
    ensName,
    formattedAddress: address ? formatAddress(address) : undefined,
    nativeBalanceRaw: nativeBalance?.value ?? 0n,
    krkuniBalanceRaw: (krkuniBalanceRaw as bigint) ?? 0n,
    nativeBalance: formattedNativeBalance,
    nativeBalanceSymbol: "BNB",
    krkuniBalance: formattedKrkuniBalance,
    krkuniBalanceLoading: isKrkuniLoading,
    krkuniBalanceError: krkuniError,
    chainId,
    chainName: getChainName(chainId),
    connectorName: connector?.name || "Unknown",
    isConnected: isClient && isConnected,
    disconnectAsync,
    isInstalled,
    connectAsync,
    connectors,
    isConnectLoading,
  };
}
