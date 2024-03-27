import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";

import * as splToken from "@solana/spl-token";

import { PublicKey, Transaction } from "@solana/web3.js";

type BuyTicketProps = {
  program: anchor.Program<anchor.Idl>;
  ticketId: number;
  ticketNum: number;
  roundId: number;
  wallet: any;
};

async function getRoundPDA(
  counter: anchor.BN,
  program: anchor.Program<anchor.Idl>
) {
  const counterBuffer = counter.toArrayLike(Buffer);

  let [roundPDA, _1] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("round"), counterBuffer],
    program.programId
  );
  return roundPDA;
}

async function getPoolPDA(
  counter: anchor.BN,
  program: anchor.Program<anchor.Idl>
) {
  const counterBuffer = counter.toArrayLike(Buffer);

  let [poolPDA, _1] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("pool"), counterBuffer],
    program.programId
  );
  return poolPDA;
}

async function getTicketPDA(
  roundID: anchor.BN,
  ticketNum: anchor.BN,
  program: anchor.Program<anchor.Idl>
) {
  const roundIDBuffer = roundID.toArrayLike(Buffer);
  const ticketNumBuffer = ticketNum.toArrayLike(Buffer);

  let [ticketPDA, _1] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("ticket"), roundIDBuffer, ticketNumBuffer],
    program.programId
  );
  return ticketPDA;
}

async function getTokenAccount(walletPublicKey: PublicKey) {
  const mintPublicKey = new PublicKey(
    "6EiMyhhJDi33hgoGSZLoxZfRRTPLuhWKht4RPq2JVgXn"
  );

  const associatedTokenAddress = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    splToken.TOKEN_PROGRAM_ID,
    mintPublicKey,
    walletPublicKey
  );
  console.log(associatedTokenAddress.toBase58());
  return associatedTokenAddress;
}

async function buyTicketRpc(
  wallet: any,
  connection: anchor.web3.Connection,
  instruction: anchor.web3.TransactionInstruction
) {
  // 获取与Phantom钱包关联的账户地址

  try {
    // 获取最近的区块哈希以设置交易的recentBlockhash
    const { blockhash } = await connection.getRecentBlockhash();

    // 构建交易
    let transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: wallet.publicKey,
    });

    // 将指令加入到交易
    transaction.add(instruction);

    // 让Phantom钱包签名交易
    let signedTransaction = await wallet.signTransaction(transaction);

    // 发送交易
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    await connection.confirmTransaction(signature);

    console.log("Transaction confirmed with signature:", signature);
  } catch (error) {
    console.error("Failed to buy ticket:", error);
  }
}

export const buyTicket = async ({
  wallet,
  program,
  ticketId,
  roundId,
  ticketNum,
}: BuyTicketProps) => {
  // Generate a new Keypair for our new tweet account.
  const roundPDA = await getRoundPDA(new anchor.BN(roundId), program);
  const poolPDA = await getPoolPDA(new anchor.BN(roundId), program);
  const ticketPDA = await getTicketPDA(
    new anchor.BN(roundId),
    new anchor.BN(ticketNum),
    program
  );

  /*
   const tx = await this.program.methods
      .buyTicket(new anchor.BN(ticketID), new anchor.BN(amount))
      .accounts({
        ticket: ticketPDA,
        roundAccount: roundPDA,
        pool: poolPDA,
        from: tokenAccount,
      })
      .rpc(); */

  const tokenAccount = await getTokenAccount(wallet.publicKey);
  // Send a "SendTweet" instruction with the right data and the right accounts.

  program.instruction.buyTicket;

  const instruction = await program.instruction.buyTicket(
    new anchor.BN(ticketId),
    new anchor.BN(1000),
    {
      accounts: {
        ticket: ticketPDA,
        roundAccount: roundPDA,
        pool: poolPDA,
        from: tokenAccount,
        buyer: wallet.publicKey,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    }
  );

  await buyTicketRpc(wallet, program.provider.connection, instruction);
};
