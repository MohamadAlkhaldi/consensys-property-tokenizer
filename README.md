# Property Tokenizer
Your real estate liquidation portal
## What do we do
 Property Tokenizer solution is a platform that leverages Blockchain technology, to enable real estate owners to split their property to several shares/tokens and liquidate some of these shares, without having to lose ownership over the whole asset. On the other side of the deal, are people interested in investing in real estate, but don’t have enough money to buy an entire property, or investors who want to diversify their investment to several properties.


## How to use the platform 
Our process is simple:
 1. Real estate authority deploys a property factory contract,
 2. through which owners can create and deploy a property contract, which represent the property to be tokenized.
 3. When property is listed buyers can buy shares.
 4. The source of revenue (rent), which to be paid using the platform.
 5. Revenue will be distributed among shareholders.
 
Join me in a walk around the platform in this demo video: https://youtu.be/8ARpa42jCuA


## Project Setup
> Alert: only techies are allowed after this point

To setup this project in a local environment you need to have:
- Node v10.16.10 (Truffel test is crashing with the latest node release)
- npm
- Truffle 
- git
- Metamask extension

> Please note while you proceed that the client is no longer hosted on IPFS

To play with this project you have two networks and two front-end servers to choose from, which leaves with four scenarios:
-	Local development network with front-end served by a local server
-	Local development network with front-end served by IPFS 
-	Rinkeby network with front-end served by a local server
-	Rinkeby network with front-end served by IPFS

 The logical order is to setup the network -> connect Metamask -> serve client 
1.	Local development network:
```sh
        $ git clone https://github.com/MohamadAlkhaldi/consensys-property-tokenizer.git
        $ cd consensys-property-tokenizer
        $ npm install
        $ truffle develop
        $ compile
        $ migrate
        $ test
        Connect Metamask to a funded account on the localhost network
```
2.	**Rinkeby** network: 
```
        Just connect Metamask to a funded account on the Rinkeby network
```
3.	Front-end served by a local server:
```sh
        $ cd client
        $ npm install
        $ npm start
```
4.	Front-end served by IPFS:
At: https://ipfs.io/ipfs/QmWv3C87yciLwmVkZWhLgRrGAvHwauFuU9PNer1aYdGPHB/

>Note on networks: As mentioned the contract is deployed on Rinkeby, so if you also setup your local network with truffle develop like above, it's all up to Metamask on which network you are interacting with.

**Ropsten** Contract is also deployed on Ropsten testnet, you can play with it using Remix IDE. Check the deployment address at deployed_addresses.txt

## Honorable Mentions
**Drizzle** I've got introduced to Truffle suit's Drizzle working on this project, and to be honest the first two days were not very smooth, but later on and looking back to previous projects where I used only React and web3js to interact with my smart contracts, it's saved ton of time and a lot of lines of code, will writ more about this experience.

This project was #built_with_Truffle

More mentions to be added to this list.
