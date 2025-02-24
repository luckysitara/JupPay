import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { PublicKey } from "@solana/web3.js"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { paymentId, transactionSignature } = body

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, merchants(preferred_token)")
      .eq("id", paymentId)
      .single()

    if (paymentError) throw paymentError

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status !== "pending") {
      return NextResponse.json({ error: "Payment is not in pending status" }, { status: 400 })
    }

    // Verify the transaction
    try {
      new PublicKey(paymentId)
    } catch (error) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 })
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        swap_transaction: transactionSignature,
      })
      .eq("id", paymentId)

    if (updateError) throw updateError

    return NextResponse.json({
      message: "Swap executed successfully",
      transactionSignature,
    })
  } catch (error) {
    console.error("Error executing swap:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

