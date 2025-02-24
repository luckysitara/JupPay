import type { Metadata } from "next"
import { MerchantRegistration } from "@/components/merchant-registration"
import { MerchantList } from "@/components/merchant-list"
import { MerchantDashboard } from "@/components/merchant-dashboard"

export const metadata: Metadata = {
  title: "Solpay - Crypto Payment Gateway",
  description: "Accept any token, get paid in your preferred token",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Welcome to Solpay</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <MerchantRegistration />
          <MerchantList />
        </div>
        <div className="mt-12">
          <MerchantDashboard />
        </div>
      </div>
    </main>
  )
}

