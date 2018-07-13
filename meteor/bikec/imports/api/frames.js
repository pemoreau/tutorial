import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from "meteor/check";
import { Session } from 'meteor/session';

import {point_distance, degre_to_alpha, radian_to_degre, check_equality, isUndefined, isDefined, float2} from './tools.js';
export { Frames, findField, findFrame };

import { uniq } from 'lodash';

// Load the full build.
const _ = require('lodash');

const Frames = new Mongo.Collection('frames');

/**
 * keys is a list of key:value
 * select keys in Frames and project on field
 * returns a list of unique values
 * example: findField({ brand:'Time' }, 'model')
 * returns a list of 'model' (each model appears only once) for the brand 'Time'
 */
const findField = function(keys,field) {
    const res = Frames.find(keys).map(function(entry) {return entry[field];});
    return _.uniq(res);
};

const findFrame = function(brand,model,size,year) {
    return Frames.findOne({'brand': brand, 'model': model, 'size': size, 'year': year});
};


const convert_field = function(field) {
    if(field === 'None' || isUndefined(field)) {
        return undefined;
    } else {
        const v = parseFloat(field);
        if (!isNaN(v)) {
            return v;
        }
    }
    return field;
};

export class Frame {
    constructor(o) {
        //this.brand = o.brand;
        for (const field in o) {
            if (o.hasOwnProperty(field)) {
                this[field] = convert_field(o[field]);
                //console.log("Key is " + field + ", value is " + o[field]);
            }
        }

        if(isDefined(this.head_tube_angle)) {
            this.head_tube_angle = 180.0 - this.head_tube_angle;
        }
        if(isDefined(this.seat_tube_angle)) {
            this.seat_tube_angle = 180.0 - this.seat_tube_angle;
        }
        if(isUndefined(this.crank_length)) {
            this.crank_length = 17.25; // 172.5mm
        }

        // extra data
        this.wheel_circumference = 211.0;
        this.wheel_diameter = this.wheel_circumference / Math.PI;
        this.wheel_radius = this.wheel_diameter / 2;
        this.stem_length = 10.0;
        this.stem_angle = 80.0;  // degres
        this.stem_spacer = 3.5;  // total heigth of spacers
        this.stem_height = 4.5;
        this.handlebar_diameter = 2.54;
        // steer_tube_diameter

        this.o_x = 0.0;
        this.o_y = 0.0;

        this.saddle_height = undefined;
        this.saddle_fore_aft = undefined;

    }

    check_equality(name1, v1, name2, v2, threshold) {
        return Math.abs(v1 - v2) / Math.max(v1, v2) <= threshold;
    }

    geometry_to_string() {
        return ''
            + this.brand + ', ' +
            // + this.model + ', ' +
            + this.size + ', ' +
            // + this.year + ', ' +
            // + this.virtual_seat_tube + ', ' +
            // + this.virtual_top_tube + ', ' +
            // + this.seat_tube + ', ' +
            // + this.top_tube + ', ' +
            // + 180.0 - this.head_tube_angle + ', ' +
            // + 180.0 - this.seat_tube_angle + ', ' +
            // + this.head_tube_angle + ', ' +
            // + this.chain_stay_length + ', ' +
            // + this.front_center + ', ' +
            // + this.wheelbase + ', ' +
            // + this.bottom_bracket_drop + ', ' +
            // + this.bracket_height + ', ' +
            // + this.stack + ', ' +
            // + this.reach + ', ' +
            // + this.crank_length;
'';
    }

    display() {
        console.log('%s %s size %s:', this.brand, this.model, this.size);

        console.log("stack/reach = %f mean = %f stack/reach normalised = %f/10.0 ",
            float2(this.ratio_stack_reach), float2(this.ratio_stack_reach_moy), float2(this.ratio_stack_reach_normal));

        console.log("saddle height /ground = %f head set/ground = %f",
            float2(this.saddle_y + this.bracket_height), float2(this.stem_base_y + this.bracket_height));

        console.log("drop = %f", float2(this.drop));

        const dsd = point_distance(this.saddle_x, this.saddle_y, this.stem_base_x, this.stem_base_y);

        console.log("distance saddle-head set = %f", float2(dsd));

        console.log("wheelbase = %f fork_rate = %f", float2(this.wheelbase), float2(this.fork_rate));

        console.log("dsd/drop = %f mean = %f dsd/drop normalised = %f/10.0 ",
            float2(this.ratio_dsd_drop), float2(this.ratio_dsd_drop_moy), float2(this.ratio_dsd_drop_normal));

        console.log("dsd/hs   = %f mean = %f dsd/hs   normalised = %f/10.0 ",
            float2(this.ratio_dsd_saddle_height), float2(this.ratio_dsd_saddle_height_moy), float2(this.ratio_dsd_saddle_height_normal));

        const dst = this.saddle_x - this.saddle_seat_tube_x;
        if (dst >= 0) {
            console.log("creux de selle avancé de %fcm par ratio à l'axe du tube de selle", float2(dst));
        } else {
            console.log("creux de selle reculé de %fcm par ratio à l'axe du tube de selle", float2(-dst));
            console.log("hauteur pedalier = %f difference pedalier - axe roue = %f", float2(this.bracket_height), float2(this.bottom_bracket_drop));
        }
    }

