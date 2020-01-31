pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

///@notice A digital represntation of a property, which allows owner to tokenize his property into shares,
///created by the owner of the property through the PropertyFactory contract
///@dev Extends ERC20 and Ownable contracts, uses SafeMath library
contract Property is ERC20, Ownable {
    using SafeMath for uint256;

    bool internal paused = false;

    address[] public holders;
    mapping(address=>bool) public holdersSelling;
    mapping(address => uint) public holdersRevenue;
    uint public propertyRevenue;

    event ShareBought(address seller, address buyer, uint amount);
    event HolderStatusChanged(address holder, bool status);
    event RevenueDistributed();
    event HolderRemoved(address holder);
    event RevenueWithdrawal(address holder, uint amount);

    struct PropertyInfo {
        uint id;
        string _address;
        string _description;
        uint price;
    }

    PropertyInfo public propertyInfo;

    ///@dev setting properties specs on instatiation
    ///@param _id uint, unique id and the property address's index in the list of properties deployed by the factory contract
    ///@param _address string, property physical address, the real address
    ///@param _description string, property description, eg: view, number of bedrooms
    ///@param _price uint, the total price of property
    ///@param _supply uint, the number of shares the property will be splitted to
    ///@param _owner address, the owner who deployed this property using the factory contract
    constructor(uint _id, string memory _address, string memory _description, uint _price, uint _supply, address _owner) public {
        transferOwnership(_owner);
        holders.push(_owner);
        propertyRevenue = 0;
        propertyInfo = PropertyInfo(_id, _address, _description, _price);
        _mint(_owner, _supply);
    }

    ///@notice A fall back, allows contract to recieve ETH
    ///@dev Adds sent the amount of ETH to porperty revenure
    function () external payable {
       propertyRevenue += msg.value;
    }

    ///@notice Allows owner to stop some functionalities in case of emergency
    ///@dev Toggles the bool value of paused
    function circuitBreaker() public onlyOwner(){
        if(paused){
            paused = false;
        } else {
            paused = true;
        }
    }

    ///@notice Returns the list of holders
    ///@return holders array
    function getHolders() public view returns(address[] memory) {
        return holders;
    }

    ///@notice Called by a buyer who wants to buy certain amout of shares from a specific holder
    ///@dev Won't execute when paused is true, except ETH and assign additional amount if any to buyer's revenue,
    ///tranfers shares from seller to buyer, add price amount seller's revenue
    ///@param _from address, holder address to by shares from
    ///@param _amount uint, number of shares buyer want to buy
    function buyShare(address _from, uint  _amount) public payable checkIfPaused(){
        require(holdersSelling[_from], "The requested shareholder is not selling");
        uint holderBalance = balanceOf(_from);
        uint price = (propertyInfo.price/totalSupply())*_amount;
        require(_amount <= holderBalance, "Shareholder doesn't have this much tokens");
        require(msg.value >= price, "Insufficient funds");
        if(balanceOf(msg.sender) == 0){
            holders.push(msg.sender);
        }
        _transfer(_from, msg.sender, _amount);
        holdersRevenue[_from] += price;
        if(msg.value > price){
            holdersRevenue[msg.sender] += (msg.value - price);
        }
        emit ShareBought(_from, msg.sender, _amount);
    }

    ///@notice Allows shareholder to list his shares for sale
    function setMySharesForSale() public onlyShareHolder(){
        holdersSelling[msg.sender] = true;
        emit HolderStatusChanged(msg.sender, true);
    }

    ///@notice Allows shareholder to list his shares not for sale
    function setMySharesNotForSale() public onlyShareHolder(){
        holdersSelling[msg.sender] = false;
        emit HolderStatusChanged(msg.sender, false);
    }

    ///@notice Allows owner to distrbute revenue eg:rent, among shareholders
    ///@dev Even though we iterate over an array here, but this array's length is under control as it can't exceeds number of tokens
    function distributeRevenue() public onlyOwner(){
        require(propertyRevenue > 0, "No revenue to distribute");
        for (uint i = 0; i < holders.length; i++){
            uint holdersRevenueShare = (propertyRevenue/totalSupply()) * balanceOf(holders[i]);
            holdersRevenue[holders[i]] += holdersRevenueShare;
        }
        propertyRevenue = 0;
        emit RevenueDistributed();
    }

    ///@notice Removes holder from holders list
    ///@dev Called internally after withdrwal if holder's balance and revenue are 0s
    ///@param _holderAddress address, holder's address to be removed
    function removeHolder(address _holderAddress) internal{
        for(uint i = 0; i < holders.length; i++){
          if(holders[i] == _holderAddress){
            holders[i] = holders[holders.length-1];
            holders.length--;
            break;
          }
        }
        emit HolderRemoved(_holderAddress);
    }

    ///@notice Allows shareholder to withdrw his revenue
     ///@dev Also calles removeHolder if holder's balance
    function withdraw() public {
        require(holdersRevenue[msg.sender] > 0, "No revenue to withdraw");
        uint256 holderRevenueToWithdraw = holdersRevenue[msg.sender];
        holdersRevenue[msg.sender] = 0;
        if(balanceOf(msg.sender) == 0){
            removeHolder(msg.sender);
        }
        address(msg.sender).transfer(holderRevenueToWithdraw);
        emit RevenueWithdrawal(msg.sender, holderRevenueToWithdraw);
    }

    ///@notice Prevents execution when circuit is paused by owner
    modifier checkIfPaused(){
        require(!paused, 'This action is paused by owner');
        _;
    }

    ///@notice Prevents execution if sender is not a shareholder
    modifier onlyShareHolder(){
        require(balanceOf(msg.sender) > 0, "Only shareholders can perform this action");
        _;
    }

}