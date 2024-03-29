import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Execute",
  description: "Execute Swaps here",
});

const ExecuteLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ExecuteLayout;
