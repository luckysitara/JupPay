import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { PublicKey } from "@solana/web3.js"
import { getMerchantPDA } from "@/lib/solana"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { owner, preferredToken, merchantPublicKey } = body

    // Validate Solana public keys
    try {
      new PublicKey(owner)
      new PublicKey(preferredToken)
      new PublicKey(merchantPublicKey)
    } catch (error) {
      return NextResponse.json({ error: "Invalid Solana public key" }, { status: 400 })
    }

    // Verify the merchant PDA
    const expectedMerchantPDA = await getMerchantPDA(new PublicKey(owner))
    if (expectedMerchantPDA.toBase58() !== merchantPublicKey) {
      return NextResponse.json({ error: "Invalid merchant public key" }, { status: 400 })
    }

    // Store merchant data in Supabase
    const { data, error } = await supabase
      .from("merchants")
      .insert({
        id: merchantPublicKey,
        owner,
        preferred_token: preferredToken,
      })
      .select()

    if (error) throw error

    return NextResponse.json({
      message: "Merchant registered successfully",
      merchantId: data[0].id,
    })
  } catch (error) {
    console.error("Error registering merchant:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

