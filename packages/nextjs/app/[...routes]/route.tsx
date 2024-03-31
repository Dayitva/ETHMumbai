/* eslint-disable react/jsx-key */

/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", c => {
  const { status } = c;
  return c.res({
    action: "/finish",
    image: (
      <div
        style={{
          alignItems: "center",
          background: status === "response" ? "linear-gradient(to right, #432889, #17101F)" : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Contribute to the community fund. Raising 10 ETH.
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter amount to contribute" />,
      <Button.Transaction target="/send-ETH">ETH</Button.Transaction>,
      <Button.Link href="https://tinyraise.vercel.app">TinyRaise</Button.Link>,
    ],
  });
});

app.frame("/finish", c => {
  const { transactionId } = c;
  return c.res({
    image: <div style={{ color: "white", display: "flex", fontSize: 60 }}>Transaction ID: {transactionId}</div>,
  });
});

app.transaction("/send-ETH", c => {
  const { inputText } = c;
  // Send transaction response.
  return c.send({
    chainId: "eip155:84532",
    to: "0x631088Af5A770Bee50FFA7dd5DC18994616DC1fF",
    value: parseEther(inputText || "0"),
  });
});

// app.transaction('/send-WETH', (c) => {
//   const { inputText } = c
//   // Send transaction response.
//   return c.send({
//     chainId: 'eip155:84532',
//     to: '0x631088Af5A770Bee50FFA7dd5DC18994616DC1fF',
//     value: parseEther(inputText),
//   })
// })

// app.transaction('/send-USDC', (c) => {
//   const { inputText } = c
//   // Send transaction response.
//   return c.send({
//     chainId: 'eip155:84532',
//     to: '0x631088Af5A770Bee50FFA7dd5DC18994616DC1fF',
//     value: parseEther(inputText),
//   })
// })

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