    /**
     * compute a normal form for a bike
     * @param saddle_height
     * @param saddle_fore_aft
     */
    compute_geometry(saddle_height, saddle_fore_aft) {
        this.saddle_height = saddle_height;
        this.saddle_fore_aft = saddle_fore_aft;

        // compute bracket_height : wheel_radius = bracket_height + bottom_bracket_drop
        if (isDefined(this.bracket_height) && isDefined(this.bottom_bracket_drop)) {
            if (! this.check_equality(
                'wheel diameter', this.wheel_diameter,
                'computed wheel diameter', 2 * (this.bracket_height + this.bottom_bracket_drop),
                0.03)) {
                console.log('bracket_height and bottom_bracket_drop are not compatible');
                console.log(this);
            }
        } else if (isDefined(this.bracket_height)) {
            this.bottom_bracket_drop = this.wheel_radius - this.bracket_height;

        } else if (isDefined(this.bottom_bracket_drop)) {
            this.bracket_height = this.wheel_radius - this.bottom_bracket_drop;

        } else {
            console.log("cannot compute geometry");
            console.log("please give at least bracket_height or bottom_bracket_drop");
        }

        // here, bracket_height, bottom_bracket_drop and wheel_radius are known

        //     center of rear wheel
        //     distance between wheel axle  - crank axle, at crank's level
        this.rear_wheel_x = this.o_x - Math.sqrt(this.chain_stay_length ** 2 - (this.wheel_radius - this.bracket_height) ** 2);
        this.rear_wheel_y = this.wheel_radius - this.bracket_height;

        // compute the position of the head set
        if (isDefined(this.reach) && isDefined(this.stack)) {
            // case: we know reach and stack
            // stem base
            this.stem_base_x = this.o_x + this.reach;
            this.stem_base_y = this.o_y + this.stack;

            // tube horizontal base
            this.horizontal_tube_base_x = this.stem_base_x - 4.25 * Math.cos(degre_to_alpha(this.head_tube_angle));
            this.horizontal_tube_base_y = this.stem_base_y - 4.25 * Math.sin(degre_to_alpha(this.head_tube_angle));

            // we deduce virtual_seat_tube and virtual_top_tube
            this.virtual_heel_height = (this.horizontal_tube_base_y - this.o_y) * Math.sin(degre_to_alpha(this.seat_tube_angle));
            this.virtual_seat_tube_x = this.o_x + this.virtual_heel_height * Math.cos(degre_to_alpha(this.seat_tube_angle));
            this.virtual_seat_tube_y = this.horizontal_tube_base_y;
            this.virtual_top_tube = this.horizontal_tube_base_x - this.virtual_seat_tube_x;

            //this.stack = this.stem_base_y - this.o_y
            //this.reach = this.stem_base_x - this.o_x
        } else if (isDefined(this.virtual_seat_tube) && isDefined(this.virtual_top_tube)) {
            // case: we know virtual_seat_tube and virtual_top_tube

            // virtual point where the tube would be really horizontal
            this.virtual_seat_tube_x = this.o_x + this.virtual_seat_tube * Math.cos(degre_to_alpha(this.seat_tube_angle));
            this.virtual_seat_tube_y = this.o_y + this.virtual_seat_tube * Math.sin(degre_to_alpha(this.seat_tube_angle));

            //  horizontal tube base
            this.horizontal_tube_base_x = this.virtual_seat_tube_x + this.virtual_top_tube;
            this.horizontal_tube_base_y = this.virtual_seat_tube_y;

            // stem base
            this.stem_base_x = this.horizontal_tube_base_x + 3.77 * Math.cos(degre_to_alpha(this.head_tube_angle));
            this.stem_base_y = this.horizontal_tube_base_y + 3.77 * Math.sin(degre_to_alpha(this.head_tube_angle));

            // we deduce stack and reach
            this.stack = this.stem_base_y - this.o_y;
            this.reach = this.stem_base_x - this.o_x;

            //console.log("BTHy = %.2f stem_base_y = %.2f stack = %.2f" % (this.horizontal_tube_base_y, this.stem_base_y, this.stack))
        } else {
            console.log("cannot compute head set position");
            console.log("please give reach/stack or horizontal tube length and virtual seat tube height");
        }

        // fork base 
        this.fork_base_x = this.stem_base_x - this.head_tube_length * Math.cos(degre_to_alpha(this.head_tube_angle));
        this.fork_base_y = this.stem_base_y - this.head_tube_length * Math.sin(degre_to_alpha(this.head_tube_angle))
        ;
        // compute wheelbase: front_center**2 = bottom_bracket_drop**2 + ( wheelbase - chain_stay_length*cos(asin(bottom_bracket_drop/chain_stay_length)) )**2
        if (isDefined(this.wheelbase) && isDefined(this.front_center)) {
            const computed_wheelbase = Math.sqrt(this.front_center ** 2 - this.bottom_bracket_drop ** 2) +
                this.chain_stay_length * Math.cos(Math.asin(this.bottom_bracket_drop / this.chain_stay_length));
            if (!this.check_equality('wheelbase', this.wheelbase, 'computed_wheelbase', computed_wheelbase, 0.01)) {
                console.log("front center and wheelbase are not compatible");
            }
        } else if (isDefined(this.front_center)) {
            this.wheelbase = Math.sqrt(this.front_center ** 2 - this.bottom_bracket_drop ** 2) + this.chain_stay_length * Math.cos(
                Math.asin(this.bottom_bracket_drop / this.chain_stay_length));
        } else if (isDefined(this.wheelbase)) {
            this.front_center = Math.sqrt(
                this.bottom_bracket_drop ** 2 + (this.wheelbase - this.chain_stay_length * Math.cos(Math.asin(this.bottom_bracket_drop / this.chain_stay_length))) ** 2);
        } else if (isDefined(this.fork_rate)) {
            /*
            Equations
            virtual_front_wheel_x = BFx - l * Math.cos(degre_to_alpha(head_tube_angle))
            virtual_front_wheel_y = BFy - l * Math.sin(degre_to_alpha(head_tube_angle))
            virtual_front_wheel_y === rr - bracket_height
            virtual_front_wheel_x + this.fork_rate = RAVx
            */

            let virtual_front_wheel_y = this.wheel_radius - this.bracket_height;
            let l = -(virtual_front_wheel_y - this.fork_base_y) / Math.sin(degre_to_alpha(this.head_tube_angle));
            let virtual_front_wheel_x = this.fork_base_x - l * Math.cos(degre_to_alpha(this.head_tube_angle));
            this.front_wheel_x = virtual_front_wheel_x + this.fork_rate;
            this.front_wheel_y = virtual_front_wheel_y;
            this.wheelbase = this.front_wheel_x - this.rear_wheel_x;
            this.front_center = Math.sqrt(
                this.bottom_bracket_drop ** 2 + (this.wheelbase - this.chain_stay_length * Math.cos(Math.asin(this.bottom_bracket_drop / this.chain_stay_length))) ** 2);
        } else {
            console.log("cannot compute geometry");
            console.log("please give at least wheelbase, front base length or fork rate");
            console.log(this.geometry_to_string());
        }


        // centre roue avant
        // distance axe roue - axe pédalier au niveau du pedalier
        this.front_wheel_x = this.o_x + Math.sqrt(this.front_center ** 2 - (this.wheel_radius - this.bracket_height) ** 2);
        this.front_wheel_y = this.wheel_radius - this.bracket_height;

        // console.log("axe roue arriere = (%.2f, %.2f) axe roue avant = (%.2f, %.2f)" % (this.rear_wheel_x, this.rear_wheel_y, this.front_wheel_x, this.front_wheel_y))

        if (isUndefined(this.fork_rate)) {
            // virtual_front_wheel
            // equation: this.front_wheel_y = this.fork_base_y - l * Math.sin(degre_to_alpha(this.head_tube_angle))
            let l = -(this.front_wheel_y - this.fork_base_y) / Math.sin(degre_to_alpha(this.head_tube_angle));
            let virtual_front_wheel_x = this.fork_base_x - l * Math.cos(degre_to_alpha(this.head_tube_angle));
            this.fork_rate = this.front_wheel_x - virtual_front_wheel_x;
        }

        if (isDefined(this.seat_tube)) {
            // tube de selle - jusqu'au tube horizontal (peut etre slooping)
            this.seat_tube_x = this.o_x + this.seat_tube * Math.cos(degre_to_alpha(this.seat_tube_angle));
            this.seat_tube_y = this.o_y + this.seat_tube * Math.sin(degre_to_alpha(this.seat_tube_angle));
        } else {
            this.seat_tube_x = undefined;
            this.seat_tube_y = undefined;
        }

        // down tube base
        this.down_tube_x = this.fork_base_x + 4.25 * Math.cos(degre_to_alpha(this.head_tube_angle));
        this.down_tube_y = this.fork_base_y + 4.25 * Math.sin(degre_to_alpha(this.head_tube_angle));

        // saddle
        this.saddle_x = this.o_x - this.saddle_fore_aft;
        this.saddle_y = this.o_y + this.saddle_height * Math.sin(degre_to_alpha(this.seat_tube_angle));
        this.saddle_seat_tube_x = this.o_x + this.saddle_height * Math.cos(degre_to_alpha(this.seat_tube_angle)); // abscisse du tube de selle au niveau de la selle


        // difference saddle - stem base
        this.drop = this.saddle_y - this.stem_base_y;

        // pedal axle 
        let alpha = 0.0;
        this.pedal_x = this.o_x + this.crank_length * Math.cos(alpha);
        this.pedal_y = this.o_y + this.crank_length * Math.sin(alpha);
        
        // calcul d'indicateurs
        this.saddle_stem_distance = point_distance(this.saddle_x, this.saddle_y, this.stem_base_x, this.stem_base_y);
        this.ratio_saddle_stem_distance_drop = this.saddle_stem_distance / this.drop;
        this.ratio_saddle_stem_distance_saddle_height = this.saddle_stem_distance / this.saddle_height;
        this.ratio_stack_reach = this.stack / this.reach;

    }

}



