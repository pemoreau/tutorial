import { Template } from 'meteor/templating';
//import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Frames } from '../imports/api/frames.js';


import './main.html';

// client code goes here
Template.selection.helpers({
    // find: function(field) {
    //     var res = Frames.find({}).fetch();
    //     return res.map(function(entry) {return entry[field];});
    // },

    brands: function() {
        //var res = Frames.find({}, {brand:1, _id:0}).fetch();
        var res = Frames.find({}).fetch();
        res = res.map(function(a) {return a.brand;});

        var set = new Set(res)
        res = [...set]

        console.log("brands: " + res);

        return res;
    },

    models: function() {
        var res = Frames.find({ brand:Session.get("selectedBrand") }).fetch();
        res = res.map(function(a) {return a.model;});
        var set = new Set(res)
        res = [...set]
        //console.log("models: " + res);
        return res;
    },

    sizes: function() {
        //return ["S", "M", "L", "XL"]
        var res = Frames.find({ brand:Session.get("selectedBrand"), model:Session.get("selectedModel") }).fetch();
        res = res.map(function(a) {return a.size;});
        var set = new Set(res)
        res = [...set]
        //console.log("models: " + res);
        return res;
    },

    years: function() {
        //return ["2015", "2016", "2017", "2018"]
        var res = Frames.find({ brand:Session.get("selectedBrand"), model:Session.get("selectedModel"),
                                size:Session.get("selectedSize") }).fetch();
        res = res.map(function(a) {return a.year;});
        var set = new Set(res)
        res = [...set]
        //console.log("models: " + res);
        return res;
    },

});

Template.selection.events({
    "change #brand-select": function (event, template) {
        var selected = event.target.value;
        console.log("selectedBrand: " + selected);
        Session.set("selectedBrand", selected);
    },
    "change #model-select": function (event, template) {
        var selected = event.target.value;
        console.log("selectedModel: " + selected);
        Session.set("selectedModel", selected);
    },
    "change #size-select": function (event, template) {
        var selected = event.target.value;
        console.log("selectedSize: " + selected);
        Session.set("selectedSize", selected);
    },
    "change #year-select": function (event, template) {
        var selected = event.target.value;
        console.log("selectedYear: " + selected);
        Session.set("selectedYear", selected);
    },
});

Template.run.helpers({

});

Template.run.events({
    'click #run': function(e, tpl){
        console.log('run comparator...');

        Meteor.call('frames.find',
            Session.get("selectedBrand"),
            Session.get("selectedModel"),
            Session.get("selectedSize"),
            Session.get("selectedYear"));

    },

});