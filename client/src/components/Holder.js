import React from "react";
// import Property from "../contracts/Property.json";
import { newContextComponents } from "@drizzle/react-components";
import { drizzleReducers } from "@drizzle/store";
import Property from './Property'
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class Holder extends React.Component {
    state = { holderSellingKey: null }

    componentDidMount(){
        const { drizzle, drizzleState, holderAddress, propertyContractName } = this.props

        console.log(this.props)

        // return

        const contract = drizzle.contracts[propertyContractName]

        const holderSellingKey = contract.methods['holdersSelling'].cacheCall(holderAddress)

        this.setState({holderSellingKey})
    }

render() {
    const {drizzleState, propertyContractName} = this.props
    let holderAddress = this.props.holderAddress
    let holderSelling = drizzleState.contracts[propertyContractName].holdersSelling[this.state.holderSellingKey]
    console.log(holderSelling)
    return (
                <tr>
                    <td>{`${holderAddress.substring(0, 5)}...${holderAddress.substring(38, 42)}`}</td>
                    <td>0.10 ETH</td>
                    <td>0x4fe...581</td>
                    <td>{holderSelling ? `${holderSelling.value}` : null}</td>
                </tr>
            )
  }
}