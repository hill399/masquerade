require("@nomiclabs/hardhat-waffle");

const MUMBAI_PK = process.env.MUMBAI_PK;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc-mumbai.matic.today"
      }
    },
    mumbai: {
        url: "https://rpc-mumbai.matic.today",
        accounts: [`${MUMBAI_PK}`]
    },
  },
  solidity: "0.6.6",
};
