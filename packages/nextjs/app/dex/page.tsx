"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Dex: NextPage = () => {
  const tokens = ["USDC", "USDT", "DAI", "GHO"];

  const [fromInputValue, setFromInputValue] = useState("");
  const [toOutputValue, setToOutputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOutputDropdownOpen, setIsOutputDropdownOpen] = useState(false);
  const [inputSelectedToken, setInputSelectedToken] = useState(tokens[0]);
  const [outputSelectedToken, setOutputSelectedToken] = useState(tokens[0]);

  const handleInputChange = (e: any) => {
    setFromInputValue(e.target.value);
  };

  const handleOutputChange = (f: any) => {
    setToOutputValue(f.target.value);
  };

  const handleInputToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOutputToggleDropdown = () => {
    setIsOutputDropdownOpen(!isOutputDropdownOpen);
  };

  const handleInputSelectToken = (option: string) => {
    setInputSelectedToken(option);
    setIsDropdownOpen(false);
  };

  const handleOutputSelectToken = (option: string) => {
    setOutputSelectedToken(option);
    setIsOutputDropdownOpen(false);
  };

  function swap() {
    console.log("swap");
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-7xl mb-6 mt-32 font-bold">TinyDEX</span>
            <p className="mb-20">Swap gaslessly!</p>
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
                style={{ maxHeight: "200px", overflowY: "auto", left: 0, right: 0, zIndex: 10 }} // Set zIndex to 10
              >
                {tokens.map((option: any) => (
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

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#222222"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>

        <div className="flex items-center mb-9">
          <div className="flex-none w-2/1 mr-4">
            <input
              type="text"
              value={toOutputValue}
              onChange={handleOutputChange}
              placeholder="Amount"
              style={{
                border: "2px solid black",
                padding: "8px",
                borderRadius: "10px",
                width: "100%",
              }}
            />
          </div>
          <div className="dropdown dropdown-bottom w-2/6 flex-none relative">
            <label
              tabIndex={0}
              className="btn btn-neutral btn-md dropdown-toggle gap-1"
              onClick={handleOutputToggleDropdown}
            >
              <span>{outputSelectedToken}</span> <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
            </label>
            {isOutputDropdownOpen && (
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 mt-1 shadow-center shadow-accent bg-base-200 rounded-box gap-1 absolute"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {tokens.map((option: any) => (
                  <li key={option}>
                    <button
                      className="btn-sm !rounded-xl flex py-3 gap-6"
                      type="button"
                      onClick={() => handleOutputSelectToken(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button className="btn btn-primary w-1/6" onClick={() => swap()}>
          Swap
        </button>
      </div>
    </>
  );
};

export default Dex;
