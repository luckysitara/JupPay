"use client"

import { useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"
import { getSolpayProgram, getMerchantPDA, getPaymentPDA } from "@/lib/solana"

export function useSolpay() {
  const { publicKey, signTransaction } = useWallet()
  const { toast } = useToast()

  const registerMerchant = useCallback(
    async (preferredToken: string) => {
      if (!publicKey || !signTransaction) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please connect your wallet first.",
        })
        return
      }

      try {
        const program = getSolpayProgram({ publicKey, signTransaction })
        const merchantPDA = await getMerchantPDA(publicKey)

        const tx = await program.methods
          .registerMerchant(new PublicKey(preferredToken))
          .accounts({
            merchant: merchantPDA,
            owner: publicKey,
          })
          .rpc()

        return merchantPDA
      } catch (error) {
        console.error("Error registering merchant:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to register merchant on-chain.",
        })
      }
    },
    [publicKey, signTransaction, toast],
  )

  const createPayment = useCallback(
    async (merchantId: string, amount: number, inputToken: string) => {
      if (!publicKey || !signTransaction) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please connect your wallet first.",
        })
        return
      }

      try {
        const program = getSolpayProgram({ publicKey, signTransaction })
        const merchantPubkey = new PublicKey(merchantId)
        const paymentPDA = await getPaymentPDA(merchantPubkey, publicKey)

        const tx = await program.methods
          .createPayment(new PublicKey(merchantId), amount)
          .accounts({
            payment: paymentPDA,
            merchant: merchantPubkey,
            customer: publicKey,
            inputToken: new PublicKey(inputToken),
          })
          .rpc()

        return paymentPDA
      } catch (error) {
        console.error("Error creating payment:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create payment on-chain.",
        })
      }
    },
    [publicKey, signTransaction, toast],
  )

  const executeSwap = useCallback(
    async (paymentId: string, amount: number) => {
      if (!publicKey || !signTransaction) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please connect your wallet first.",
        })
        return
      }

      try {
        const program = getSolpayProgram({ publicKey, signTransaction })
        const paymentPubkey = new PublicKey(paymentId)

        const tx = await program.methods
          .executeSwap(amount)
          .accounts({
            payment: paymentPubkey,
            authority: publicKey,
          })
          .rpc()

        return tx
      } catch (error) {
        console.error("Error executing swap:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to execute swap on-chain.",
        })
      }
    },
    [publicKey, signTransaction, toast],
  )

  const refundPayment = useCallback(
    async (paymentId: string) => {
      if (!publicKey || !signTransaction) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please connect your wallet first.",
        })
        return
      }

      try {
        const program = getSolpayProgram({ publicKey, signTransaction })
        const paymentPubkey = new PublicKey(paymentId)

        const tx = await program.methods
          .refundPayment()
          .accounts({
            payment: paymentPubkey,
            authority: publicKey,
          })
          .rpc()

        return tx
      } catch (error) {
        console.error("Error refunding payment:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to refund payment on-chain.",
        })
      }
    },
    [publicKey, signTransaction, toast],
  )

  return {
    registerMerchant,
    createPayment,
    executeSwap,
    refundPayment,
  }
}

