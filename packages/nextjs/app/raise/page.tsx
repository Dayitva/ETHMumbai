"use client";

import React, { useEffect, useState } from "react";
import { ChainId, UiPoolDataProvider } from "@aave/contract-helpers";
import * as markets from "@bgd-labs/aave-address-book";
import { ethers } from "ethers";
import type { NextPage } from "next";

/* eslint-disable react-hooks/rules-of-hooks */

const RaiseDashboard: NextPage = () => {
  const tokens = Object.keys(markets.AaveV3Sepolia.ASSETS);
  // const tokenBalances = [];

  // const [userReserves, setUserReserves] = useState({});
  const [tokenBalances, setTokenBalances] = useState<number[]>([]);

  // Sample RPC address for querying ETH mainnet
  const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.public.blastapi.io");

  // User address to fetch data for, insert address here
  const currentAccount = "0x631088Af5A770Bee50FFA7dd5DC18994616DC1fF";

  // View contract used to fetch all reserves data (including market base currency data), and user reserves
  // Using Aave V3 Eth Mainnet address for demo
  const poolDataProviderContract = new UiPoolDataProvider({
    uiPoolDataProviderAddress: markets.AaveV3Sepolia.UI_POOL_DATA_PROVIDER,
    provider,
    chainId: ChainId.sepolia,
  });

  async function getReserves() {
    console.log("Provider: ", provider);
    console.log("PoolDataProviderContract: ", poolDataProviderContract);
    console.log(markets.AaveV3Sepolia.ASSETS);
    const userReserves = await poolDataProviderContract.getUserReservesHumanized({
      lendingPoolAddressProvider: markets.AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
      user: currentAccount,
    });
    console.log(userReserves.userReserves);
    // await setUserReserves(userReserves.userReserves);

    const token_balances: number[] = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < userReserves.userReserves.length; j++) {
        // console.log(userReserves.userReserves[i].underlyingAsset);
        // console.log(markets.AaveV3Sepolia.ASSETS[tokens[j]].UNDERLYING);
        const tokenName: keyof typeof markets.AaveV3Sepolia.ASSETS = tokens[
          j
        ] as keyof typeof markets.AaveV3Sepolia.ASSETS;
        if (
          userReserves.userReserves[i].underlyingAsset.toLowerCase() ==
          markets.AaveV3Sepolia.ASSETS[tokenName].UNDERLYING.toLowerCase()
        ) {
          token_balances.push(
            Number(userReserves.userReserves[i].scaledATokenBalance) /
              Math.pow(10, markets.AaveV3Sepolia.ASSETS[tokenName].decimals as number),
          );
        }

        await setTokenBalances(token_balances);
        console.log(tokenBalances);
      }
    }
  }

  useEffect(() => {
    (async () => {
      await getReserves();
    })();
  });

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="overflow-x-auto w-full max-w-screen-md shadow-2xl rounded-xl">
          <table className="table text-xl bg-base-100 mt-50 table-zebra w-full\ md:table-md table-sm">
            <thead>
              <tr className="rounded-xl text-sm text-base-content text-center">
                <th className="bg-primary">Token</th>
                <th className="bg-primary">Amount Raised (in aTokens)</th>
                {/* <th className="bg-primary">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index} className="hover text-sm text-center">
                  <td className="w-1/4 md:py-4">{token}</td>
                  <td className="w-1/4 md:py-4">{tokenBalances[index]}</td>
                  {/* <td className="w-1/4 md:py-4">
                    <button
                      className="btn btn-primary w-full py-2"
                      onClick={() => dummy()}
                      style={{ fontSize: "1.2rem" }}
                    >
                      Swap
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default RaiseDashboard;
