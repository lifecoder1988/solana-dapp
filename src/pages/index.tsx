import type { NextPage } from "next";
import Head from "next/head";
import { HomeView2 } from "../views";

import LotterySDK from "lottery_sdk";

// 该函数在服务器端运行，用于获取页面数据
export async function getServerSideProps(context: any) {
  // 示例: 从API或其他数据源获取数据
  console.log(111);
  const data = { message: "这是从服务器端获取的数据！" };

  const apiHost = "http://127.0.0.1:8000/api/v1";

  const lotterySDK = new LotterySDK(apiHost);
  const activeRoundData = await lotterySDK.getActiveRound();
  const olderRoundData = await lotterySDK.getOlderRound();
  const pendingRoundData = await lotterySDK.getPendingRound();

  const currentTs = new Date().getTime() / 1000;
  // 将获取的数据作为props传递给页面组件
  return {
    props: { activeRoundData, olderRoundData, pendingRoundData, currentTs },
  };
}

interface HomeProps {
  activeRoundData: any; // 请根据实际数据结构替换any
  olderRoundData: any;
  pendingRoundData: any;
  currentTs: number;
}

const Home: NextPage<HomeProps> = ({
  activeRoundData,
  olderRoundData,
  pendingRoundData,
  currentTs,
}) => {
  const childProps = {
    activeRoundData: activeRoundData,
    olderRoundData: olderRoundData,
    pendingRoundData: pendingRoundData,
    currentTs: currentTs,
  };
  return (
    <div>
      <Head>
        <title>Caw Caw!</title>
        <meta name="description" content="This site will fly high 🦤" />
      </Head>
      <HomeView2 {...childProps} />
    </div>
  );
};

export default Home;
