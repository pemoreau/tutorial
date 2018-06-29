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