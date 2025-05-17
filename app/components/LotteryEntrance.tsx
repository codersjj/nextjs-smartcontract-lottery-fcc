"use client"

import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWatchContractEvent
} from "wagmi"
import { getBalance, waitForTransactionReceipt } from "@wagmi/core"
import { raffleContractConfig } from "@/app/constants/contracts"
import { useEffect, useState, useCallback, useRef } from "react"
import { Address, formatEther, parseEther } from "viem"
import { ToastContainer, toast } from "react-toastify"
import { config } from "@/wagmi"

export default function LotteryEntrance() {
  const account = useAccount()
  const chainId = useChainId()
  const [balanceFormatted, setBalanceFormatted] = useState<string>("0")
  const [numberOfPlayers, setNumberOfPlayers] = useState<bigint>(BigInt(0))
  const [recentWinner, setRecentWinner] = useState<Address>("0x")
  const [raffleState, setRaffleState] = useState<number>(0)
  const [timestamp, setTimestamp] = useState<number>(0)

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
      },
      {
        ...raffleContractConfig,
        address,
        functionName: "getRaffleState"
      },
      {
        ...raffleContractConfig,
        address,
        functionName: "getTimestamp"
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
    setRaffleState(raffleData?.[2]?.result as number)
    setTimestamp(raffleData?.[3]?.result as number)
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
          toast.success("Transaction submitted! Waiting for confirmation...")
          try {
            // Wait for transaction to be mined
            const receipt = await waitForTransactionReceipt(config, {
              hash,
              confirmations: 1,
              timeout: 30000 // 30 seconds timeout
            })
            toast.success("Entered raffle successfully")
            updateUIValues()
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

  const updateUIValues = useCallback(async () => {
    console.log("updating UI values...")
    if (address) {
      const balance = await getBalance(config, {
        address
      })
      console.log("🚀 ~ handleEnterRaffle ~ balance:", balance)
      setBalanceFormatted(formatBalance(balance?.value))
    }
    await refetchRaffleData()
  }, [address, refetchRaffleData])

  const isFirstLoadRef = useRef(true)

  useWatchContractEvent({
    address,
    abi: raffleContractConfig.abi,
    eventName: "WinnerPicked",
    onLogs: useCallback(
      (logs: any) => {
        if (!isFirstLoadRef.current) {
          console.log("New logs!", logs)
          toast.info("winner picked detected")
          updateUIValues()
        }
        isFirstLoadRef.current = false
      },
      [updateUIValues]
    )
  })

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
          <p className="my-1 text-lg">Raffle state: {raffleState}</p>
          <p className="my-1 text-lg">timestamp: {timestamp}</p>
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
