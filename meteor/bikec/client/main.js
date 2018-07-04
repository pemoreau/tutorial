import { Template } from 'meteor/templating';
import { Frames } from '../imports/api/frames.js';
import { UiState} from '../imports/ui/ui-state.js';

import './main.html';

/**
 * keys is a list of key:value
 * select keys in Frames and project on field
 * returns a list of unique values
 * example: findField({ brand:'Time' }, 'model')
 * returns a list of 'model' (each model appears only once) for the brand 'Time'
 */
var findField = function(keys,field) {
    //console.log("findField keys=" + keys + " field=" + field);

    var res = Frames.find(keys).fetch();
    res = res.map(function(entry) {return entry[field];});
    var set = new Set(res);
    return [...set];
};

/**
 * uiState store information of the UI
 * such as selectedBrand, selectedModel, etc.
 * @type {UiState}
 */
var uiState = new UiState();

// client code goes here
Template.selection.helpers({

    brands: function() {
        var res = findField({},'brand');
        //console.log("brands: " + res);
        return res;
    },

    models: function() {

        var res = findField({ brand:uiState.getBrand() }, 'model');
        //console.log("models: " + res);
        return res;
    },

    sizes: function() {
        var res = findField({ brand:uiState.getBrand(),
                              model:uiState.getModel() }, 'size');
        // //console.log("models: " + res);
        return res;
    },

    years: function() {
        var res = findField({ brand:uiState.getBrand(),
                              model:uiState.getModel(),
                              size:uiState.getSize() }, 'year');
        //console.log("models: " + res);
        return res;
    },

});

Template.selection.events({
    "change #brand-select": function (event, template) {
        var selected = event.target.value;
        uiState.setBrand(selected);
        console.log("selectedBrand: " + uiState.getBrand());
    },
    "change #model-select": function (event, template) {
        var selected = event.target.value;
        uiState.setModel(selected);
        console.log("selectedModel: " + uiState.getModel());
    },
    "change #size-select": function (event, template) {
        var selected = event.target.value;
        uiState.setSize(selected);
        console.log("selectedSize: " + uiState.getSize());
    },
    "change #year-select": function (event, template) {
        var selected = event.target.value;
        uiState.setYear(selected);
        console.log("selectedYear: " + uiState.getYear());
    },
});

Template.run.helpers({

});

Template.run.events({
    'click #run': function(e, tpl){
        console.log('run comparator...');

        // for debugging
        console.log(uiState.getBrand(),
            uiState.getModel(),
            uiState.getSize(),
            uiState.getYear());

        if(uiState.getBrand() == undefined && uiState.getModel() == undefined && uiState.getSize() == undefined && uiState.getYear() == undefined) {
            uiState.setBrand('Time');
            uiState.setModel('NXR');
            uiState.setSize('M');
            uiState.setYear('2011');
        }

        Meteor.call('frames.find',
            uiState.getBrand(),
            uiState.getModel(),
            uiState.getSize(),
            uiState.getYear());

    },

});