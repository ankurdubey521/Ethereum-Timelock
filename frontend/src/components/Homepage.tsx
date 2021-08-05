import React, { useState } from "react";

import Titlebar from "./Titlebar";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

const Homepage = (): JSX.Element => {
  return (
    <Web3ReactProvider
      getLibrary={(provider, connector) =>
        new ethers.providers.Web3Provider(provider)
      }
    >
      <Titlebar />
    </Web3ReactProvider>
  );
};

export default Homepage;
