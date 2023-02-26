import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  paths: { tests: "tests" },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },


  networks: {
    goerli: {
      url: process.env.goerli_URL || "",
      accounts:
        process.env.GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.GOERLI_PRIVATE_KEY]
          : [],
    },
    // hardhat: {
    //   allowUnlimitedContractSize: true,
    // }
  },
};

export default config;
