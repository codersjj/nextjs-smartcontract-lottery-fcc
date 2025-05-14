"use client"

import { cookieToInitialState, type State, WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
  initialState: State | undefined
}

export function Providers({ children, initialState }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
