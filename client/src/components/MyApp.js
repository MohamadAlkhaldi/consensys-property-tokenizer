import React from "react";
import CreateProperty from './CreateProperty'
import PropertiesList from './PropertiesList'

export default class MyApp extends React.Component {
  state = { getPropertiesKey: null };

//   componentDidMount= async () => {
//     const { drizzle } = this.props;
//     const contract = drizzle.contracts.PropertyFactory;
//     const getPropertiesKey = contract.methods["getProperties"].cacheCall();
//     this.setState({ getPropertiesKey })
// }


 

render() {
    const { drizzle , drizzleState } = this.props;
    let storedData = drizzleState.contracts.PropertyFactory.getProperties[this.state.getPropertiesKey]
    return (
        <div>
            <CreateProperty
                drizzle = {this.props.drizzle}
                drizzleState = {this.props.drizzleState}
            />
            <PropertiesList 
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
            />
        </div>
    )
  }
}