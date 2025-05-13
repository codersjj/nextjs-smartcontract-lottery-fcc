import { cookieStorage, createConfig, createStorage, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
  connectors: [injected()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
