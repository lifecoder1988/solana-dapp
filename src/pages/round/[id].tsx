import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { RoundView } from "../../views";

import LotterySDK from "lottery_sdk";

import { useRouter } from "next/router";

type Params = {
  id: string;
};

export const getServerSideProps: GetServerSideProps<
  {
    /* Props 类型 */
  },
  Params
> = async ({ params }) => {
  console.log(params?.id);
  const id = params?.id;
  const apiHost = process.env.API_URL as string;

  const roundId = id;

  const lotterySDK = new LotterySDK(apiHost);

  if (typeof roundId === "string") {
    const roundData = await lotterySDK.getRound(roundId);
    const ticketsData = await lotterySDK.listTicketsByRoundId(roundId);

    // 将获取的数据作为props传递给页面组件
    return { props: { roundData, ticketsData } };
  }

  return { props: {} };
};

interface RoundProps {
  roundData: any; // 请根据实际数据结构替换any
  ticketsData: any;
}

const Round: NextPage<RoundProps> = ({ roundData, ticketsData }) => {
  const childProps = {
    roundData: roundData,
    ticketsData: ticketsData,
  };
  return (
    <div>
      <Head>
        <title>Caw Caw!</title>
        <meta name="description" content="This site will fly high 🦤" />
      </Head>
      <RoundView {...childProps} />
    </div>
  );
};

export default Round;
