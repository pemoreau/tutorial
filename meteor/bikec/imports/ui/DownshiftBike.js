import React, { Component } from 'react'
import Downshift from 'downshift';

export default class SelectBrand extends Component {
    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            // currently selected dropdown item
            selectedItem: ''
        };

        // This binding is necessary to make `this` work in the callback
        this.onChange = this.onChange.bind(this);
    }

    getItems() {
        // WARNING : getItems is called very often
        // if(this.items.length === 0) {
            this.items = this.props.getItems();
        // }
        return this.items;
    }

    onChange(selectedItem) {
        this.setState({ selectedItem: selectedItem });
        this.props.setSelected(selectedItem);
    }

    render() {
        return (
            <Downshift onChange={this.onChange} selectedItem={this.state.selectedItem} itemToString={i => (i ? i : '')}>
                {/*// pass the downshift props into a callback*/}
                {({ isOpen, getToggleButtonProps, getItemProps, highlightedIndex, selectedItem: dsSelectedItem, getLabelProps }) => (
                    <div>
                        {/*// add a label tag and pass our label text to the getLabelProps function*/}
                        <label style={{ marginTop: '1rem', display: 'block' }} {...getLabelProps()}>Select a {this.props.field}</label>
                        {/*// add a button for our dropdown and pass the selected book as its content if there's a selected item*/}
                        <button className="dropdown-button" {...getToggleButtonProps()}>
                            {this.state.selectedItem !== '' ? this.state.selectedItem : 'Select a ' + this.props.field + ' ...'}
                        </button>
                        <div style={{ position: 'relative' }}>
                            {/*// if the input element is open, render the div else render nothing*/}
                            {isOpen ? (
                                <div className="downshift-dropdown">
                                    {
                                        // map through all the items and render them
                                        this.getItems().map((item, index) => (
                                            <div
                                                className="dropdown-item"
                                                {...getItemProps({ key: index, index, item })}
                                                style={{
                                                    backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                                    fontWeight: dsSelectedItem === item ? 'bold' : 'normal',
                                                }}>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </Downshift>
        );
    }
}

