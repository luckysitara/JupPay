import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { PublicKey } from "@solana/web3.js"
import { updateMerchantToken } from "@/lib/solana"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { preferredToken, wallet } = body

    // Validate Solana public key
    try {
      new PublicKey(preferredToken)
    } catch (error) {
      return NextResponse.json({ error: "Invalid Solana public key" }, { status: 400 })
    }

    // Update merchant token on-chain
    await updateMerchantToken(wallet, new PublicKey(params.id), new PublicKey(preferredToken))

    // Update merchant data in Supabase
    const { data, error } = await supabase
      .from("merchants")
      .update({ preferred_token: preferredToken })
      .eq("id", params.id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Merchant token updated successfully",
      merchant: data[0],
    })
  } catch (error) {
    console.error("Error updating merchant token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

