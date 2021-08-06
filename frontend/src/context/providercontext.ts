import { ethers } from "ethers";
import { createContext } from "react";
import type { IProviderContext } from "../types/interfaces";

export const ProviderContext = createContext<IProviderContext>({
  websocketProvider: new ethers.providers.WebSocketProvider(""),
  setWebsocketProvider: () => {},
  biconomyInitialized: false,
});
