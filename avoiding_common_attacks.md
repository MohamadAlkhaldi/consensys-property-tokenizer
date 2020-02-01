# Avoiding Common Attacks

## Integer overflows/underflows
I'm avoiding integer overflows/underflows by using OpenZeppelin’s SafeMath library. Check Property.sol contract.

## DoS with (Unexpected) revert
By setting up a pull payment system. Check withdraw at Property.sol contract.

## Reentrancy on a Single Function
By changing state before sending ETH. Check withdraw at Property.sol contract.

## Race conditions and cross-function state dependency
This attack could've occured by leveraging two functions, buyShare at Property.sol and _transfer at ERC20, this prevented at _transfer as the sender balance is reduced before receiver balance increased.

