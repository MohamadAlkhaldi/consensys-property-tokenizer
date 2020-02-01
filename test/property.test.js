const PropertyFactory = artifacts.require("PropertyFactory");
const Property = artifacts.require("Property");
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract("Property", accounts => {

  const ownerAccount = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];
  const account3 = accounts[3];
  const account4 = accounts[4];
  const account5 = accounts[5];
  const account6 = accounts[6];

  const property1 = {
    address : "Property 1 address",
    description : "Property 1 description",
    price : etherToWei(100),
    supply : 10
  }

  function etherToWei (amount) {
    return web3.utils.toWei(amount.toString(), "ether")
  }

  let factoryInstance
  let property1Address
  let property1Instance

  beforeEach(async () => {
    factoryInstance = await PropertyFactory.new()
    await factoryInstance.createProperty(property1.address, property1.description, property1.price, property1.supply, {from: ownerAccount})
    let propertiesList = await factoryInstance.getProperties()
    property1Address = propertiesList[0]
    property1Instance = await Property.at(property1Address)
  })

  describe('Setup', () => {
    it("Owner should be the creator account not the factory contract", async () => {
        let ExpectedContractOwner = ownerAccount;
        let ActualContractOwner = await property1Instance.owner()

        assert.equal(ExpectedContractOwner, ActualContractOwner, "Owner is not the creator account");
    });

    it("Owner is first added to holders list at instantiation and own the total supply", async () => {
        let holders = await property1Instance.getHolders();
        let OwnedSupply = await property1Instance.balanceOf(ownerAccount)

        assert.equal(ownerAccount, holders[0], "Owner is not added to holders at instantiation");
        assert.equal(property1.supply, OwnedSupply, "Owner is not added to holders at instantiation");
    })

    it("Contract should accept the sent ether", async () => {
      await property1Instance.send(etherToWei(3), {from : account5})
      let contractBalance = await web3.eth.getBalance(property1Address)
      assert.equal(etherToWei(3),contractBalance, "Contract didn't accept the sent ether")
    })
  })

  describe("Functions", () =>{
      describe("buyShare", async () => {

        beforeEach(async () => {
          await property1Instance.setMySharesForSale({from : ownerAccount});
        })
        
        it("New holder address should be added to holders", async () => {
          await property1Instance.buyShare(ownerAccount, 2, {from: account1, value: etherToWei(20)});
          let holders = await property1Instance.getHolders();
          let exist = false
          for(let i = 0; i < holders.length; i++){
            if(holders[i] == account1){
              exist = true
            }
          }
          
          assert(exist, "New holder is not added")
        })

        it("The price should be added to seller revenue", async () => {
          await property1Instance.buyShare(ownerAccount, 2, {from: account1, value: etherToWei(20)});
          let sellerRevenue = await property1Instance.holdersRevenue(ownerAccount)
          assert.equal(etherToWei(20), sellerRevenue, "Price is not added to seller revenue")
        })

        it("Should revert when funds are less than the price", async () => {
          await catchRevert(property1Instance.buyShare(ownerAccount, 2, {from: account3, value: etherToWei(10)}))
        })

        it("Should revert when seller owns less tokens than the requested", async () => {
          await property1Instance.buyShare(ownerAccount, 2, {from: account3, value: etherToWei(20)})
          await catchRevert(property1Instance.buyShare(ownerAccount, 9, {from: account2, value: etherToWei(90)}))
        })

        it("Should revert when requested buyer is not selling", async () => {
          await property1Instance.setMySharesNotForSale({from : ownerAccount});
          await catchRevert(property1Instance.buyShare(ownerAccount, 2, {from: account1, value: etherToWei(20)}));
        })
        
      })

      describe("distribute", async () => {
        beforeEach(async () => {
          await property1Instance.send(etherToWei(5), {from : account4})
        })
        
        it("Only owner can distribute revenue", async () => {
          await catchRevert(property1Instance.distributeRevenue({from : account1}))
        })
        
        it("Holder's revenue should increase", async () => {
          await property1Instance.setMySharesForSale({from : ownerAccount});
          await property1Instance.buyShare(ownerAccount, 1, {from: account1, value: etherToWei(10)});
          let account1RevenueBeforeDistribution = await property1Instance.holdersRevenue(account1)
          await property1Instance.distributeRevenue({from : ownerAccount})
          let account1RevenueAfterDistribution = await property1Instance.holdersRevenue(account1)

          assert(account1RevenueBeforeDistribution < account1RevenueAfterDistribution, "Holder's revenue did not increase after distribution")
        })

        it("Should revert if property revenue is zero", async () => {
          await property1Instance.distributeRevenue({from : ownerAccount})
          await catchRevert(property1Instance.distributeRevenue({from : ownerAccount}))
        })
      })

      describe("withdraw", async () => {
        beforeEach(async () => {
          await property1Instance.setMySharesForSale({from : ownerAccount});
          await property1Instance.buyShare(ownerAccount, 2, {from: account1, value: etherToWei(20)});
          await property1Instance.send(etherToWei(1), {from : account3})
        })
        
        it("Should revert if holder's revenue is zero", async () => {
          await catchRevert(property1Instance.withdraw({from : account1}))
        })
        
        it("Should send revenue amount in to holder", async () => {
          await property1Instance.distributeRevenue({from : ownerAccount})
          // let holdersRevenue = await property1Instance.holdersRevenue(account1)
          let etherBalanceBeforeWithdrawal = await web3.eth.getBalance(account1)
          await property1Instance.withdraw({from : account1})
          let etherBalanceAfterWithdrawal = await web3.eth.getBalance(account1)

          assert((etherBalanceAfterWithdrawal - etherBalanceBeforeWithdrawal) > 0, etherBalanceAfterWithdrawal)
        })
      })

      describe("circuitBreaker", async () => {
        beforeEach(async () => {
          await property1Instance.setMySharesForSale({from : ownerAccount});
          await property1Instance.buyShare(ownerAccount, 2, {from: account5, value: etherToWei(20)})
          await property1Instance.setMySharesForSale({from : account5});
        })
        it("Should revert if someone tries to buy when circuit is paused", async () => {
          await property1Instance.circuitBreaker({from: ownerAccount})
          await catchRevert(property1Instance.buyShare(account5, 2, {from: account6, value: etherToWei(20)}))
        })
        it("Holders should be able to withdraw revenue even when circuit is paused", async () => {
          await property1Instance.buyShare(account5, 2, {from: account6, value: etherToWei(20)})
          let etherBalanceBeforeWithdrawal = await web3.eth.getBalance(account5)
          await property1Instance.circuitBreaker({from: ownerAccount})
          await property1Instance.withdraw({from : account5})
          let etherBalanceAfterWithdrawal = await web3.eth.getBalance(account5)

          assert((etherBalanceAfterWithdrawal - etherBalanceBeforeWithdrawal) > 0, etherBalanceAfterWithdrawal)
        })
      })
  })
  

});
