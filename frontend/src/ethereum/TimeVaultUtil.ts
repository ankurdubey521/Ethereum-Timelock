import { ethers } from "ethers";
import { abi } from "./abi/TimeVault";

import type { ITimeLockDeposit } from "../types/interfaces";

export class TimeVaultUtil {
  signer: ethers.Signer;
  contract: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS as string,
      abi,
      this.signer
    );
  }

  createEthTimeLockDeposit = async (
    receiverAddress: string,
    minimumReleaseTimestamp: number,
    value: ethers.BigNumber
  ) =>
    await this.contract.createEthTimeLockDeposit(
      receiverAddress,
      minimumReleaseTimestamp,
      {
        value,
      }
    );

  createErc20TimeLockDeposit = async (
    receiverAddress: string,
    minimumReleaseTimestamp: number,
    tokenAddress: string,
    value: ethers.BigNumber
  ) =>
    await this.contract.createErc20TimeLockDeposit(
      receiverAddress,
      minimumReleaseTimestamp,
      tokenAddress,
      value
    );

  claimDeposit = async (depositId: ethers.BigNumber | number) =>
    await this.contract.claimDeposit(depositId);

  getDepositsByDepositor = async (
    depositor: string
  ): Promise<ITimeLockDeposit[]> => {
    return (await this.contract.getDepositsByDepositor(depositor)).map(
      ([
        depositId,
        depositor,
        receiver,
        erc20Token,
        depositType,
        minimumReleaseTimestamp,
        amount,
        claimed,
      ]: [
        ethers.BigNumber,
        string,
        string,
        string,
        [0, 1],
        ethers.BigNumber,
        ethers.BigNumber,
        boolean
      ]) => ({
        depositId,
        depositor,
        receiver,
        erc20Token,
        depositType,
        minimumReleaseTimestamp,
        amount,
        claimed,
      })
    );
  };

  getDepositsByReceiver = async (
    depositor: string
  ): Promise<ITimeLockDeposit[]> => {
    return (await this.contract.getDepositsByReceiver(depositor)).map(
      ([
        depositId,
        depositor,
        receiver,
        erc20Token,
        depositType,
        minimumReleaseTimestamp,
        amount,
        claimed,
      ]: [
        ethers.BigNumber,
        string,
        string,
        string,
        [0, 1],
        ethers.BigNumber,
        ethers.BigNumber,
        boolean
      ]) => ({
        depositId,
        depositor,
        receiver,
        erc20Token,
        depositType,
        minimumReleaseTimestamp,
        amount,
        claimed,
      })
    );
  };
}