const frame_distance= function(frame1, frame2, dsd='', drop='', ratio_dsd_drop='', deport=undefined) {
    let res = 0.0;
    const dsd1 = point_distance(frame1.saddle_x, frame1.saddle_y, frame1.stem_base_x, frame1.stem_base_y);
    const dsd2 = point_distance(frame2.saddle_x, frame2.saddle_y, frame2.stem_base_x, frame2.stem_base_y);

    const delta_dsd = dsd2 - dsd1;
    const delta_drop = frame2.drop - frame1.drop;
    const delta_ratio_dsd_drop = (dsd2/frame2.drop) - (dsd1/frame1.drop);
    const delta_deport = frame2.fork_rate - frame1.fork_rate;

    const args = [dsd, drop, ratio_dsd_drop, deport];
    const deltas = [delta_dsd, delta_drop, delta_ratio_dsd_drop, delta_deport];

    let max = 1000.0;
    const len = args.length;
    for (let i = 0 ; i<len && res < max ; i++) {
        if (isUndefined(args[i])) {
            // do nothing
        } else if (args[i] === '') {
            res += deltas[i] ** 2;
        } else if (args[i] === '+') {
            if (deltas[i] >= 0.0) {
                res += deltas[i] ** 2;
            } else {
                res = max;
            }
        } else if (args[i] === '-') {
            if (deltas[i] <= 0.0) {
                res += deltas[i] ** 2;
            } else {
                res = max;
            }
        } else if (args[i] === '=') {
            if (deltas[i] !== 0.0) {
                res += deltas[i] ** 2;
            } else {
                res = max;
            }
        }
    }
    return Math.sqrt(res)
};

