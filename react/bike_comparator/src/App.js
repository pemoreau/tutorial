import React, { Component } from 'react';
import DownshiftBike from './DownshiftBike';
import Bike from './Bike';

class App extends Component {
    state = {
        brands: [],
        selectedBrand: null,
        models: [],
        selectedModel: null,
        sizes: [],
        selectedSize: null,
        years: [],
        selectedYear: null,
        selectedBike: null,
    };

    getModels = () => {
        const { selectedBrand } = this.state;
    };
    componentWillMount() {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        const options = {
            method: 'GET',
            headers: headers,
        };
        fetch(
            'http://localhost:3001/api/1/databases/frames/collections/frames',
            options,
        ).then(res => console.log(res));
    }

    render() {
        const { brands, models, sizes, years, selectedBike } = this.state;
        return (
            <div className="container">
                <header>
                    <h1>
                        Welcome to Bike Comparator!<br />
                        (React version)
                    </h1>
                </header>
                <h3>
                    This web site will help you to find a bike similar to yours!
                </h3>

                <h3>Select your bike</h3>
                <DownshiftBike
                    field="brand"
                    getItems={() => brands}
                    setSelected={() => true}
                />
                <DownshiftBike
                    field={'model'}
                    getItems={() => models}
                    setSelected={() => true}
                />
                <DownshiftBike
                    field={'size'}
                    getItems={() => sizes}
                    setSelected={() => true}
                />
                <DownshiftBike
                    field={'year'}
                    getItems={() => years}
                    setSelected={() => true}
                />

                <br />
                <button disabled={!selectedBike} onClick={() => true}>
                    Run Comparator
                </button>

                <h3>Selected bike</h3>
                <ul>
                    {selectedBike ? (
                        <Bike key={selectedBike._id} bike={selectedBike} />
                    ) : (
                        <li>No selected bike</li>
                    )}
                </ul>
                {/*
              <h3>Top bikes</h3>
              <ul>
                  {this.props.top_bikes.map((pair) => (
                      <Bike key={pair.frame._id} bike={pair.frame} distance={pair.distance} />
                  ))}
              </ul>
                */}
            </div>
        );
    }
}

export default App;
