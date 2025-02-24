import Merchant from "../models/Merchant.js"
import { PublicKey } from "@solana/web3.js"

export const registerMerchant = async (req, res) => {
  try {
    const { owner, preferredToken } = req.body

    if (!owner || !preferredToken) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Validate Solana public keys
    try {
      new PublicKey(owner)
      new PublicKey(preferredToken)
    } catch (error) {
      return res.status(400).json({ error: "Invalid Solana public key" })
    }

    const merchant = new Merchant({
      owner,
      preferredToken,
    })

    await merchant.save()

    res.status(201).json({ message: "Merchant registered successfully", merchantId: merchant._id })
  } catch (error) {
    console.error("Error registering merchant:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const updateMerchantToken = async (req, res) => {
  try {
    const { merchantId, newPreferredToken } = req.body

    if (!merchantId || !newPreferredToken) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Validate Solana public key
    try {
      new PublicKey(newPreferredToken)
    } catch (error) {
      return res.status(400).json({ error: "Invalid Solana public key" })
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      { preferredToken: newPreferredToken },
      { new: true },
    )

    if (!updatedMerchant) {
      return res.status(404).json({ error: "Merchant not found" })
    }

    res.json({ message: "Merchant token updated successfully", merchant: updatedMerchant })
  } catch (error) {
    console.error("Error updating merchant token:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

