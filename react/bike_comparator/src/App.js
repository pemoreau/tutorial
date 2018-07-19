import React, { Component } from 'react';
import DownshiftBike from './DownshiftBike';
import Bike from './Bike';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], // contains the database
      isLoading: false,
      error: null,

      tree: {},
      // tree has the following form:
      // tree: {
      //     'Time': { 'NXR': { 'XS': {'2011':id1, '2010':id2},
      //                        'S': {'2011':id3} },
      //               'Skylon': { 'XS': {2015:id4},
      //                           'S': {2015:id5} },
      //     },
      // },

      selectedBrand: null,
      selectedModel: null,
      selectedSize: null,
      selectedYear: null,
      selectedBike: null,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  initTree = function() {
    for (var elem of this.state.data) {
      const { brand, model, size, year, _id } = elem;
      if (!this.state.tree[brand]) {
        this.setState((this.state.tree[brand] = {}));
      }
      if (!this.state.tree[brand][model]) {
        this.state.tree[brand][model] = {};
      }
      if (!this.state.tree[brand][model][size]) {
        this.state.tree[brand][model][size] = {};
      }
      if (!this.state.tree[brand][model][size][year]) {
        this.state.tree[brand][model][size][year] = _id;
      }
      // console.log(brand,model,size,year,_id);
    }
    // console.log(this.state.tree['Time']);
  };

  getId = function() {
    const {
      selectedBrand,
      selectedModel,
      selectedSize,
      selectedYear,
    } = this.state;
    return selectedBrand && selectedModel && selectedSize && selectedYear
      ? Object.keys(
          this.state.tree[selectedBrand][selectedModel][selectedSize][
            selectedYear
          ]
        )
      : [];
  };

  // initBrands = function() {
  //     if(this.state.brands.length === 0) {
  //         const brands = this.state.data.map((x) => x.brand);
  //         this.setState({brands: _.uniq(brands)});
  //     }
  //     console.log('#brands:', this.state.brands.length);
  // }

  // initModels = function() {
  //     if(this.state.brands.length === 0) {
  //         const brands = this.state.data.map((x) => x.brand);
  //         this.setState({brands: _.uniq(brands)});
  //     }
  //     console.log('#brands:', this.state.brands.length);
  // }

  componentDidMount() {
    this.setState({ isLoading: true });

    // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // const targetUrl = 'http://localhost:8080/models/Time';
    const targetUrl = 'http://localhost:8080/all';
    const headers = new Headers();
    const options = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default',
    };

    fetch(targetUrl, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data: data, isLoading: false }))
      .then(() => {
        this.initTree();
      })
      .catch(error => console.log('Request failed', error));
  }

  render() {
    const {
      tree,
      selectedBrand,
      selectedModel,
      selectedSize,
      selectedYear,
      selectedBike,
    } = this.state;
    return (
      <div className="container">
        <header>
          <h1>Welcome to Bike Comparator!</h1>
        </header>
        <h3>This web site will help you to find a bike similar to yours!</h3>

        <h3>Select your bike</h3>
        <DownshiftBike
          field="brand"
          getItems={() => Object.keys(tree)}
          setSelected={item => this.setState({ selectedBrand: item })}
        />
        <DownshiftBike
          field={'model'}
          getItems={() =>
            selectedBrand ? Object.keys(tree[selectedBrand]) : []
          }
          setSelected={item => this.setState({ selectedModel: item })}
        />
        <DownshiftBike
          field={'size'}
          getItems={() =>
            selectedBrand && selectedModel
              ? Object.keys(tree[selectedBrand][selectedModel])
              : []
          }
          setSelected={item => this.setState({ selectedSize: item })}
        />
        <DownshiftBike
          field={'year'}
          getItems={() =>
            selectedBrand && selectedModel && selectedSize
              ? Object.keys(tree[selectedBrand][selectedModel][selectedSize])
              : []
          }
          setSelected={item => this.setState({ selectedYear: item })}
        />

        <br />
        <button
          disabled={
            !(selectedBrand && selectedModel && selectedSize && selectedYear)
          }
          onClick={() => true}
        >
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
