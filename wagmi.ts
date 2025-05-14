"use client"

import { cookieStorage, createConfig, createStorage, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"

// export const config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http()
//   },
//   connectors: [injected()],
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage
//   })
// })

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
  ssr: true // If your dApp uses server side rendering (SSR)
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
