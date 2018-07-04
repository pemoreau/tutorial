import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from "meteor/check";

import {distance, degre_to_alpha, radian_to_degre, check_equality, isUndefined, isDefined} from './tools.js';

export const Frames = new Mongo.Collection('frames');

export class Frame {
    constructor(o) {
        //this.brand = o.brand;
        for (const field in o) {
            if (o.hasOwnProperty(field)) {
                if(o[field] === 'None' || isUndefined(o[field])) {
                    this[field] = undefined;
                } else {
                    const v = parseFloat(o[field]);
                    if (isNaN(v)) {
                        this[field] = o[field];
                    } else {
                        this[field] = v;
                    }
                }
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
        const res = '' + this.brand + ', ' +
            + this.model + ', ' +
            + this.size + ', ' +
            + this.yeaf + ', ' +
            + this.virtual_seat_tube + ', ' +
            + this.virtual_top_tube + ', ' +
            + this.seat_tube + ', ' +
            + this.top_tube + ', ' +
            + 180.0 - this.head_tube_angle + ', ' +
            + 180.0 - this.seat_tube_angle + ', ' +
            + this.head_tube_angle + ', ' +
            + this.chain_stay_length + ', ' +
            + this.front_center + ', ' +
            + this.wheelbase + ', ' +
            + this.bottom_bracket_drop + ', ' +
            + this.bracket_height + ', ' +
            + this.stack + ', ' +
            + this.reach + ', ' +
            + this.crank_length;

        return res;
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

            //print("BTHy = %.2f stem_base_y = %.2f stack = %.2f" % (this.horizontal_tube_base_y, this.stem_base_y, this.stack))
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

        // print("axe roue arriere = (%.2f, %.2f) axe roue avant = (%.2f, %.2f)" % (this.rear_wheel_x, this.rear_wheel_y, this.front_wheel_x, this.front_wheel_y))

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
        this.saddle_stem_distance = distance(this.saddle_x, this.saddle_y, this.stem_base_x, this.stem_base_y);
        this.ratio_saddle_stem_distance_drop = this.saddle_stem_distance / this.drop;
        this.ratio_saddle_stem_distance_hs = this.saddle_stem_distance / this.saddle_height;
        this.ratio_stack_reach = this.stack / this.reach;

    }

}


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
            frame.compute_geometry(saddle_height, saddle_fore_aft);
            frame_list.push(frame);
        });
        console.log('number of bikes in frame_list: ' + frame_list.length);

        /**
         * retrieve the selected frame
         * warning: fields of the database (String) have been converted into String, float, undefined, etc.
         */
        const selectedFrame = Frames.findOne({'brand':brand, 'model':model, 'size':size, 'year':year});
        const user_frame = frame_list.find(function(f) {
            return f._id === selectedFrame._id; // each object has the same _id as entries of the database
        });
        console.log('user_frame:');
        console.log(user_frame);



        console.log('find.frames finished');

    },

});