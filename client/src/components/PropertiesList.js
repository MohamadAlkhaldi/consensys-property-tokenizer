import React from "react";
// import Property from "../contracts/Property.json";
import { newContextComponents } from "@drizzle/react-components";
import { drizzleReducers } from "@drizzle/store";
import Property from './Property'
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class PropertiesList extends React.Component {
  state = { getPropertiesKey: null,};

render() {
    const { drizzle, drizzleState } = this.props;
    let propertiesContracts = drizzle.contracts
    return (
        <div>
            {
                   
            Object.keys(propertiesContracts).map(function(key, index) {
                if(key != 'PropertyFactory'){
                    return <Property propertyContractName={key} drizzle={drizzle} drizzleState={drizzleState}/>
                }
            })  

            }
            
        </div>
    )
  }
}