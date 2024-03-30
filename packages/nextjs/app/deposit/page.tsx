"use client";

import React, { useState } from "react";
import { EthereumTransactionTypeExtended, Pool } from "@aave/contract-helpers";
import * as markets from "@bgd-labs/aave-address-book";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useSignTypedData } from "wagmi";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const Deposit: NextPage = () => {
  const tokens = ["USDC", "USDT", "GHO", "DAI"];

  const GHO_SEPOLIA = markets.AaveV3Sepolia.ASSETS.GHO.UNDERLYING;
  const DAI_SEPOLIA = markets.AaveV3Sepolia.ASSETS.DAI.UNDERLYING;
  const USDC_SEPOLIA = markets.AaveV3Sepolia.ASSETS.USDC.UNDERLYING;
  const USDT_SEPOLIA = markets.AaveV3Sepolia.ASSETS.USDT.UNDERLYING;

  const nameToReserve = {
    GHO: GHO_SEPOLIA,
    DAI: DAI_SEPOLIA,
    USDC: USDC_SEPOLIA,
    USDT: USDT_SEPOLIA,
  };

  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const AAVE_POOL_SEPOLIA = markets.AaveV3Sepolia.POOL;
  const WETH_GATEWAY_SEPOLIA = markets.AaveV3Sepolia.WETH_GATEWAY;

  const DEADLINE = Math.floor(Date.now() / 1000 + 3600).toString();

  const PRIV_KEY = process.env.NEXT_PUBLIC_EXECUTOR_PRIV_KEY || "test";
  const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID || "test";

  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const [fromInputValue, setFromInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputSelectedToken, setInputSelectedToken] = useState("USDC");
  const [v, setV] = useState(0);
  const [r, setR] = useState("");
  const [s, setS] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromInputValue(e.target.value);
  };

  const handleInputToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleInputSelectToken = (option: string) => {
    setInputSelectedToken(option);
    setIsDropdownOpen(false);
  };

  async function submitTransaction({ provider, tx }: { provider: any; tx: EthereumTransactionTypeExtended }) {
    console.log(tx);
    const extendedTxData = await tx.tx();
    console.log(tx, extendedTxData);
    const { from, ...txData } = extendedTxData;
    // const signer = provider.getSigner(from);
    console.log("From: ", from);
    const txResponse = await provider.sendTransaction({
      ...txData,
      value: 0,
    });
    return txResponse;
  }

  async function approveAndSign({
    pool,
    provider,
    address,
    asset,
    amount,
  }: {
    pool: any;
    provider: ethers.providers.Web3Provider;
    address: string;
    asset: string;
    amount: string;
  }) {
    const dataToSign = await pool.signERC20Approval({
      user: address,
      reserve: asset,
      amount: amount,
      deadline: DEADLINE,
    });

    console.log(dataToSign);

    const signature = await provider.send("eth_signTypedData_v4", [address, dataToSign]);

    console.log(signature);

    return signature;
  }

  const supplyWithPermit = async (address: string, asset: string, amount: string) => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);

    const pool = new Pool(provider, {
      POOL: AAVE_POOL_SEPOLIA,
      WETH_GATEWAY: WETH_GATEWAY_SEPOLIA,
    });

    const infura_provider = new ethers.providers.InfuraProvider("sepolia", INFURA_ID);

    const wallet = new ethers.Wallet(PRIV_KEY, infura_provider);

    console.log(provider);
    console.log(pool);
    console.log(wallet);

    const signature = await approveAndSign({
      pool: pool,
      provider: provider,
      address: address,
      asset: asset,
      amount: amount,
    });

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(2000);
    console.log("done");

    const txs: EthereumTransactionTypeExtended[] = await pool.supplyWithPermit({
      user: address,
      reserve: asset,
      amount: amount,
      signature: signature,
      onBehalfOf: "0x631088Af5A770Bee50FFA7dd5DC18994616DC1fF",
      deadline: DEADLINE,
    });

    const txResponse = await submitTransaction({ provider: wallet, tx: txs[0] });
    console.log(txResponse);
  };

  const { data, isError, isSuccess, signTypedData } = useSignTypedData({
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: "ERC20Token",
      version: "1",
      chainId: targetNetwork.id,
      verifyingContract: tokenAddress,
    },
    primaryType: "Permit",
    message: {
      owner: connectedAddress,
      spender: contractAddress,
      value: fromInputValue,
      nonce: 1,
      deadline: DEADLINE,
    },
  });

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "TinyDexRaise",
    functionName: "deposit",
    args: [tokenAddress, fromInputValue, DEADLINE, v, r, s],
    value: parseEther("0"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  async function deposit(data: any) {
    const signature = data.substring(2);
    const r = "0x" + signature.substring(0, 64);
    const s = "0x" + signature.substring(64, 128);
    const v = parseInt(signature.substring(128, 130), 16);
    console.log({ r, s, v });
    await setV(v);
    await setR(r);
    await setS(s);

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await wait(2000);

    writeAsync();
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-8xl mb-16 mt-32 font-bold">TinyRaise</span>
            <p className="py-0">Bootstrap liquidity gaslessly</p>
          </h1>
        </div>

        <div className="flex items-center mb-1 ">
          <div className="flex-none w-2/1 mr-4">
            <input
              type="text"
              value={fromInputValue}
              onChange={handleInputChange}
              placeholder="Amount"
              style={{
                border: "2px solid black",
                padding: "8px",
                borderRadius: "10px",
                width: "100%",
              }}
            />
          </div>
          <div className="dropdown dropdown-bottom w-2/6 flex-none z-10 relative">
            <label
              tabIndex={0}
              className="btn btn-neutral btn-md dropdown-toggle gap-1"
              onClick={handleInputToggleDropdown}
            >
              <span>{inputSelectedToken}</span> <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
            </label>
            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1 absolute"
                style={{ maxHeight: "200px", overflowY: "auto", left: 0, right: 0, zIndex: 10 }}
              >
                {tokens.map((option: string) => (
                  <li key={option}>
                    <button
                      className="btn-sm !rounded-xl flex py-3 gap-6"
                      type="button"
                      onClick={() => handleInputSelectToken(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button className="btn btn-primary w-1/6 mt-5" onClick={() => deposit(data)}>
          Deposit
        </button>
        <button className="btn btn-primary w-1/6 mt-5" onClick={() => signTypedData()}>
          Sign
        </button>
        <button
          className="btn btn-primary w-1/6 mt-5"
          onClick={() => supplyWithPermit(connectedAddress, nameToReserve[inputSelectedToken], fromInputValue)}
        >
          Supply
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </>
  );
};

export default Deposit;
