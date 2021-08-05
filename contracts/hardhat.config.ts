import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();

import type { HardhatUserConfig } from "hardhat/config";

const Config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    kovan: {
      url: "https://kovan.infura.io/v3/98b0477e69b1415cbaf0c6b49da3206a",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default Config;
