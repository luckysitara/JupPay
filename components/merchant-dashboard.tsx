"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MerchantSettings } from "@/components/merchant-settings"
import { ApiKeyManagement } from "@/components/api-key-management"

export function MerchantDashboard() {
  const { publicKey } = useWallet()
  const [merchantId, setMerchantId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMerchantId() {
      if (publicKey) {
        const response = await fetch(`/api/merchants?owner=${publicKey.toBase58()}`)
        const data = await response.json()
        if (data.merchantId) {
          setMerchantId(data.merchantId)
        }
      }
    }
    fetchMerchantId()
  }, [publicKey])

  if (!merchantId) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Merchant Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Merchant ID: {merchantId}</p>
          <Button className="mt-4">View Transactions</Button>
        </CardContent>
      </Card>
      <MerchantSettings merchantId={merchantId} />
      <ApiKeyManagement merchantId={merchantId} />
    </div>
  )
}

