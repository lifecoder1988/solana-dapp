import type { NextPage } from "next";
import Head from "next/head";
import { AirdropView } from "../views";
import { useState } from "react";

const Home: NextPage = (props) => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div>
      <Head>
        <title>Airdrop!</title>
        <meta name="description" content="This site will fly high 🦤" />
      </Head>
      <AirdropView />
    </div>
  );
};

export default Home;
