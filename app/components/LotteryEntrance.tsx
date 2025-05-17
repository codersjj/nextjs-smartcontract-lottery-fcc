"use client"

import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
  useWriteContract
} from "wagmi"
import { getBalance, waitForTransactionReceipt } from "@wagmi/core"
import { raffleContractConfig } from "@/app/constants/contracts"
import { useEffect, useState } from "react"
import { Address, formatEther, parseEther } from "viem"
import { ToastContainer, toast } from "react-toastify"
import { config } from "@/wagmi"

export default function LotteryEntrance() {
  const account = useAccount()
  const chainId = useChainId()
  const [balanceFormatted, setBalanceFormatted] = useState<string>("0")
  const [numberOfPlayers, setNumberOfPlayers] = useState<bigint>(BigInt(0))
  const [recentWinner, setRecentWinner] = useState<Address>("0x")

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

  const { data: raffleData, refetch: refetchRaffleData } = useReadContracts({
    contracts: [
      {
        ...raffleContractConfig,
        address,
        functionName: "getNumberOfPlayers"
      },
      {
        ...raffleContractConfig,
        address,
        functionName: "getRecentWinner"
      }
    ],
    query: {
      enabled: account.status === "connected"
    }
  })

  console.log("🚀 ~ LotteryEntrance ~ raffleData:", raffleData)

  useEffect(() => {
    setNumberOfPlayers(raffleData?.[0]?.result as bigint)
    setRecentWinner(raffleData?.[1]?.result as Address)
  }, [raffleData])

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
        onSuccess: async (hash) => {
          console.log("🚀 ~ onSuccess: ~ hash:", hash)
          toast.success("Transaction submitted! Waiting for confirmation...")
          try {
            console.log("Waiting for transaction receipt...")

            // Wait for transaction to be mined
            const receipt = await waitForTransactionReceipt(config, {
              hash,
              confirmations: 1,
              timeout: 30000 // 30 seconds timeout
            })
            console.log("Transaction receipt:", receipt)
            toast.success("Entered raffle successfully")
            const balance = await getBalance(config, {
              address
            })
            console.log("🚀 ~ handleEnterRaffle ~ balance:", balance)
            setBalanceFormatted(formatBalance(balance?.value))
            await refetchRaffleData()
          } catch (error: any) {
            console.error("Transaction error:", error)
            toast.error(
              "Transaction failed: " + (error.shortMessage || error.message)
            )
          }
        },
        onError: (error: any) => {
          console.error("Contract write error:", error)
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
          <p className="my-1 text-lg">Number of players: {numberOfPlayers}</p>
          <p className="my-1 text-lg">Recent winner: {recentWinner}</p>
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
