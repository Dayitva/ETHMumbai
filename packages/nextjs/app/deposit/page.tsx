"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useSignTypedData } from "wagmi";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const Deposit: NextPage = () => {
  const tokens = ["USDC", "USDT", "DAI", "BUSD", "GHO"];

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
      verifyingContract: "0xf527BA160517967dAf7EeB844Ee2b56902Baf5F1",
    },
    primaryType: "Permit",
    message: {
      owner: connectedAddress,
      spender: "0xf527BA160517967dAf7EeB844Ee2b56902Baf5F1",
      value: "100000000000000000000",
      nonce: 1,
      deadline: Math.trunc((Date.now() + 120 * 1000) / 1000), // future timestamp
    },
  });

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "TinyDexRaise",
    functionName: "deposit",
    args: [
      "0xf527BA160517967dAf7EeB844Ee2b56902Baf5F1",
      100000000000000000000,
      Math.trunc((Date.now() + 120 * 1000) / 1000),
      v,
      r,
      s,
    ],
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
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </>
  );
};

export default Deposit;
