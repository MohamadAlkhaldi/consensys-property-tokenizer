import React from "react";
import Holder from './Holder';

export default class HoldersList extends React.Component {

render() {
    const {drizzle, drizzleState, propertyContractName} = this.props
    return (
        this.props.holdersList.value.map((value, index) => {
            return (
                <Holder 
                    holderAddress={value} 
                    propertyContractName={propertyContractName} 
                    drizzle={drizzle} 
                    drizzleState={drizzleState}
                />
            )
        })
    )
  }
}