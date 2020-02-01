# Design Patterns Decisions

## Withdrawal Pattern
If a buyer happens to be a contract, sending ETH to it will call its fallback function, this can be easily abused by malicious parties. 
Let's take an example from our Property.sol smart contract. At the distribute function, owner could directly iterate and send ETH to shareholders using transfer method, but if an non-expected revert happened for any reason, deliberate or accidental, contract might stop execution before paying all shareholders, that's why we use the withdrawal pattern, where sending ETH happens individually and on demand only, pull payment system.

## Factory Contract
As a portal for assets tokenization, we use a factory contract PropertyFactory.sol to create and deploy our children contracts Property.sol, which will represent our asset to be tokenized. We also use our factory contract to keep track of all children contracts properties[].

## Circuit Breaker
After smart contracts deployment on a public blockchain, change can be difficult and take time, which can be very expensive in some cases of emergency, so we implement the circuit breaker design pattern to enable the owner of the property contract to prevent new customers from buying shares when needed. However, owner can't and shouldn't be able to prevent other shareholders from withdrawing their revenue.