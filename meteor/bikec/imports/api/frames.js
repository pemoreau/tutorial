import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from "meteor/check";

import './tools.js';

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

class _Frame {
    constructor(o) {
        //this.brand = o.brand;
        for (var field in o){
            if (o.hasOwnProperty(field) && field != '_id') {
                if(o[field] == 'None') {
                    this[field] = undefined;
                } else {
                    this[field] = o[field];
                }
                //console.log("Key is " + field + ", value is " + o[field]);
            }
        }

        if(this.head_tube_angle != undefined) {
            this.head_tube_angle = 180.0 - this.head_tube_angle;
        }
        if(this.seat_tube_angle != undefined) {
            this.seat_tube_angle = 180.0 - this.seat_tube_angle;
        }
        if(this.crank_length == undefined) {
            this.crank_length = 17.25; // 172.5mm
        }

        // extra data
        this.wheel_circumference = 211.0;
        this.wheel_diameter = this.wheel_circumference / Math.PI;
        this.stem_length = 10.0;
        this.stem_angle = 80.0;  // degres
        this.stem_spacer = 3.5;  // total heigth of spacers
        this.stem_height = 4.5;
        this.handlebar_diameter = 2.54;
        // steer_tube_diameter

        this.saddle_height = undefined;
        this.saddle_fore_aft = undefined;

    }

