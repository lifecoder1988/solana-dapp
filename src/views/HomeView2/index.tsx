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
import { buyTicket, claim } from "./ssq";
import LotteryInput from "components/LotteryInput";
import { Ticket } from "components/Ticket";

const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string;

const connection = new anchor.web3.Connection(endpoint);

async function listTicketsByOwner(owner: string) {
  try {
    const apiHost = process.env.NEXT_PUBLIC_API_URL as string;

    const { data } = await axios.get(
      `${apiHost}/tickets/list_by_owner?owner=${owner}`
    );

    return data["data"];
  } catch (err) {
    console.log(err);
  }
  return null;
}

function useGetTicketsByOwner(owner: string | null) {
  console.log(111);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 数据获取逻辑
        if (owner != null) {
          const fetchedData = await listTicketsByOwner(owner);
          setData(fetchedData);
        }
      } catch (error) {
        console.error("获取票据信息时出错：", error);
        // 根据你的需求处理错误，比如设置错误状态
      }
    };

    fetchData();
  }, [owner]); // 将owner作为依赖项

  return data;
}

interface HomeView2Props {
  activeRoundData: any; // 替换 any 为更具体的类型
  olderRoundData: any;
  pendingRoundData: any;
  currentTs: number;
}

const getRandomTicketArray = () => {
  let arr = [];
  for (let i = 0; i < 6; i++) {
    const randomNumber = Math.floor(Math.random() * 32) + 1;
    arr.push(randomNumber);
  }
  const randomNumber = Math.floor(Math.random() * 16) + 1;
  arr.push(randomNumber);
  return arr;
};

const ticketArrayToNumber = (arr: number[]) => {
  let firstSix = arr.slice(0, 6);
  let sortedFirstSix = firstSix.sort((a, b) => a - b);

  console.log(arr);
  console.log(sortedFirstSix);

  let result = 0;

  for (let i = 0; i < 6; i++) {
    result = result * 32 + sortedFirstSix[i] - 1;
    console.log(result);
  }
  result *= 16;

  const lastElement = arr[arr.length - 1] - 1;
  result += lastElement;
  return result;
};

export const HomeView2: FC<HomeView2Props> = ({
  activeRoundData,
  olderRoundData,
  pendingRoundData,
  currentTs,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lotteryValues, setLotteryValues] = useState<number[]>(
    getRandomTicketArray()
  );

  const { publicKey } = useWallet();

  console.log(publicKey);

  const ownerData = useGetTicketsByOwner(
    publicKey ? publicKey.toBase58() : null
  );

  const wallet: any = useAnchorWallet();

  console.log(wallet);
  const { program: myProgram } = useProgram({ connection, wallet });

  console.log(activeRoundData);

  const pickTicket = async (ev: any) => {
    setIsModalOpen(true);
  };

  const onBuyTicket = async (ticketArr: number[]) => {
    const roundId = (activeRoundData && activeRoundData.round_id) || 1;
    console.log(roundId);

    const program: anchor.Program<anchor.Idl> =
      myProgram as anchor.Program<anchor.Idl>;

    const ticketId = ticketArrayToNumber(ticketArr);
    console.log(ticketId);

    await buyTicket({ wallet, program, ticketId, roundId });
    setIsModalOpen(false);
  };

  const onRandom = () => {
    const arr = getRandomTicketArray();
    setLotteryValues(arr);
  };

  const onClaim = async (item: any) => {
    console.log(
      `[onClaim] roundId = ${item.round_id} , ticketId = ${item.ticket_id} ticketNum = ${item.ticket_num}`
    );
    const program: anchor.Program<anchor.Idl> =
      myProgram as anchor.Program<anchor.Idl>;
    await claim({
      wallet,
      program,
      ticketId: item.ticket_id,
      roundId: item.round_id,
      ticketNum: item.ticket_num,
    });
  };
  const handleValuesChange = (values: number[]) => {
    setLotteryValues(values);
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
            <span className="text-lg font-bold">幸运8</span>
          </div>
          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        {isModalOpen && (
          <div tabIndex={-1} className="modal modal-open">
            <div className="modal-box">
              <LotteryInput
                values={lotteryValues}
                setValues={setLotteryValues}
              />
              <div className="modal-action">
                <button className="btn btn-primary" onClick={onRandom}>
                  random
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onBuyTicket(lotteryValues);
                  }}
                >
                  提交
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}

        {activeRoundData && (
          <div className="flex justify-center items-center min-h-screen">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">
                  当前期号：{activeRoundData.round_id}
                </h2>

                <p>资金池：${222}</p>
                <p>参与人数：{333}人</p>
                <p>
                  时间：{" "}
                  <MyDate
                    timestamp={activeRoundData.start * 1000}
                    locale={"es"}
                  ></MyDate>{" "}
                  {" - "}{" "}
                  <MyDate
                    timestamp={activeRoundData.end * 1000}
                    locale={"es"}
                  ></MyDate>{" "}
                </p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    data-round-id={activeRoundData.round_id}
                    onClick={pickTicket}
                  >
                    buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
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
                    <td>
                      <Link href={`/round/${round.round_id}`}>
                        <a> {round.round_id}</a>
                        {/* 使用a标签包裹内容，以使其可点击 */}
                      </Link>
                    </td>

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
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {ownerData == null ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : null}
                {ownerData != null &&
                  (ownerData as any[]).map((item: any) => (
                    <tr key={item.round_id + "- " + item.ticket_num}>
                      <td>{item.round_id}</td>
                      <td>{item.ticket_num}</td>
                      <td>
                        <Ticket ticketId={item.ticket_id} />
                      </td>

                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            onClaim(item);
                          }}
                        >
                          兑奖
                        </button>
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
