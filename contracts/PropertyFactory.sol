pragma solidity >=0.4.22 <0.7.0;

import "./Property.sol";

contract PropertyFactory {
    address[] public properties;

    event NewPropertyAdded(address owner, address property);

    function createProperty(string memory _address, string memory _description, uint _price, uint _supply)
        public
    {
        Property newProperty = new Property(properties.length, _address, _description, _price, _supply, msg.sender);
        properties.push(address(newProperty));
        emit NewPropertyAdded(msg.sender, address(newProperty));
    }

    function getProperties() public view returns(address[] memory){
        return properties;
    }

}
