"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
  return (
    <div className="flex justify-between items-center w-full p-4">
      <h1 className="text-3xl font-bold">Decentralized Lottery</h1>
      <ConnectButton />
    </div>
  )
}
