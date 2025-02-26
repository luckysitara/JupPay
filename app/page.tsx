import type { Metadata } from "next"
import { MerchantRegistration } from "@/components/merchant-registration"
import { MerchantList } from "@/components/merchant-list"
import { MerchantDashboard } from "@/components/merchant-dashboard"
import GetStarted from "@/components/getStarted"

export const metadata: Metadata = {
  title: "Solpay - Crypto Payment Gateway",
  description: "Accept any token, get paid in your preferred token",
}

export default function Home() {
  return (
    <main className="w-full h-full">
      <GetStarted />
    </main>
  )
}

