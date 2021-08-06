import { createWeb3ReactRoot } from "@web3-react/core";

let initializer = () => {
  const provider = createWeb3ReactRoot("biconomy");
  initializer = () => provider;
  return provider;
};

export const BiconomyProvider = initializer();
