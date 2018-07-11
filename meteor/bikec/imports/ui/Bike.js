import React, { Component } from 'react';
import { isUndefined, isDefined } from '../api/tools.js';

// Bike component - represents a single todo item
export default class Bike extends Component {
    render() {
        function formatBike(brand, model, size, year, distance) {
            return brand
                + ' ' + model
                + ' Size ' + size
                + (!!year ? ' (' + year + ')' : '')
                + (isDefined(distance) && ' Score: ' + Math.floor(100*(1-distance)) +'%');
        }

        return (
            <li>{formatBike(this.props.bike.brand, this.props.bike.model, this.props.bike.size, this.props.bike.year, this.props.distance)}</li>
        );


    }
}

