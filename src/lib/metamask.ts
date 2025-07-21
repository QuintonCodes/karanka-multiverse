import { ethers } from "ethers";
import krkuniAbi from "./krkuni-abi.json";

const BSC_CHAIN_ID_HEX = "0x38";
const KRKUNI_ADDRESS = "0x66B90D8c0314Fd63562352890cce159461D67C3D";
const KRKUNI_DECIMALS = 18;

interface EthereumProvider extends ethers.Eip1193Provider {
  on(event: "accountsChanged", listener: (accounts: string[]) => void): void;
  on(event: "chainChanged", listener: (chainId: string) => void): void;
  removeAllListeners: (event: string) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type MetaMaskWallet = {
  address: string;
  chainId: string;
  balance: string;
  isConnected: boolean;
};

export type MetaMaskError = {
  code: number;
  message: string;
};

export class MetaMaskService {
  private static instance: MetaMaskService;
  private provider: ethers.BrowserProvider | null = null;

  private constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum, "any");
    }
  }

  static getInstance(): MetaMaskService {
    if (!MetaMaskService.instance) {
      MetaMaskService.instance = new MetaMaskService();
    }
    return MetaMaskService.instance;
  }

  isInstalled(): boolean {
    return !!this.provider;
  }

  async connectWallet(): Promise<MetaMaskWallet> {
    if (!this.provider) throw new Error("MetaMask not installed");

    await this.provider.send("eth_requestAccounts", []);
    const signer = await this.provider.getSigner();
    const address = await signer.getAddress();
    const { chainId } = await this.provider.getNetwork();
    const balance = ethers.formatEther(await this.provider.getBalance(address));

    return {
      address,
      chainId: `0x${chainId.toString(16)}`,
      balance,
      isConnected: true,
    };
  }

  async ensureBscNetwork(): Promise<void> {
    if (!this.provider) throw new Error("MetaMask is not installed");

    const network = await this.provider.send("eth_chainId", []);

    if (network !== BSC_CHAIN_ID_HEX) {
      try {
        await this.provider.send("wallet_switchEthereumChain", [
          { chainId: BSC_CHAIN_ID_HEX },
        ]);
      } catch (error) {
        if ((error as MetaMaskError).code === 4902) {
          await this.provider.send("wallet_addEthereumChain", [
            {
              chainId: BSC_CHAIN_ID_HEX,
              chainName: "BNB Smart Chain",
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              rpcUrls: ["https://bsc-dataseed.binance.org/"],
              blockExplorerUrls: ["https://bscscan.com"],
            },
          ]);
        } else {
          throw error;
        }
      }
    }
  }

  async getKrkuniBalance(): Promise<string> {
    if (!this.provider) throw new Error("MetaMask not installed");
    await this.ensureBscNetwork();

    const signer = await this.provider.getSigner();
    const contract = new ethers.Contract(KRKUNI_ADDRESS, krkuniAbi, signer);
    const raw: ethers.BigNumberish = await contract.balanceOf(
      await signer.getAddress()
    );
    return ethers.formatUnits(raw, KRKUNI_DECIMALS);
  }

  /**
   * Send KRKUNI tokens.
   * @param to     Recipient address
   * @param amount Human‑readable token amount (e.g. "500")
   * @returns      Transaction hash
   */
  async sendKrkuni(to: string, amount: string): Promise<string> {
    if (!this.provider) throw new Error("MetaMask not installed");

    const signer = await this.provider.getSigner();
    const contract = new ethers.Contract(KRKUNI_ADDRESS, krkuniAbi, signer);

    const rawAmount = ethers.parseUnits(amount, KRKUNI_DECIMALS);
    // Add 5% to the sendAmount
    const sendAmount = (rawAmount * BigInt(105)) / BigInt(100);

    const tx = await contract.transfer(to, sendAmount);
    return tx.hash;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error("MetaMask not installed");

    const signer = await this.provider.getSigner();
    return await signer.signMessage(message);
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    window.ethereum?.on("accountsChanged", callback);
  }

  onChainChanged(callback: (chainId: string) => void): void {
    window.ethereum?.on("chainChanged", callback);
  }

  removeAllListeners(): void {
    window.ethereum?.removeAllListeners("accountsChanged");
    window.ethereum?.removeAllListeners("chainChanged");
  }
}
