import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  paths: { tests: "tests" },
  solidity: "0.8.17",

  networks: {
    goerli: {
      url: process.env.goerli_URL || "",
      accounts:
        process.env.GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.GOERLI_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    }
  },
};

export default config;
