import type { Metadata } from "next"
import { PaymentForm } from "@/components/payment-form"
import { PaymentList } from "@/components/payment-list"

export const metadata: Metadata = {
  title: "Solpay - Payments",
  description: "Create and view payments",
}

export default function Payments() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Payments</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <PaymentForm />
          <PaymentList />
        </div>
      </div>
    </main>
  )
}

