import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { headers } from "next/headers"
import { cookieToInitialState } from "wagmi"
import { config } from "@/wagmi"
import "@rainbow-me/rainbowkit/styles.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Smart Contract Lottery",
  description: "Our Smart Contract Lottery"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie")
  )

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  )
}
