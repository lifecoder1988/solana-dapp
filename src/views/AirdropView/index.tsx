import Link from "next/link";
import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import styles from "./index.module.css";
import axios from "axios";

import Toast from "../../components/Toast";

async function doAirdrop(walletAddr: string) {
  const apiHost = process.env.NEXT_PUBLIC_API_URL as string;

  const { data } = await axios.get(`${apiHost}/airdrop?wallet=${walletAddr}`);

  return data["data"];
}

export const AirdropView: FC = ({}) => {
  const { publicKey } = useWallet();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const onClick = () => {};

  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000); // 根据Toast组件的autoClose时间自动隐藏Toast
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const walletAddress = event.target.walletAddress.value;
      console.log("Submitted wallet address:", walletAddress);

      await doAirdrop(walletAddress);
      handleShowToast("success");
    } catch (err) {
      console.log(err);
      handleShowToast("failed");
    }

    // 在这里添加提交逻辑，例如调用API
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

        <Toast show={showToast} message={toastMessage} />

        <div className="max-w-md mx-auto mt-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="walletAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Wallet Address
              </label>
              <input
                type="text"
                name="walletAddress"
                id="walletAddress"
                placeholder="Enter your wallet address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Airdrop
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
