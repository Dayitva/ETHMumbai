"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import * as chains from "wagmi/chains";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const networks = [
    chains.mainnet,
    chains.goerli,
    chains.polygon,
    chains.gnosis,
    chains.bsc,
    chains.arbitrum,
    chains.optimism,
    chains.avalanche,
    chains.aurora,
    chains.base,
    chains.baseGoerli,
    chains.polygonZkEvm,
    chains.zkSync,
  ];

  const [inputValue, setInputValue] = useState("");
  const [selectedNetwork, setSelectedNetwork] = React.useState(chains["goerli"]);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  function dummy() {
    console.log("dummy");
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl mb-32 mt-32 font-bold">Tiny DEX</span>
          </h1>
        </div>

        <div className="flex items-center mb-1">
          <div className="flex-none w-2/1 mr-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              style={{
                border: "2px solid black",
                padding: "8px",
                borderRadius: "10px",
                width: "100%",
              }}
            />
          </div>
          <div className="dropdown dropdown-bottom w-2/6 flex-none">
            <label tabIndex={0} className="btn btn-neutral btn-md dropdown-toggle gap-1">
              <span>{selectedNetwork.name} </span> <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {networks.map((option: any) => (
                <li key={option.name}>
                  <button
                    className="btn-sm !rounded-xl flex py-3 gap-6"
                    type="button"
                    onClick={() => setSelectedNetwork(option)}
                  >
                    {option.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#222222"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>

        <div className="flex items-center mb-9">
          <div className="flex-none w-2/1 mr-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              style={{
                border: "2px solid black",
                padding: "8px",
                borderRadius: "10px",
                width: "100%",
              }}
            />
          </div>
          <div className="dropdown dropdown-bottom w-2/6 flex-none">
            <label tabIndex={0} className="btn btn-neutral btn-md dropdown-toggle gap-1">
              <span>{selectedNetwork.name} </span> <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {networks.map((option: any) => (
                <li key={option.name}>
                  <button
                    className="btn-sm !rounded-xl flex py-3 gap-6"
                    type="button"
                    onClick={() => setSelectedNetwork(option)}
                  >
                    {option.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="btn btn-primary w-1/6" onClick={() => dummy()}>
          Swap
        </button>
      </div>
    </>
  );
};

export default Home;
