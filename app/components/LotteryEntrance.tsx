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
import LoadingSpinner from "./LoadingSpinner"

export default function LotteryEntrance() {
  const account = useAccount()
  const chainId = useChainId()
  const [localChainId, setLocalChainId] = useState<number | undefined>(
    undefined
  )
  const [address, setAddress] = useState<Address | undefined>(undefined)
  const [isProcessing, setIsProcessing] = useState(false)
  const [balanceFormatted, setBalanceFormatted] = useState<string>("0")
  const [numberOfPlayers, setNumberOfPlayers] = useState<bigint>(BigInt(0))
  const [recentWinner, setRecentWinner] = useState<Address>("0x")
  const [raffleState, setRaffleState] = useState<number>(0)
  const [timestamp, setTimestamp] = useState<number>(0)

  useEffect(() => {
    if (!localChainId) {
      setAddress(undefined)
      return
    }
    const address =
      localChainId in raffleContractConfig.address
        ? raffleContractConfig.address[
            localChainId as unknown as keyof typeof raffleContractConfig.address
          ]
        : undefined
    setAddress(address)
  }, [localChainId])

  useEffect(() => {
    if (account.status === "connected") {
      console.log("account connected, chainId:", chainId)
      setLocalChainId(chainId)
    } else if (account.status === "disconnected") {
      console.log("account disconnected")
      setLocalChainId(undefined)
      setAddress(undefined)
    } else {
      console.log("account not connected, status:", account.status)
    }
  }, [account.status, chainId])

  const { writeContract } = useWriteContract()

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

  // console.log("🚀 ~ LotteryEntrance ~ raffleData:", raffleData)
  if (raffleData?.[0]?.error) {
    toast.error(raffleData?.[0]?.error.message)
  }

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
    if (isProcessing) {
      return
    }

    if (!address) {
      toast.error("No raffle address found")
      return
    }

    setIsProcessing(true)
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
          } finally {
            setIsProcessing(false)
          }
        },
        onError: (error: any) => {
          console.error("Contract write error:", error)
          toast.error(error.shortMessage || error.message)
          setIsProcessing(false)
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
      // console.log("🚀 ~ handleEnterRaffle ~ balance:", balance)
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
        console.log("🚀 ~ onLogs ~ logs:", logs)
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

  useWatchContractEvent({
    address,
    abi: raffleContractConfig.abi,
    eventName: "RequestedRaffleWinner",
    onLogs(logs) {
      console.log("🚀 ~ RequestedRaffleWinner ~ logs:", logs)
      updateUIValues()
    }
  })

  return (
    <div className="flex flex-col items-center justify-center">
      {address ? (
        <>
          <h2 className="my-4 text-2xl font-bold">Hi from lottery entrance</h2>
          <p className="my-1 text-lg">
            Entrance Fee: {entranceFeeFormatted} ETH
          </p>
          <p className="my-1 text-lg">Raffle balance: {balanceFormatted} ETH</p>
          <p className="my-1 text-lg">Number of players: {numberOfPlayers}</p>
          <p className="my-1 text-lg">
            Raffle state: {raffleState === 0 ? "OPEN" : "CALCULATING"}
          </p>
          <p className="my-1 text-lg">timestamp: {timestamp}</p>
          <p className="my-1 text-lg">Recent winner: {recentWinner}</p>
          <button
            className="inline-flex items-center mt-2 px-4 py-2 bg-indigo-500
              text-sm leading-6 font-semibold text-white p-2 rounded-md cursor-pointer
            hover:bg-indigo-400 hover:scale-105 transition-all duration-150 ease-in-out
              aria-disabled:opacity-80 aria-disabled:cursor-not-allowed"
            onClick={handleEnterRaffle}
            aria-disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <LoadingSpinner className="mr-3 -ml-1 size-5 text-white" />
                <span>Processing...</span>
              </>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <ToastContainer />
        </>
      ) : (
        <h1 className="text-2xl font-bold">No Raffle Address Found</h1>
      )}
    </div>
  )
}
