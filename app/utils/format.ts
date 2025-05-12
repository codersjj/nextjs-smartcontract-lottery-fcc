export function formatAddress(address?: string) {
  if (!address) return null
  return `${address.slice(0, 6)}...${address.slice(38, 42)}`
}
