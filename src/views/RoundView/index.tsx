import Link from "next/link";
import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { MyDate, SolanaLogo } from "components";
import styles from "./index.module.css";

import { useEffect, useState } from "react";

interface RoundViewProps {
  roundData: any; // 请根据实际数据结构替换any
  ticketsData: any;
}

export const RoundView: FC<RoundViewProps> = ({ roundData, ticketsData }) => {
  const { publicKey } = useWallet();

  console.log(publicKey);

  //console.log(activeRoundData)
  const onClick = () => {};

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <span className="text-4xl">🦤</span>
            </button>
          </div>
          <div className="flex-1 px-2 mx-2">
            <span className="text-lg font-bold">Caw Caw222</span>
          </div>
          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 py-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl font-bold">
                  Hello Solana <SolanaLogo /> World!1
                </h1>
                <pre>{JSON.stringify(roundData, null, 2)}</pre>
                <pre>{JSON.stringify(ticketsData, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">基本信息</h2>
        <div className="card w-96 bg-base-100 shadow-xl m-4">
          <div className="card-body">
            <h2 className="card-title">Round Details</h2>
            <p>Round ID: {roundData.round_id.toString()}</p>
            <p>Selled Ticket: {roundData.selled_ticket.toString()}</p>
            <p>Result: {roundData.result.toString()}</p>
            <p>
              Start:{" "}
              <MyDate timestamp={roundData.start * 1000} locale={"es"}></MyDate>
            </p>
            <p>
              End:{" "}
              <MyDate timestamp={roundData.start * 1000} locale={"es"}></MyDate>
            </p>
            <p>Total: {roundData.total.toString()}</p>
            <p>Prize 1: {roundData.p1.toString()}</p>
            <p>Prize 2: {roundData.p2.toString()}</p>
            <p>Prize 3: {roundData.p3.toString()}</p>
            {/* Add more prizes as needed */}
            <p>Earn: {roundData.earn.toString()}</p>
            <p>Can Transfer: {roundData.canTransfer ? "Yes" : "No"}</p>
            <p>Is Transfered: {roundData.isTransfered ? "Yes" : "No"}</p>
            <p>Is Finished: {roundData.isFinished ? "Yes" : "No"}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">参与信息</h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>期号</th>
                <th>序号</th>
                <th>票号</th>
              </tr>
            </thead>
            <tbody>
              {ticketsData == null ? (
                <td colSpan={4} className="text-center text-gray-500">
                  暂无数据
                </td>
              ) : null}
              {ticketsData != null &&
                ticketsData.map((item: any) => (
                  <tr key={item.round_id + "- " + item.ticket_num}>
                    <td>{item.round_id}</td>
                    <td>{item.ticket_num}</td>
                    <td>{item.ticket_id}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
