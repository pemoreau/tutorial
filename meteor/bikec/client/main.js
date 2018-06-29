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
        //res = res.map(function(a) {return a["brand"];});

        // Meteor.call('frames.find', 'brand', function(error, result) {
        //     if(error){
        //         alert(‘Error’);
        //     }else{
        //         Session.set('brandlist', result);
        //     }
        // });
        //
        // var res = Session.get('brandlist');
        console.log("brands: " + res);

        return res;
    },

    models: function() {
        var b = Session.get("selectedBrand")
        var res = Frames.find({ brand:b }).fetch();
        res = res.map(function(a) {return a.model;});
        var set = new Set(res)
        res = [...set]
        //console.log("models: " + res);
        return res;
    },


    // models: function() {
    //     return ["m1", "m2", "m3"]
    // },

    sizes: function() {
        //return ["S", "M", "L", "XL"]
        var b = Session.get("selectedModel")
        var res = Frames.find({ model:b }).fetch();
        res = res.map(function(a) {return a.size;});
        var set = new Set(res)
        res = [...set]
        //console.log("models: " + res);
        return res;
    },
    years: function() {
        //return ["2015", "2016", "2017", "2018"]
        var b = Session.get("selectedSize")
        var res = Frames.find({ size:b }).fetch();
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