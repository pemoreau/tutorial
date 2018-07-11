import { Session } from 'meteor/session';

export class UiState {
    constructor() {
        // this.brand = undefined;
        // this.model = undefined;
        // this.size = undefined;
        // this.year = undefined;
    }

    //PEM: we use Session to automatically refresh this list of item that depends on getXXX()

    getBrand() {
        // return this.brand;
        console.log('getBrand: ' + Session.get("selectedItem"));
        return Session.get("selectedItem");

    }

    getModel() {
        //return this.model;
        return Session.get("selectedModel");

    }

    getSize() {
        //return this.size;
        return Session.get("selectedSize");

    }

    getYear() {
        //return this.year;
        return Session.get("selectedYear");

    }


    setBrand(v) {
        // this.brand = v;
        console.log('setBrand: ' + v);
        Session.set("selectedItem", v);
        Session.set("selectedModel", undefined);
        Session.set("selectedSize", undefined);
        Session.set("selectedYear", undefined);
    }

    setModel(v) {
        console.log('setModel: ' + v);

        //this.model = v;
        Session.set("selectedModel", v);
        Session.set("selectedSize", undefined);
        Session.set("selectedYear", undefined);
    }


    setSize(v) {
        console.log('setSize: ' + v);

        //this.size = v;
        Session.set("selectedSize", v);
        Session.set("selectedYear", undefined);
    }

    setYear(v) {
        console.log('setYear: ' + v);

        //this.year = v;
        Session.set("selectedYear", v);
    }

    set(name,v) {
        switch(name) {
            case 'brand': this.setBrand(v); break;
            case 'model': this.setModel(v); break;
            case 'size': this.setSize(v); break;
            case 'year': this.setYear(v); break;
        }
    }

}