import { ethers } from "hardhat";

const deploy = async () => {
  const factory = await ethers.getContractFactory("TimeVault");
  const contract = await factory.deploy(
    "0xF82986F574803dfFd9609BE8b9c7B92f63a1410E"
  );
  console.log(`Contract deployed at ${contract.address}`);
};

deploy();
