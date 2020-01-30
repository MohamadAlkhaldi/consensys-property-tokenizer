const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider'); 
const fs = require('fs'); 
let secrets; 
if (fs.existsSync('secrets.json')) 
{ secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8')); }

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      network_id: "5777"
    },
    rinkeby: { 
       provider: new HDWalletProvider(secrets.mnemonic, 'https://rinkeby.infura.io/v3/'+secrets.infuraApiKey), 
       network_id: '4' 
      }
  }
};