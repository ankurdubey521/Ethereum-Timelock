import React, { useState } from "react";
import "./App.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

import { ProviderContext } from "./context/providercontext";
import Homepage from "./components/Homepage";

require("dotenv").config();

function App() {
  const [websocketProvider, setWebsocketProvider] = useState(
    new ethers.providers.WebSocketProvider(
      process.env.REACT_APP_INFURA_WS_URL as string
    )
  );
  return (
    <ProviderContext.Provider
      value={{
        websocketProvider,
        setWebsocketProvider,
      }}
    >
      <Web3ReactProvider
        getLibrary={(provider, connector) =>
          new ethers.providers.Web3Provider(provider)
        }
      >
        <Homepage />;
      </Web3ReactProvider>
    </ProviderContext.Provider>
  );
}

export default App;
