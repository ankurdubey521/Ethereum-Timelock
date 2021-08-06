import { ethers } from "ethers";
import React from "react";

export interface IProviderContext {
  websocketProvider: ethers.providers.WebSocketProvider;
  setWebsocketProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.WebSocketProvider>
  >;
}

export enum TimeLockDepositType {
  ERC20,
  ETH,
}
export interface ITimeLockDeposit {
  depositId: ethers.BigNumber;
  depositor: string;
  receiver: string;
  erc20Token: string | null;
  depositType: TimeLockDepositType;
  minimumReleaseTimestamp: ethers.BigNumber;
  amount: ethers.BigNumber;
  claimed: boolean;
}

export interface IInboundDepositProps {
  deposit: ITimeLockDeposit;
}

export interface IOutboundDepositProps {
  deposit: ITimeLockDeposit;
}
