import Link from "next/link";
import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { SolanaLogo, MyDate } from "components";
import styles from "./index.module.css";

import { useEffect, useState } from "react";

import { useProgram } from "./useProgram";

import axios from "axios";

import * as anchor from "@project-serum/anchor";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { buyTicket } from "./ssq";

const endpoint = "https://explorer-api.devnet.solana.com";

const connection = new anchor.web3.Connection(endpoint);

const apiHost = "http://127.0.0.1:8000/api/v1";

async function listTicketsByOwner(owner: string) {
  try {
    const { data } = await axios.get(
      `${apiHost}/tickets/list_by_owner?owner=${owner}`
    );

    return data["data"];
  } catch (err) {
    console.log(err);
  }
  return null;
}

function useGetTicketsByOwner(owner: string) {
  console.log(111);
  const [data, setData] = useState(null);
  let isMounted = true;
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 数据获取逻辑
        const fetchedData = await listTicketsByOwner(owner);
        if (isMounted) {
          setData(fetchedData);
        }
      } catch (error) {
        console.error("获取票据信息时出错：", error);
        // 根据你的需求处理错误，比如设置错误状态
      }
    };

    fetchData();

    return () => {
      isMounted = false; // 组件卸载时更新标志
    };
  }, [owner]); // 将owner作为依赖项

  return data;
}

export const HomeView2: FC = ({
  activeRoundData,
  olderRoundData,
  pendingRoundData,
  currentTs,
}) => {
  const { publicKey } = useWallet();

  console.log(publicKey);
  let ownerData = null;
  if (publicKey != null) {
    //ownerData = useGetTicketsByOwner(publicKey.toBase58());
  }

  const wallet: any = useAnchorWallet();
  const { program } = useProgram({ connection, wallet });

  //console.log(activeRoundData)
  const onBuyTicket = async () => {
    const ticketId = 12233;
    const roundId = 1;
    const ticketNum = 3;
    await buyTicket({ wallet, program, ticketId, roundId, ticketNum });
  };

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

        <div className="flex justify-center items-center min-h-screen">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">当前期号：{1}</h2>
              <p>资金池：${222}</p>
              <p>参与人数：{333}人</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={onBuyTicket}>
                  buy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-16 py-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-5xl font-bold">
                  Hello Solana <SolanaLogo /> World!1
                </h1>
                <pre>{JSON.stringify(activeRoundData, null, 2)}</pre>
                <pre>{JSON.stringify(olderRoundData, null, 2)}</pre>
                <pre>{JSON.stringify(pendingRoundData, null, 2)}</pre>

                <pre>{JSON.stringify(ownerData, null, 4)}</pre>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">已结束</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>期号</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                  <th>参与人数</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {olderRoundData.map((round: any) => (
                  <tr key={round.round_id}>
                    <td>{round.round_id}</td>
                    <td>
                      <MyDate
                        timestamp={round.start * 1000}
                        locale={"es"}
                      ></MyDate>
                    </td>
                    <td>
                      <MyDate
                        timestamp={round.end * 1000}
                        locale={"fr"}
                      ></MyDate>
                    </td>
                    <td>{round.selled_ticket}</td>
                    <td>
                      {round.result === 0 ? <span>开奖中</span> : null}
                      {round.result !== 0 && round.is_finished == 0 ? (
                        <span>统计中</span>
                      ) : null}
                      {round.is_finished === 1 ? <span>已结束</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">计划中</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>期号</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                </tr>
              </thead>
              <tbody>
                {pendingRoundData.map((round: any) => (
                  <tr key={round.round_id}>
                    <td>{round.round_id}</td>
                    <td>
                      <MyDate
                        timestamp={round.start * 1000}
                        locale={"es"}
                      ></MyDate>
                    </td>
                    <td>
                      <MyDate
                        timestamp={round.end * 1000}
                        locale={"fr"}
                      ></MyDate>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            我参与的
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>期号</th>
                  <th>序号</th>
                  <th>票号</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {ownerData == null ? (
                  <td colSpan={4} className="text-center text-gray-500">
                    暂无数据
                  </td>
                ) : null}
                {ownerData != null &&
                  ownerData.map((item: any) => (
                    <tr key={item.round_id + "- " + item.ticket_num}>
                      <td>{item.round_id}</td>
                      <td>{item.ticket_num}</td>
                      <td>{item.ticket_id}</td>

                      <td>
                        {item.is_used === 0 ? <span>未使用</span> : null}
                        {item.is_used === 1 ? <span>已刮奖</span> : null}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
