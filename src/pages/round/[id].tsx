import type { NextPage } from "next";
import Head from "next/head";
import { RoundView } from "../../views";

import LotterySDK from "lottery_sdk";


import { useRouter } from 'next/router';

// 该函数在服务器端运行，用于获取页面数据
export async function getServerSideProps({params} ) {
  // 示例: 从API或其他数据源获取数据
  
  const { id } = params;
  const apiHost = "http://127.0.0.1:8000/api/v1"

  const roundId  = id

  const lotterySDK = new LotterySDK(apiHost)
  
  if (typeof roundId === 'string') {
    const roundData = await lotterySDK.getRound(roundId)
    const ticketsData = await lotterySDK.listTicketsByRoundId(roundId)
   
    // 将获取的数据作为props传递给页面组件
    return { props: { roundData  ,  ticketsData  } }; 
  }

  return {}
  
}

const Round: NextPage = ({roundData ,ticketsData  }) => {

  const childProps = {
    roundData: roundData,
    ticketsData: ticketsData,
   
  };
  return (
    <div>
      <Head>
        <title>Caw Caw!</title>
        <meta
          name="description"
          content="This site will fly high 🦤"
        />
      </Head>
      <RoundView  {...childProps} />
    </div>
  );
};

export default Round;
