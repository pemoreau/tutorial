export {point_distance, degre_to_alpha, radian_to_degre, check_equality, isUndefined, isDefined, float2};

const point_distance = function (x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

const degre_to_alpha = function (d) {
    d = ((d % 360) + 360) % 360;
    return (d / 360.0) * 2 * Math.PI;
};

const radian_to_degre = function (r) {
    let d = (r * 360.0) / (2 * Math.PI);
    d = ((d % 360) + 360) % 360;
    return d;
};

const check_equality = function (name1, value1, name2, value2, eps = 0.03) {
    if ((Math.abs(value1 - value2) / Math.max(value1, value2)) > eps) {
        console.log(name1 + " = " + value1 + " " + name2 + " = " + value2);
        return false;
    }
    return true;
};

/**
 * check if x is undefined (recommended way)
 */
const isUndefined = function (x) {
    return typeof x === "undefined";
};

const isDefined = function (x) {
    return !isUndefined(x);
};

const float2 = function(x) {
    return Math.floor(x*100)/100;
}