    compute_geometry(saddle_height, saddle_fore_aft) {
        // compute crank_height : wheel_diameter/2 = crank_height + bottom_bracket_drop
        if (this.saddle_height != undefined && this.bottom_bracket_drop != undefined) {
            if (this.check_equality('wheel diameter', this.wheel_diameter, 'computed wheel diameter',
                2 * (this.bracket_height + this.bottom_bracket_drop), 0.03) == False) {
                console.log('crank_height and bottom_bracket_drop are not compatible');
            }
        } else if (this.bracket_height != undefined) {
            this.bottom_bracket_drop = this.wheel_diameter / 2 - this.bracket_height;
        } else if (this.bottom_bracket_drop != undefined) {
            this.bracket_height = this.wheel_diameter / 2 - this.bottom_bracket_drop;
        } else {
            console.log("cannot compute geometry");
            console.log("please give at least bracket_height or bottom_bracket_drop");
        }

        // here, bracket_height, bottom_bracket_drop et rr sont connus

        //     # centre roue arriere
        //     # distance axe roue - axe pédalier au niveau du pedalier
        //     self.RARx = self.Ox - math.sqrt(self.base_ar ** 2 - (self.rr - self.hp) ** 2)
        //     self.RARy = self.rr - self.hp
        //
        //     # calcul de la position de la douille de direction
        //     if self.reach is not None and self.stack is not None:
        //         # cas : on connait le reach et le stack
        //
        //     # base potence
        //     self.BPx = self.Ox + self.reach
        //     self.BPy = self.Oy + self.stack
        //
        //     # base tube horizontal
        //     self.BTHx = self.BPx - 4.25 * math.cos(degre_to_alpha(self.atdf))
        //     self.BTHy = self.BPy - 4.25 * math.sin(degre_to_alpha(self.atdf))
        //
        //     # on en deduit hcv et lcv
        //     self.htv = (self.BTHy - self.Oy) * math.sin(degre_to_alpha(self.atds))
        //     self.HCVx = self.Ox + self.htv * math.cos(degre_to_alpha(self.atds))
        //     self.HCVy = self.BTHy
        //     self.lcv = self.BTHx - self.HCVx
        //
        //     #self.stack = self.BPy - self.Oy
        //     #self.reach = self.BPx - self.Ox
        //
        //     elif self.hcv is not None and self.lcv is not None:
        //         # cas : on connait la hauteur et la longueur virtuelle
        //
        //     # point virtuel ou le tube serait vraiment horizontal
        //     self.HCVx = self.Ox + self.hcv * math.cos(degre_to_alpha(self.atds))
        //     self.HCVy = self.Oy + self.hcv * math.sin(degre_to_alpha(self.atds))
        //
        //     # base tube horizontal
        //     self.BTHx = self.HCVx + self.lcv
        //     self.BTHy = self.HCVy
        //
        //
        //     # base potence
        //     self.BPx = self.BTHx + 3.77 * math.cos(degre_to_alpha(self.atdf))
        //     self.BPy = self.BTHy + 3.77 * math.sin(degre_to_alpha(self.atdf))
        //
        //     # on en deduit stack et reach
        //     self.stack = self.BPy - self.Oy
        //     self.reach = self.BPx - self.Ox
        //
        //     #print("BTHy = %.2f BPy = %.2f stack = %.2f" % (self.BTHy, self.BPy, self.stack))
        //
        // else:
        //     print("ne peut pas calculer la position de la douille de direction")
        //     print("donner reach/stack ou longueur du tube horizontal et hauteur du cadre virtuel")
        //     sys.exit()
        //
        //     # base fourche
        //     self.BFx = self.BPx - self.hdd * math.cos(degre_to_alpha(self.atdf))
        //     self.BFy = self.BPy - self.hdd * math.sin(degre_to_alpha(self.atdf))
        //
        //     # calcul de l'empattement : base_av**2 = dp**2 + ( empattement - base_ar*cos(asin(dp/base_ar)) )**2
        //     if self.empattement is not None and self.base_av is not None:
        //         empattement_calcule = math.sqrt(self.base_av ** 2 - self.dp ** 2) + self.base_ar * math.cos(
        //             math.asin(self.dp / self.base_ar))
        //     if not self.check_equality('empattement', self.empattement, 'empattement calculé', empattement_calcule, 0.01):
        //     print("base avant et empattement incoherents")
        //     elif self.base_av is not None:
        //         self.empattement = math.sqrt(self.base_av ** 2 - self.dp ** 2) + self.base_ar * math.cos(
        //             math.asin(self.dp / self.base_ar))
        //     elif self.empattement is not None:
        //         self.base_av = math.sqrt(
        //             self.dp ** 2 + (self.empattement - self.base_ar * math.cos(math.asin(self.dp / self.base_ar))) ** 2)
        //     elif self.deport is not None:
        //         '''
        //     Equations
        //     RAVVx = BFx - l * math.cos(degre_to_alpha(atdf))
        //     RAVVy = BFy - l * math.sin(degre_to_alpha(atdf))
        //     RAVVy == rr - hp
        //     RAVVx + self.deport = RAVx
        //     '''
        //     RAVVy = self.rr - self.hp
        //     l = -(RAVVy - self.BFy) / math.sin(degre_to_alpha(self.atdf))
        //     RAVVx = self.BFx - l * math.cos(degre_to_alpha(self.atdf))
        //     self.RAVx = RAVVx + self.deport
        //     self.RAVy = RAVVy
        //     self.empattement = self.RAVx - self.RARx
        //     self.base_av = math.sqrt(
        //         self.dp ** 2 + (self.empattement - self.base_ar * math.cos(math.asin(self.dp / self.base_ar))) ** 2)
        // else:
        //     print("ne peut pas calculer la geometrie")
        //     print("donner au moins l'empattement, la longueur de la base avant, ou le deport")
        //     print(self.geometrie_to_string())
        //     sys.exit()
        //
        //     # centre roue avant
        //     # distance axe roue - axe pédalier au niveau du pedalier
        //     self.RAVx = self.Ox + math.sqrt(self.base_av ** 2 - (self.rr - self.hp) ** 2)
        //     self.RAVy = self.rr - self.hp
        //
        //     # print("axe roue arriere = (%.2f, %.2f) axe roue avant = (%.2f, %.2f)" % (self.RARx, self.RARy, self.RAVx, self.RAVy))
        //
        //     if self.deport is None:
        //         # axe roue virtuel
        //     # equation : self.RAVy = self.BFy - l * math.sin(degre_to_alpha(self.atdf))
        //     l = -(self.RAVy - self.BFy) / math.sin(degre_to_alpha(self.atdf))
        //     RAVVx = self.BFx - l * math.cos(degre_to_alpha(self.atdf))
        //     self.deport = self.RAVx - RAVVx
        //
        //     if self.hc is not None:
        //         # tube de selle - jusqu'au tube horizontal (peut etre slooping)
        //     self.HCx = self.Ox + self.hc * math.cos(degre_to_alpha(self.atds))
        //     self.HCy = self.Oy + self.hc * math.sin(degre_to_alpha(self.atds))
        // else:
        //     self.HCx = None
        //     self.HCy = None
        //
        //
        //     # base tube diagonal
        //     self.BTDx = self.BFx + 4.25 * math.cos(degre_to_alpha(self.atdf))
        //     self.BTDy = self.BFy + 4.25 * math.sin(degre_to_alpha(self.atdf))
        //
        //
        //
        //     # selle
        //     #self.Sx = self.Ox + self.hs * math.cos(degre_to_alpha(self.atds))
        //     self.Sx = self.Ox - self.rs
        //     self.Sy = self.Oy + self.hs * math.sin(degre_to_alpha(self.atds))
        //     self.STx = self.Ox + self.hs * math.cos(degre_to_alpha(self.atds)) # abscisse du tube de slle au niveau de la selle
        //
        //
        //     # difference selle - base potence
        //     self.drop = self.Sy - self.BPy
        //
        //
        //     # axe pedale
        //     alpha = 0.0
        //     self.Px = self.Ox + self.lm * math.cos(alpha)
        //     self.Py = self.Oy + self.lm * math.sin(alpha)
        //
        //     #calcul d'indicateurs
        //     self.dsd = distance(self.Sx, self.Sy, self.BPx, self.BPy)
        //     self.rapport_dsd_drop = self.dsd / self.drop
        //     self.rapport_dsd_hs = self.dsd / self.hs
        //     self.rapport_stack_reach = self.stack / self.reach




    }

}
// make Frame global such that class _Frame is available in other modules
Frame = _Frame;



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

        var selectedBike = Frames.findOne({'brand':brand, 'model':model, 'size':size, 'year':year});
        console.log('selectedBike:');
        console.log(selectedBike);

        var bikes = Frames.find({}).fetch();
        //console.log(bikes);


        const frame = new Frame(selectedBike);
        var saddle_height = 74.5;
        var saddle_fore_aft = 20.5;

        frame.compute_geometry(saddle_height, saddle_fore_aft);
        console.log(frame);

        return ;
    },

});