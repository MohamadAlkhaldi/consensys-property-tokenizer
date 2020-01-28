import React from "react";
// import Property from "../contracts/Property.json";
import { newContextComponents } from "@drizzle/react-components";
import { drizzleReducers } from "@drizzle/store";
import Property from './Property'
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class Holder extends React.Component {

render() {
    let holderAddress = this.props.holderAddress
    return (
                <tr>
                    <td>{`${holderAddress.substring(0, 5)}...${holderAddress.substring(38, 42)}`}</td>
                    <td>0.10 ETH</td>
                    <td>0x4fe...581</td>
                    <td>March 28 2019 08:47:17 AM +UTC</td>
                </tr>
            )
  }
}