export {distance, degre_to_alpha, radian_to_degre, check_equality, isUndefined, isDefined};

var distance = function(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2) ** 2 + (y1-y2) ** 2);
};

var degre_to_alpha = function(d) {
    var d = ((d % 360) + 360) % 360;
    return (d/360.0)*2*Math.PI;
};

var radian_to_degre = function(r) {
    var d = (r * 360.0) / (2 * Math.PI);
    d = ((d % 360) + 360) % 360;
    return d;
};

var check_equality = function(name1, value1, name2, value2, eps=0.03) {
    if((Math.abs(value1 - value2) / max(value1, value2)) > eps) {
        console.log(name1 + " = " + value1 + " " + name2 + " = " + value2);
        return False;
    }
    return True;
}

var isUndefined = function(x) {
    if (typeof x === "undefined") {
        return true;
    }
    return false;
}

var isDefined = function(x) {
    return ! isUndefined(x);
}