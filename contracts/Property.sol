pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


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
    
    constructor(uint _id, string memory _address, string memory _description, uint _price, uint _supply, address _owner) public {
        transferOwnership(_owner);
        holders.push(_owner);
        propertyRevenue = 0;
        propertyInfo = PropertyInfo(_id, _address, _description, _price);
        _mint(_owner, _supply);
    }
    
    function () external payable {
       propertyRevenue += msg.value;
    }

    function circuitBreaker() public onlyOwner(){
        if(paused){
            paused = false;
        } else {
            paused = true;
        }
    }
   
    function getHolders() public view returns(address[] memory) {
        return holders;
    }
    
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
        
        if(balanceOf(_from) == 0){
            removeHolder(_from);
        }
        emit ShareBought(_from, msg.sender, _amount);
    }
    
    function setMySharesForSale() public{
        holdersSelling[msg.sender] = true;
        emit HolderStatusChanged(msg.sender, true);
    }
    
    function setMySharesNotForSale() public{
        holdersSelling[msg.sender] = false;
        emit HolderStatusChanged(msg.sender, false);
    }
    
    function distributeRevenue() public onlyOwner(){
        require(propertyRevenue > 0, "No revenue to distribute");
        for (uint i = 0; i < holders.length; i++){
            uint holdersRevenueShare = (propertyRevenue/totalSupply()) * balanceOf(holders[i]);
            holdersRevenue[holders[i]] += holdersRevenueShare;
        }
        propertyRevenue = 0;
        emit RevenueDistributed();
    }
    
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
    
    function withdraw() public {
        require(holdersRevenue[msg.sender] > 0, "No revenue to withdraw");
        uint256 holderRevenueToWithdraw = holdersRevenue[msg.sender];
        holdersRevenue[msg.sender] = 0;
        address(msg.sender).transfer(holderRevenueToWithdraw);
        emit RevenueWithdrawal(msg.sender, holderRevenueToWithdraw);
    }
    
    modifier checkIfPaused(){
        require(!paused, 'This action is paused by owner');
        _;
    }

}