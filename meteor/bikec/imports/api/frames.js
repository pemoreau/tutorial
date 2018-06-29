import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from "meteor/check";

export const Frames = new Mongo.Collection('frames');

// Meteor.methods({
//     'frames.find'(field) {
//         check(field, String);
//         var res = Frames.find({}).fetch();
//         console.log(res);
//         console.log(field);
//         res = res.map(function(entry) {return entry[field];});
//         console.log(res);
//         return ['a','b'];
//     },
//
// });

// TODO:
// detect selection of user's bike (brand,model,size,year)
// compute a list of best bikes in background
// dynamically present this list to client

Meteor.methods({
    'frames.find'(brand,model,size,year) {
        check(brand, String);
        check(model, String);
        check(size, String);
        check(year, String);

        var selectedBike = Frames.find({'brand':brand, 'model':model, 'size':size, 'year':year}).fetch();
        console.log('selectedBike:');
        console.log(selectedBike);

        var bikes = Frames.find({}).fetch();
        //console.log(bikes);
        return ;
    },

});