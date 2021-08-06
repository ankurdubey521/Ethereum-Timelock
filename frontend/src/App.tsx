import React from "react";
import "./App.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import Homepage from "./components/Homepage";

require("dotenv").config();

function App() {
  return (
    <Web3ReactProvider
      getLibrary={(provider, connector) =>
        new ethers.providers.Web3Provider(provider)
      }
    >
      <Homepage />;
    </Web3ReactProvider>
  );
}

export default App;
