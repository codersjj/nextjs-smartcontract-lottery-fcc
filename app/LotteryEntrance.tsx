"use client"

import { useAccount, useChainId, useReadContract } from "wagmi"
import { raffleContractConfig } from "@/app/constants/contracts"
import { useEffect } from "react"
import { formatEther } from "viem"

export default function LotteryEntrance() {
  const account = useAccount()
  const chainId = useChainId()

  useEffect(() => {
    if (account.status === "connected") {
      console.log("account connected")
    } else {
      console.log("account not connected, status:", account.status)
    }
  }, [account.status])

  const address =
    chainId in raffleContractConfig.address
      ? raffleContractConfig.address[
          chainId as unknown as keyof typeof raffleContractConfig.address
        ]
      : undefined

  const { data: entranceFee } = useReadContract({
    ...raffleContractConfig,
    address,
    functionName: "getEntranceFee",
    query: {
      enabled: account.status === "connected"
    }
  })
  if (account.status === "connected") {
    console.log("🚀 ~ LotteryEntrance ~ entranceFee:", entranceFee)
  }
  const entranceFeeFormatted = formatEther((entranceFee as bigint) ?? 0)

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Lottery Entrance</h1>
      <p className="text-lg">Entrance Fee: {entranceFeeFormatted} ETH</p>
    </div>
  )
}
