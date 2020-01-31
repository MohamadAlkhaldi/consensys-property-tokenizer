pragma solidity >=0.4.22 <0.7.0;

import "./Property.sol";

///@author MohamadAlkhaldi, https://twitter.com/MohamadKBC, https://github.com/MohamadAlkhaldi
///@notice A factory contract, that creates new properties contracts and keeps track of them
contract PropertyFactory {
    address[] public properties;

    event NewPropertyAdded(address owner, address property);

    ///@notice Allows any one to deploy a child contract to represent a property he owns
    ///@dev No restrictions on this funcion for now, TODO: creation require authority approval
    ///@param _address string, property physical address, the real address
    ///@param _description string, property description, eg: view, number of bedrooms
    ///@param _price uint, the total price of property
    ///@param _supply uint, the number of shares the property will be splitted to
    function createProperty(string memory _address, string memory _description, uint _price, uint _supply)
        public
    {
        Property newProperty = new Property(properties.length, _address, _description, _price, _supply, msg.sender);
        properties.push(address(newProperty));
        emit NewPropertyAdded(msg.sender, address(newProperty));
    }

    ///@notice Allows to get the properties list
    ///@return Returns an array of all added properties
    function getProperties() public view returns(address[] memory){
        return properties;
    }

}
