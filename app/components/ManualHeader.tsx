"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { formatAddress } from "@/app/utils"

export default function ManualHeader() {
  const { address, isConnected, status } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const formattedAddress = formatAddress(address)
  const isConnecting = status === "connecting" || status === "reconnecting"

  const handleConnect = () => {
    if (isConnecting) return
    connect({ connector: connectors[0] })
  }

  return (
    <div className="p-4">
      {isConnected ? (
        <div className="flex items-center gap-4">
          <p className="text-sm">Connected to {formattedAddress}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
          aria-disabled={isConnecting}
          aria-label={isConnecting ? "Connecting wallet..." : "Connect wallet"}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  )
}
