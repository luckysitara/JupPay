import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { PublicKey } from "@solana/web3.js"
import { getPaymentPDA } from "@/lib/solana"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { merchantId, customer, amount, inputToken, paymentPublicKey } = body

    // Validate Solana public keys
    try {
      new PublicKey(merchantId)
      new PublicKey(customer)
      new PublicKey(inputToken)
      new PublicKey(paymentPublicKey)
    } catch (error) {
      return NextResponse.json({ error: "Invalid Solana public key" }, { status: 400 })
    }

    // Verify the payment PDA
    const expectedPaymentPDA = await getPaymentPDA(new PublicKey(merchantId), new PublicKey(customer))
    if (expectedPaymentPDA.toBase58() !== paymentPublicKey) {
      return NextResponse.json({ error: "Invalid payment public key" }, { status: 400 })
    }

    // Get merchant's preferred token
    const { data: merchantData, error: merchantError } = await supabase
      .from("merchants")
      .select("preferred_token")
      .eq("id", merchantId)
      .single()

    if (merchantError) throw merchantError

    if (!merchantData) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    // Store payment data in Supabase
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        id: paymentPublicKey,
        merchant_id: merchantId,
        customer,
        amount,
        input_token: inputToken,
        output_token: merchantData.preferred_token,
        status: "pending",
      })
      .select()

    if (paymentError) throw paymentError

    return NextResponse.json({
      message: "Payment created successfully",
      paymentId: paymentData[0].id,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