const top_frame = function(frame_list, frame, hs, rs, dsd='', drop='-', ratio_dsd_drop='', fork_rate=undefined) {
    const l = [];
    for (f of frame_list) {
        l.push({frame:f, distance:frame_distance(frame, f, dsd, drop, ratio_dsd_drop, fork_rate)});
    }

    l.sort(function (pair1,pair2) {
        return pair1.distance - pair2.distance;
    });
    return l
};

const compute_extra_information = function(frame_list, saddle_height, saddle_fore_aft) {
    min_ratio_stack_reach = 10.0;
    min_ratio_dsd_drop = 10.0;
    min_ratio_dsd_saddle_height = 10.0;
    max_ratio_stack_reach = 0.0;
    max_ratio_dsd_drop = 0.0;
    max_ratio_dsd_saddle_height = 0.0;
    sum_ratio_stack_reach = 0.0;
    sum_ratio_dsd_drop = 0.0;
    sum_ratio_dsd_saddle_height = 0.0;
    for(const frame of frame_list) {
        // print(frame.geometrie_to_string())
        frame.compute_geometry(saddle_height, saddle_fore_aft);

        sum_ratio_stack_reach += frame.ratio_stack_reach;
        if (frame.ratio_stack_reach > max_ratio_stack_reach) {
            max_ratio_stack_reach = frame.ratio_stack_reach;
        } else if (frame.ratio_stack_reach < min_ratio_stack_reach) {
            min_ratio_stack_reach = frame.ratio_stack_reach;
        }

        sum_ratio_dsd_drop += frame.ratio_dsd_drop;
        if (frame.ratio_dsd_drop > max_ratio_dsd_drop) {
            max_ratio_dsd_drop = frame.ratio_dsd_drop;
        } else if (frame.ratio_dsd_drop < min_ratio_dsd_drop) {
            min_ratio_dsd_drop = frame.ratio_dsd_drop;
        }

        sum_ratio_dsd_saddle_height += frame.ratio_dsd_saddle_height;
        if (frame.ratio_dsd_saddle_height > max_ratio_dsd_saddle_height) {
            max_ratio_dsd_saddle_height = frame.ratio_dsd_saddle_height;
        } else if (frame.ratio_dsd_saddle_height < min_ratio_dsd_saddle_height) {
            min_ratio_dsd_saddle_height = frame.ratio_dsd_saddle_height;
        }
    }

    const len = frame_list.length;
    for(const frame of frame_list) {
        frame.ratio_stack_reach_moy = sum_ratio_stack_reach / len;
        frame.ratio_stack_reach_normal = 10.0 * (frame.ratio_stack_reach - min_ratio_stack_reach) / (max_ratio_stack_reach - min_ratio_stack_reach);

        frame.ratio_dsd_drop_moy = sum_ratio_dsd_drop / len;
        frame.ratio_dsd_drop_normal = 10.0 * (frame.ratio_dsd_drop - min_ratio_dsd_drop) / (max_ratio_dsd_drop - min_ratio_dsd_drop);

        frame.ratio_dsd_saddle_height_moy = sum_ratio_dsd_saddle_height / len;
        frame.ratio_dsd_saddle_height_normal = 10.0 * (frame.ratio_dsd_saddle_height - min_ratio_dsd_saddle_height) / (max_ratio_dsd_saddle_height - min_ratio_dsd_saddle_height);
    }
};

