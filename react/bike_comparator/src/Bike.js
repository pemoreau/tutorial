import React from 'react';

const Bike = ({ bike: { brand, model, size, year }, distance }) => (
    <li>
        {brand} {model} Size {size} {!!year ? ' (' + year + ')' : ''}{' '}
        {distance && ' Score: ' + Math.floor(100 * (1 - distance)) + '%'}
    </li>
);

export default Bike;
