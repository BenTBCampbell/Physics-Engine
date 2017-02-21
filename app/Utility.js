function wrap_number(min, max, num) {
    var width = max - min;
    while (num < min) num += width;
    while (num > max) num -= width;
    return num;

}

function atan2(comps) {
    var angle = Math.atan(comps[1] / comps[0]);
    if (comps[0] < 0) angle -= Math.PI;
    return wrap_number(0, 2 * Math.PI, angle);
}

function to_degrees(angle) {
    return angle * 180 / Math.PI;
}

function to_radians(angle) {
    return angle * Math.PI / 180;
}

function round_to(num, decimals) {
    var decPlace = Math.pow(10, decimals); //decimal place
    return Math.round(num / decPlace) * decPlace;
}

function distance(p1, p2) {
    return Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0])
                   + (p2[1] - p1[1]) * (p2[1] - p1[1]));
}

//====================================Vector==================================//

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

        return Math.sqrt(x * x + y * y);
    },
    add: function (comps) {
        this.components[0] += comps[0];
        this.components[1] += comps[1];
    }
}

function get_vec_DM(dir, mag) {
    return new Vector([mag * Math.cos(dir), mag * Math.sin(dir)]);
}