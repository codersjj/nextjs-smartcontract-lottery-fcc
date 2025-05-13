"use client"

import { cookieToInitialState, type State, WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/wagmi"

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
  initialState: State | undefined
}

export function Providers({ children, initialState }: Props) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
