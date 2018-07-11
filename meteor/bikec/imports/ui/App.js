import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

import Bike from './Bike.js';

import { UiState } from './ui-state.js';

import { isUndefined, isDefined } from "../api/tools";
import { findField } from "../api/frames";

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
                             getItems={() => findField({},'brand')}
                             setSelected={(item) => uiState.setBrand(item)}/>
                <DownshiftBike field={'model'}
                             getItems={() => findField({brand:uiState.getBrand()},'model')}
                             setSelected={(item) => uiState.setModel(item)}/>
                <DownshiftBike field={'size'}
                             getItems={() => findField({brand:uiState.getBrand(), model:uiState.getModel()},'size')}
                             setSelected={(item) => uiState.setSize(item)}/>
                <DownshiftBike field={'year'}
                             getItems={() => findField({brand:uiState.getBrand(), model:uiState.getModel(), size:uiState.getSize()},'year')}
                             setSelected={(item) => uiState.setYear(item)}/>

                <br/>
                <button onClick={() => Meteor.call('frames.find',
                    uiState.getBrand(),
                    uiState.getModel(),
                    uiState.getSize(),
                    uiState.getYear())}>Run Comparator</button>

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

export default AppContainer = withTracker(() => {
    const top_frames = Session.get('top_frames');
    const top_frames_exists = !!top_frames;
    const nb_element = 10;

    return {
        selected_bike: Session.get('user_frame'),
        top_bikes: top_frames_exists ? top_frames.slice(0, nb_element) : [],

    };
})(App);