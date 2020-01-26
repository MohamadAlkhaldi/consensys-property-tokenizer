const PropertyFactory = artifacts.require("PropertyFactory");

module.exports = function(deployer) {
  deployer.deploy(PropertyFactory);
};
