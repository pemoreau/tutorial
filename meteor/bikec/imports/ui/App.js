import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';
import { Frames } from '../api/frames.js';

import Bike from './Bike.js';
import {isUndefined} from "../api/tools";
import {Session} from "meteor/session";

// App component - represents the whole app
class App extends Component {

    // getBikes() {
    //     return [
    //         { _id: 1, brand: 'This is task 1' },
    //         { _id: 2, brand: 'This is task 2' },
    //         { _id: 3, brand: 'This is task 3' },
    //     ];
    // }

    renderSelectedBike() {
        if (isUndefined(this.props.selected_bike)) {
            return (
                <li>No selected bike</li>
            );
        } else {
            return (
                <Bike key={this.props.selected_bike._id} bike={this.props.selected_bike}/>
            );
        }
    }

    renderBikes() {
        return this.props.top_bikes.map((b) => (
            <Bike key={b._id} bike={b} />
        ));
    }

    renderTopBikes() {
        return this.props.top_bikes.map((pair) => (
            <Bike key={pair.frame._id} bike={pair.frame} distance={pair.distance} />
        ));
    }

    render() {
        return (

            <div className="container">
                <header>
                    <h1>Welcome to Bike Comparator!<br/>
                        (React version)</h1>
                </header>
                <h3>This web site will help you to find a bike similar to yours!</h3>

                <h3>Select your bike</h3>

                <h3>Selected bike</h3>
                <ul>
                    {this.renderSelectedBike()}
                </ul>

                <h3>Top bikes</h3>
                <ul>
                    {/*{this.renderBikes()}*/}
                    {this.renderTopBikes()}
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
        // top_bikes: top_frames_exists ? top_frames.slice(0, nb_element).map((pair) => (pair.frame)) : [],
        top_bikes: top_frames_exists ? top_frames.slice(0, nb_element) : [],

        // top_bikes: [
        //     { _id: 1, brand: 'This is task 1' },
        //     { _id: 2, brand: 'This is task 2' },
        // ],
    };
})(App);