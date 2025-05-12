"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { formatAddress } from "@/app/utils"
// import { useEffect, useState } from "react"

export default function ManualHeader() {
  const { address, isConnected, status } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  // const [isMounted, setIsMounted] = useState(false)

  // useEffect(() => {
  //   setIsMounted(true)
  // }, [])

  // if (!isMounted) {
  //   return null
  // }

  const formattedAddress = formatAddress(address)

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
          onClick={() => connect({ connector: connectors[0] })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
