import { ethers } from "ethers";

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
