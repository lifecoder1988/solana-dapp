import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

import idl from "./anchor_example.json";

const SOLANA_SSQ_PROGRAM = idl.metadata.address;
//const SOLANA_SSQ_PROGRAM = "6SNqCZQSHmRQC3Ki2aq2w5xwJ4fFKv4wxSaZXGdXUQSU";
const programID = new PublicKey(SOLANA_SSQ_PROGRAM);

export interface Wallet {
  signTransaction(
    tx: anchor.web3.Transaction
  ): Promise<anchor.web3.Transaction>;
  signAllTransactions(
    txs: anchor.web3.Transaction[]
  ): Promise<anchor.web3.Transaction[]>;
  publicKey: anchor.web3.PublicKey;
}

type ProgramProps = {
  connection: Connection;
  wallet: Wallet;
};

export const useProgram = ({ connection, wallet }: ProgramProps) => {
  const [program, setProgram] = useState<anchor.Program<anchor.Idl>>();

  useEffect(() => {
    updateProgram();
  }, [connection, wallet]);

  const updateProgram = () => {
    const provider = new anchor.Provider(connection, wallet, {
      preflightCommitment: "recent",
      commitment: "processed",
    });
    console.log("provider", provider);

    //   const idl = await anchor.Program.fetchIdl(programID, provider);
    //   console.log("idl", idl);

    const program = new anchor.Program(idl as any, programID, provider);

    setProgram(program);
  };

  return {
    program,
  };
};
