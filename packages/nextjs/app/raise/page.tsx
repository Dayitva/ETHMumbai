"use client";

import type { NextPage } from "next";

const Raise: NextPage = () => {
  const tokens = ["USDC", "USDT", "DAI", "BUSD", "GHO"];

  function dummy() {
    console.log("dummy");
  }

  function swapAll() {
    console.log("swapAll");
  }

  function withdraw() {
    console.log("withdraw");
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="overflow-x-auto w-full max-w-screen-md shadow-2xl rounded-xl">
          <table className="table text-xl bg-base-100 table-zebra w-full\ md:table-md table-sm">
            <thead>
              <tr className="rounded-xl text-sm text-base-content text-center">
                <th className="bg-primary">Token</th>
                <th className="bg-primary">Amount</th>
                <th className="bg-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index} className="hover text-sm text-center">
                  <td className="w-1/4 md:py-4">{token}</td>
                  <td className="w-1/4 md:py-4">1</td>
                  <td className="w-1/4 md:py-4">
                    <button
                      className="btn btn-primary w-full py-2"
                      onClick={() => dummy()}
                      style={{ fontSize: "1.2rem" }}
                    >
                      Swap
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center mb-1">
        <div className="mx-2">
          <button className="btn btn-primary w-32" onClick={() => swapAll()}>
            Swap All
          </button>
        </div>
        <div className="mx-2">
          <button className="btn btn-primary w-32" onClick={() => withdraw()}>
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
};

export default Raise;
