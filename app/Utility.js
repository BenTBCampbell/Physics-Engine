/**
 * wraps an angle (or other number) into range between min and max
 * Example: wrap_number(0, 360, -115) -> 245
 * @param {number} min 
 * @param {number} max 
 * @param {number} num 
 */
function wrap_number(min, max, num) {
    var width = max - min;
    while (num < min) num += width;
    while (num > max) num -= width;
    return num;

}

/**
 * returns the angle beteween the origin and a point
 * @param {number[]} pos 
 */
function atan2(pos) {
    var angle = Math.atan(pos[1] / pos[0]);
    if (pos[0] < 0) angle -= Math.PI;
    if (isNaN(angle)) angle = 0;
    return angle;
}

function to_degrees(angle) {
    return angle * 180 / Math.PI;
}

function to_radians(angle) {
    return angle * Math.PI / 180;
}

/**
 * rounds number to given number of decimal places
 * @param {number} num 
 * @param {number} decimals 
 */
function round_to(num, decimals) {
    var decPlace = Math.pow(10, decimals); //decimal place
    return Math.round(num / decPlace) * decPlace;
}

/**
 * finds distance between two (2d) points
 * @param {number[]} p1 first point
 * @param {number[]} p2 second point
 */
function distance(p1, p2) {
    return Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0])
        + (p2[1] - p1[1]) * (p2[1] - p1[1]));
}

/**
 * used for object inheritence. Usage:
 * var Child = inherit(Parent, function() Child {
 *     Parent.call(this);
 *     ...
 * });
 * @param {*} parent 
 * @param {Function} child 
 */
function inherit(parent, child) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    return child;
}

//====================================Vector==================================//

/**
 * 2d vector defined by components
 * @constructor
 * @param {*} comps 
 */
var Vector = function (comps) {
    this.components = comps;
}

Vector.prototype = {
    get_direction: function () {
        return atan2(this.components);
    },
    get_magnitude: function () {
        var x = this.components[0],
            y = this.components[1];

        return distance([0, 0], this.components);
    },
    /**
     * adds to vector.
     * @param {(Array<number>|number)} amount if array, adds to components.
     *     otherwise, add to magnitude
     * @param {boolean} [apply=false] if true, vector is changed. otherwise
     *     only returns value
     */
    add: function (amount, apply) {
        apply = apply || false;
        var output = [this.components[0], this.components[1]];
        if (amount instanceof Array) {
            output[0] += amount[0];
            output[1] += amount[1];
        } else if (amount instanceof number) {
            var dir = this.get_direction();
            output[0] += amount * Math.cos(dir);
            output[1] += amount * Math.sin(dir);
        }
        if (apply) this.components = output;
        return output;
    },
    /**
     * multiply vector
     * @param {(Array<number>|number)} amount if array, multiply components.
     *     otherwise multiply magnitude
     * @param {boolean} [apply=false] if true, vector is changed. otherwise
     *     only returns value
     */
    multiply: function (amount, apply) {
        apply = apply || false;
        var output = [this.components[0], this.components[1]];
        if (amount instanceof Array) {
            output[0] *= amount[0];
            output[1] *= amount[1];
        } else if (typeof (amount) == 'number') {
            var dir = this.get_direction();
            output[0] *= amount * Math.cos(dir);
            output[1] *= amount * Math.sin(dir);
        }
        if (apply) this.components = output;
        return output;
    }
}

/**
 * returns a vector specified by direction and magnitde
 * @param {number} dir 
 * @param {number} mag 
 */
function get_vec_DM(dir, mag) {
    return new Vector([mag * Math.cos(dir), mag * Math.sin(dir)]);
}