// TODO:
// detect selection of user's bike (brand,model,size,year)
// compute a list of best bikes in background
// dynamically present this list to client

Meteor.methods({
    'frames.find'(jsonUiState) {
        const brand = jsonUiState.brand;
        const model = jsonUiState.model;
        const size = jsonUiState.size;
        const year = jsonUiState.year;

        check(brand, String);
        check(model, String);
        check(size, String);
        check(year, String);
        console.log('find.frames started');


        /**
         * for a given saddle_height and saddle_fore_aft
         * compute once the geometry of each frame of the database
         * this should be done in background when the user enters saddle_height and saddle_fore_aft
         */
        const frame_list = [];
        const saddle_height = 74.5;
        const saddle_fore_aft = 20.5;

        const frame_database = Frames.find({});
        frame_database.forEach((f) => {
            const frame = new Frame(f);
            // frame.compute_geometry(saddle_height, saddle_fore_aft);
            frame_list.push(frame);
        });
        
        compute_extra_information(frame_list, saddle_height, saddle_fore_aft);
        console.log('number of bikes in frame_list: ' + frame_list.length);

        /**
         * retrieve the selected frame
         * warning: fields of the database (String) have been converted into String, float, undefined, etc.
         */
        const selectedFrame = Frames.findOne({'brand': brand, 'model': model, 'size': size, 'year': year});
        const user_frame = frame_list.find(function (f) {
            return f._id === selectedFrame._id; // each object has the same _id as entries of the database
        });

        if (isDefined(user_frame)) {
            // console.log('user_frame:');
             console.log(user_frame);

             Session.set('user_frame', user_frame);

            // console.log('geometry: ' + user_frame.geometry_to_string());

            const top_frames = top_frame(frame_list, user_frame, saddle_height, saddle_fore_aft, '', '', '', undefined);
            Session.set('top_frames', top_frames);

            const number = 20;
            console.log('Top ' + number);
            for (let i = 0; i < number; i++) {
                let f = top_frames[i].frame;
                console.log('%s.  %s %s %s (%f)', i+1, f.brand, f.model, f.size, top_frames[i].distance);
            }

            for (let i = 0; i < number; i++) {
                console.log('\ndistance = %f', float2(top_frames[i].distance));
                top_frames[i].frame.display();
            }

        }
        console.log('find.frames finished');

    },

});