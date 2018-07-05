import { Session } from 'meteor/session';

export class UiState {
    constructor() {
        this.brand = undefined;
        this.model = undefined;
        this.size = undefined;
        this.year = undefined;
    }

    //PEM: why should I use Session ?

    getBrand() {
        //return this.brand;
        return Session.get("selectedBrand");

    }

    setBrand(v) {
        //this.brand = v;
        Session.set("selectedBrand", v);
    }

    getModel() {
        //return this.model;
        return Session.get("selectedModel");

    }

    setModel(v) {
        //this.model = v;
        Session.set("selectedModel", v);
    }

    getSize() {
        //return this.size;
        return Session.get("selectedSize");

    }

    setSize(v) {
        //this.size = v;
        Session.set("selectedSize", v);
    }

    getYear() {
        //return this.year;
        return Session.get("selectedYear");

    }

    setYear(v) {
        //this.year = v;
        Session.set("selectedYear", v);
    }


}