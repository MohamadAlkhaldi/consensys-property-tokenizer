import React from "react";
import { Button, Flex, Text, Box, disabled  } from 'rimble-ui';
// import Property from "../contracts/Property.json";
// import { newContextComponents } from "@drizzle/react-components";
// import { drizzleReducers } from "@drizzle/store";
// import Property from './Property'
// const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class Holder extends React.Component {
    constructor (props){
        super(props)
        this.state = { stackId: null, 
            holderSharesBalanceKey: null,
            holderSellingKey: null, 
            holdersRevenueKey: null, 
            contractOwner: null, 
            firstKey: null}
        this.handleToggleForSale = this.handleToggleForSale.bind(this)
        this.handleBuyButton = this.handleBuyButton.bind(this)
    }

    componentDidMount(){
        const { drizzle, drizzleState, holderAddress, propertyContractName } = this.props

        const contract = drizzle.contracts[propertyContractName]

        //Getting previously cached property's contract's owner without callling contract
        const ownerCachedObject = drizzleState.contracts[propertyContractName].owner
        let firstKey = Object.keys( ownerCachedObject )[0];
        const contractOwner = ownerCachedObject[firstKey].value

        const holderSharesBalanceKey = contract.methods['balanceOf'].cacheCall(holderAddress)
        const holderSellingKey = contract.methods['holdersSelling'].cacheCall(holderAddress)
        const holdersRevenueKey = contract.methods['holdersRevenue'].cacheCall(holderAddress)

        this.setState({
            holderSharesBalanceKey,
            holderSellingKey, 
            holdersRevenueKey, 
            contractOwner,
            firstKey
        })
    }

    handleToggleForSale (){
        const { drizzle, drizzleState, holderAddress, propertyContractName } = this.props
        const contract = drizzle.contracts[propertyContractName]

        // console.log(contract.methods)
        let stackId

        if(drizzleState.contracts[propertyContractName].holdersSelling[this.state.holderSellingKey].value){
            stackId = contract.methods['setMySharesNotForSale'].cacheSend({from: holderAddress})
        } else {
            stackId = contract.methods['setMySharesForSale'].cacheSend({from: holderAddress})
        }
        this.setState({stackId})
    }

    handleBuyButton (){
        const { drizzle, drizzleState, holderAddress, propertyContractName, activeAccount } = this.props

        const contract = drizzle.contracts[propertyContractName]

        let propertyInfo = drizzleState.contracts[this.props.propertyContractName].propertyInfo[this.state.firstKey]
        let supply = drizzleState.contracts[this.props.propertyContractName].totalSupply[this.state.firstKey]

        let stackId

        const numberOfShares = Number(window.prompt("Type number of shares", "1"));
        
        if(numberOfShares){
            let value = propertyInfo.value.price / supply.value
            let price = numberOfShares * value
            // console
            stackId = contract.methods['buyShare'].cacheSend(holderAddress, numberOfShares, {from: activeAccount, value: price, gasLimit: 3000000})
            this.setState({stackId})
        }


    }

    render() {
        const {drizzleState, drizzle, propertyContractName, activeAccount} = this.props
        const contract = drizzleState.contracts[propertyContractName]
        const { contractOwner } = this.state
        let holderAddress = this.props.holderAddress
        let holderSharesBalance = contract.balanceOf[this.state.holderSharesBalanceKey]
        let holderSelling = contract.holdersSelling[this.state.holderSellingKey]
        let holdersRevenue = contract.holdersRevenue[this.state.holdersRevenueKey]
        // let owner = drizzleState.contracts[propertyContractName].owner[this.state.ownerKey]
        // console.log(holderSharesBalance)
        
        return (
                    <tr>
                        <td style={contractOwner == holderAddress ? {'color':'green'} : null}>{`${holderAddress.substring(0, 5)}...${holderAddress.substring(38, 42)}`}</td>
                        <td>{holderSharesBalance ? holderSharesBalance.value : null}</td>
                        <td>{holdersRevenue ? `${drizzle.web3.utils.fromWei(holdersRevenue.value, 'ether')} ETH` : null}</td>
                        <td>
                            {holderSelling ? `${holderSelling.value}` : null}
                            {
                                holderAddress.toLowerCase() == activeAccount ?
                                <Button.Outline onClick={this.handleToggleForSale} size="small" mr={3} icon="Edit" icononly />
                                : null
                            }
                        </td>
                        <td>{holdersRevenue ? holdersRevenue.value : null}</td>
                        <td>
                            <Button.Outline 
                                onClick={this.handleBuyButton} size="small" mr={3} icon="Edit" icononly 
                                disabled={holderAddress.toLowerCase() == activeAccount ? true : false}
                            />
                        </td>
                    </tr>
                )
    }
}