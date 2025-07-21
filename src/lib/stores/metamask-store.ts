import { create } from "zustand";

type MetaMaskState = {
  address: string | null;
  balance: string;
  chainId: string;
  isConnected: boolean;
  setWallet: (wallet: {
    address: string;
    balance: string;
    chainId: string;
  }) => void;
  disconnect: () => void;
};

export const useMetaMaskStore = create<MetaMaskState>((set) => ({
  address: null,
  balance: "0",
  chainId: "",
  isConnected: false,
  setWallet: ({ address, balance, chainId }) =>
    set({ address, balance, chainId, isConnected: true }),
  disconnect: () =>
    set({ address: null, balance: "0", chainId: "", isConnected: false }),
}));
