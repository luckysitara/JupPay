export const IDL = {
  version: "0.1.0",
  name: "solpay",
  instructions: [
    {
      name: "registerMerchant",
      accounts: [
        {
          name: "merchant",
          isMut: true,
          isSigner: true,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "preferredToken",
          type: "publicKey",
        },
      ],
    },
    {
      name: "createPayment",
      accounts: [
        {
          name: "payment",
          isMut: true,
          isSigner: true,
        },
        {
          name: "merchant",
          isMut: false,
          isSigner: false,
        },
        {
          name: "customer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "customerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "executeSwap",
      accounts: [
        {
          name: "payment",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "refundPayment",
      accounts: [
        {
          name: "payment",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Merchant",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "preferredToken",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "Payment",
      type: {
        kind: "struct",
        fields: [
          {
            name: "merchant",
            type: "publicKey",
          },
          {
            name: "customer",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "status",
            type: {
              defined: "PaymentStatus",
            },
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "PaymentStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Pending",
          },
          {
            name: "Completed",
          },
          {
            name: "Refunded",
          },
        ],
      },
    },
  ],
}

