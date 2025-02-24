import { Connection, PublicKey } from "@solana/web3.js"
import { Program, AnchorProvider, web3 } from "@project-serum/anchor"
import { IDL } from "./idl"
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"

const programID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com")

export const getSolpayProgram = (wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  return new Program(IDL, programID, provider)
}

export const getProgramDerivedAddress = async (seeds: Buffer[], programId: PublicKey) => {
  const [pda] = await PublicKey.findProgramAddress(seeds, programId)
  return pda
}

export const getMerchantPDA = async (owner: PublicKey) => {
  return getProgramDerivedAddress([Buffer.from("merchant"), owner.toBuffer()], programID)
}

export const getPaymentPDA = async (merchant: PublicKey, customer: PublicKey) => {
  return getProgramDerivedAddress([Buffer.from("payment"), merchant.toBuffer(), customer.toBuffer()], programID)
}

export const getAssociatedTokenAddress = async (mint: PublicKey, owner: PublicKey): Promise<PublicKey> => {
  return await PublicKey.findProgramAddress(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0]
}

export const createAssociatedTokenAccountInstruction = async (mint: PublicKey, owner: PublicKey, payer: PublicKey) => {
  const associatedToken = await getAssociatedTokenAddress(mint, owner)
  return new web3.TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedToken, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: web3.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
  })
}

