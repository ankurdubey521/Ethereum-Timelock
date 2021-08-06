import { ethers } from "ethers";
import { abi } from "./abi/ERC20";

export class ERC20Util {
  signer: ethers.Signer;
  contract: ethers.Contract;

  constructor(signer: ethers.Signer, tokenAddress: string) {
    this.signer = signer;
    this.contract = new ethers.Contract(tokenAddress, abi, this.signer);
  }

  decimals = async (): Promise<number> => this.contract.decimals();

  approve = async (spender: string, amount: ethers.BigNumber) => {
    await this.contract.approve(spender, amount);
  };

  allowance = async (spender: string): Promise<ethers.BigNumber> =>
    await this.contract.allowance(await this.signer.getAddress(), spender);
}