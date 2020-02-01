const PropertyFactory = artifacts.require("PropertyFactory");
const Property = artifacts.require("Property");

contract("PropertyFactory", accounts => {

  const ownerAccount = accounts[0];

  const property1 = {
    address : "Property 1 address",
    description : "Property 1 description",
    price : 100,
    supply : 10
  }

  let factoryInstance

  beforeEach(async () => {
    factoryInstance = await PropertyFactory.new()
  })

  describe('Creating new property', () => {
    it("Should deploy new property", async () => {
      let listBeforeCreatingNewProperty = await factoryInstance.getProperties();
      await factoryInstance.createProperty(property1.address, property1.description, property1.price, property1.supply, {from: ownerAccount});
      let listAfterCreatingNewProperty = await factoryInstance.getProperties();

      assert.equal(listAfterCreatingNewProperty.length, listBeforeCreatingNewProperty.length + 1, "Address is not added successfully");
    });

    it("New property info should be equal to the sent params", async () => { 
      await factoryInstance.createProperty(property1.address, property1.description, property1.price, property1.supply, {from: ownerAccount});
      let propertiesList = await factoryInstance.getProperties();
      let newPropertyAddress = propertiesList[0];
      let property = await Property.at(newPropertyAddress);
      let propertyInfo = await property.propertyInfo()
      let propertyAddress = propertyInfo._address;
      let propertyDescrption = propertyInfo._description;
      let propertyPrice = propertyInfo.price;
      let propertySupply = await property.totalSupply();
  
      assert.equal(property1.price, propertyPrice, "Wrong property's price");
      assert.equal(property1.supply, propertySupply, "Wrong property's supply");
      assert.equal(property1.address, propertyAddress, "Wrong property's address");
      assert.equal(property1.description, propertyDescrption, "Wrong property's description");
    });
  })
  

});
