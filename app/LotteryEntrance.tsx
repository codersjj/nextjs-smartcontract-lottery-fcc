"use client"

import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract
} from "wagmi"
import { getBalance } from "@wagmi/core"
import { raffleContractConfig } from "@/app/constants/contracts"
import { useEffect, useState } from "react"
import { formatEther, parseEther } from "viem"
import { ToastContainer, toast } from "react-toastify"
import { config } from "@/wagmi"

export default function LotteryEntrance() {
  const account = useAccount()
  const chainId = useChainId()
  const [balanceFormatted, setBalanceFormatted] = useState<string>("0")

  useEffect(() => {
    if (account.status === "connected") {
      console.log("account connected")
    } else {
      console.log("account not connected, status:", account.status)
    }
  }, [account.status])

  const { writeContract } = useWriteContract()

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

  const entranceFeeFormatted = formatEther((entranceFee as bigint) ?? 0)

  const { data: balance } = useBalance({
    address
  })

  const formatBalance = (balance: bigint | undefined) => {
    return formatEther(balance ?? BigInt(0))
  }

  useEffect(() => {
    setBalanceFormatted(formatBalance(balance?.value))
  }, [balance])

  const handleEnterRaffle = () => {
    if (!address) {
      toast.error("No raffle address found")
      return
    }

    writeContract(
      {
        address,
        abi: raffleContractConfig.abi,
        functionName: "enterRaffle",
        value: entranceFee as bigint
      },
      {
        onSuccess: async () => {
          toast.success("Entered raffle successfully")
          const balance = await getBalance(config, {
            address
          })
          console.log("🚀 ~ handleEnterRaffle ~ balance:", balance)
          setBalanceFormatted(formatBalance(balance?.value))
        },
        onError: (error: any) => {
          toast.error(error.shortMessage || error.message)
        }
      }
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {address ? (
        <>
          <h1 className="my-4 text-2xl font-bold">Lottery Entrance</h1>
          <p className="my-1 text-lg">
            Entrance Fee: {entranceFeeFormatted} ETH
          </p>
          <p className="my-1 text-lg">Raffle balance: {balanceFormatted} ETH</p>
          <button
            className="mt-2 bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 hover:scale-105 transition-all duration-300"
            onClick={handleEnterRaffle}
          >
            Enter Raffle
          </button>
          <ToastContainer />
        </>
      ) : (
        <h1 className="text-2xl font-bold">No Raffle Address Found</h1>
      )}
    </div>
  )
}
