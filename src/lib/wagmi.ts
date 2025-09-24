import { createConfig, http } from "wagmi";
import { bsc, bscTestnet, mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, bsc, bscTestnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Karanka Multiverse dApp",
        url: typeof window !== "undefined" ? window.location.origin : "",
        // iconUrl: "https://wagmi.io/favicon.ico",
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  ssr: true,
});

// TODO: Change this later
export const KRKUNI_TOKEN_ADDRESS =
  "0x66b90d8c0314fd63562352890cce159461d67c3d";
export const KRKUNI_TOKEN_DECIMALS = 18;
export const KRKUNI_TOKEN_SYMBOL = "KRKUNI";
export const KRKUNI_TOKEN_NAME = "Karanka Universe Token";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
