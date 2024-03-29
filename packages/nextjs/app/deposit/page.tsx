"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Deposit: NextPage = () => {
  const tokens = ["USDC", "USDT", "DAI", "BUSD", "GHO"];

  const [fromInputValue, setFromInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputSelectedToken, setInputSelectedToken] = useState(tokens[0]);

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

  function swap() {
    console.log("swap");
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-8xl mb-16 mt-32 font-bold">Tiny DEX</span>
            <p className="py-8">Swap gaslessly</p>
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
        <button className="btn btn-primary w-1/6 mt-5" onClick={swap}>
          Swap
        </button>
      </div>
    </>
  );
};

export default Deposit;
