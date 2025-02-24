import Payment from "../models/Payment.js"
import Merchant from "../models/Merchant.js"
import { PublicKey } from "@solana/web3.js"
import { getQuote, postSwap } from "../services/jupiterService.js"

export const createPayment = async (req, res) => {
  try {
    const { merchantId, customer, amount, inputToken } = req.body

    if (!merchantId || !customer || !amount || !inputToken) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Validate Solana public keys
    try {
      new PublicKey(customer)
      new PublicKey(inputToken)
    } catch (error) {
      return res.status(400).json({ error: "Invalid Solana public key" })
    }

    const merchant = await Merchant.findById(merchantId)
    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" })
    }

    const payment = new Payment({
      merchant: merchantId,
      customer,
      amount,
      inputToken,
      outputToken: merchant.preferredToken,
      status: "pending",
    })

    await payment.save()

    res.status(201).json({ message: "Payment created successfully", paymentId: payment._id })
  } catch (error) {
    console.error("Error creating payment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const executeSwap = async (req, res) => {
  try {
    const { paymentId } = req.body

    if (!paymentId) {
      return res.status(400).json({ error: "Missing payment ID" })
    }

    const payment = await Payment.findById(paymentId).populate("merchant")
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ error: "Payment is not in pending status" })
    }

    // Get quote from Jupiter
    const quoteResponse = await getQuote({
      inputMint: payment.inputToken,
      outputMint: payment.merchant.preferredToken,
      amount: payment.amount,
      slippageBps: 50,
    })

    if (!quoteResponse.data) {
      return res.status(400).json({ error: "Failed to get quote from Jupiter" })
    }

    // Execute swap using Jupiter
    const swapResponse = await postSwap({
      route: quoteResponse.data,
      userPublicKey: payment.customer,
    })

    if (!swapResponse.data || !swapResponse.data.swapTransaction) {
      return res.status(400).json({ error: "Failed to execute swap" })
    }

    // Update payment status
    payment.status = "completed"
    payment.swapTransaction = swapResponse.data.swapTransaction
    await payment.save()

    res.json({
      message: "Swap executed successfully",
      swapTransaction: swapResponse.data.swapTransaction,
    })
  } catch (error) {
    console.error("Error executing swap:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    res.json({ status: payment.status, swapTransaction: payment.swapTransaction })
  } catch (error) {
    console.error("Error getting payment status:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

