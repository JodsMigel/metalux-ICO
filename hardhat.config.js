require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.17"},
      { version: "0.7.6"},
      { version: "0.4.18"},
      { version: "0.6.0"}
    ]},
  mocha: {
    timeout: 100000000
  },
  networks: {
      hardhat: {
        forking: {
          url: "https://polygon-rpc.com",
          blockNumber: 36979387,
          //blockNumber: 36576002,
        }
      },
      polygon: {
        url: "https://polygon-rpc.com",
        accounts: [process.env.SECRET_KEY],
      }
    },
    etherscan: {
      apiKey: {
        polygon : ,
      },
    },
    
};
