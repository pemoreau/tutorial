import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

import Bike from './Bike.js';

import { UiState } from './ui-state.js';

import { isUndefined, isDefined } from "../api/tools";
import { findField, findFrame } from "../api/frames";

import {Session} from "meteor/session";

import DownshiftBike from "./DownshiftBike";
import {Meteor} from "meteor/meteor";

/**
 * uiState store information of the UI
 * such as selectedItem, selectedModel, etc.
 * @type {UiState}
 */
const uiState = new UiState();

// App component - represents the whole app
class App extends Component {

    render() {

        return (

            <div className="container">
                <header>
                    <h1>Welcome to Bike Comparator!<br/>
                        (React version)</h1>
                </header>
                <h3>This web site will help you to find a bike similar to yours!</h3>

                <h3>Select your bike</h3>
                <DownshiftBike field={'brand'}
                             getItems={() => this.props.brandList}
                             setSelected={(item) => uiState.setBrand(item)}/>
                <DownshiftBike field={'model'}
                             // getItems={() => findField({brand:uiState.getBrand()},'model')}
                             getItems={() => this.props.modelList}
                             setSelected={(item) => uiState.setModel(item)}/>
                <DownshiftBike field={'size'}
                             getItems={() => this.props.sizeList}
                             setSelected={(item) => uiState.setSize(item)}/>
                <DownshiftBike field={'year'}
                             getItems={() => this.props.yearList}
                             setSelected={(item) => uiState.setYear(item)}/>

                <br/>
                <button disabled={!this.props.isSelectedBike} onClick={() => Meteor.call('frames.find', uiState.toJSON())}>Run Comparator</button>

                <h3>Selected bike</h3>
                <ul>
                    {isUndefined(this.props.selected_bike) ?
                        (<li>No selected bike</li>) :
                        (<Bike key={this.props.selected_bike._id} bike={this.props.selected_bike}/>)}
                </ul>

                <h3>Top bikes</h3>
                <ul>
                    {this.props.top_bikes.map((pair) => (
                        <Bike key={pair.frame._id} bike={pair.frame} distance={pair.distance} />
                    ))}
                </ul>

            </div>
        );
    }
}

// App.propTypes = {
//   selected_bike: React.PropTypes.object,
//   top_bikes: React.PropTypes.array,
// };

export default AppContainer = withTracker(() => {
    const top_frames = Session.get('top_frames');
    const top_frames_exists = !!top_frames;
    const nb_element = 10;

    const brand = uiState.getBrand();
    const model = uiState.getModel();
    const size = uiState.getSize();
    const year = uiState.getYear();
    // const isSelectedBike = !!brand && !!model && !!size && !!year;

    // console.log('AppContainer: ' + brand);
    // console.log('AppContainer: ' + model);
    // console.log('AppContainer: ' + size);
    // console.log('AppContainer: ' + year);

    return {
        isSelectedBike: !!brand && !!model && !!size && !!year,
        selected_bike: Session.get('user_frame'),
        top_bikes: top_frames_exists ? top_frames.slice(0, nb_element) : [],
        brandList: findField({},'brand'),
        modelList: !!brand ? findField({brand:brand},'model') : [],
        sizeList: !!brand && !!model ? findField({brand:brand, model:model},'size') : [],
        yearList: !!brand && !!model && !!size ? findField({brand:brand, model:model, size:size},'year') : [],
    };
})(App);