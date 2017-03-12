var Obj = function (position, size, color) {
    this.pos = position;
    this.radius = size;
    this.velocity = new Vector([0, 0]);
    this.has_gravity = true;
    this.is_movable = true;
    this.mass = this.get_area(); //so default density is 1
    this.color = color || 'grey';
}

Obj.prototype.get_area = function () {
    return Math.PI * this.radius * this.radius;
}

Obj.prototype.apply_force = function (comps) {
    var vec = new Vector(comps);//force vector
    vec.multiply(1 / this.mass, true);//acceleration vector
    //a = f / m
    this.accelerate(vec.components);
}

Obj.prototype.accelerate = function (comps) {
    if (!comps instanceof Array || isNaN(comps[0]) || isNaN(comps[1])) {
        console.error("(Obj.accelerate) invalid acceleration");
        return;
    }
    this.velocity.add(comps, true);
};

Obj.prototype.update = function () {
    if (this.is_movable) this.update_position();
}

Obj.prototype.update_position = function () {

    //check collision
    for (var i in objects) {
        var obj = objects[i];
        if (obj === this) continue;

        //assume all objects are circles for now
        var connecting_vec =
            new Vector([obj.pos[0] - this.pos[0],
            obj.pos[1] - this.pos[1]]);
        var overlap = this.radius + obj.radius - connecting_vec.get_magnitude();
        if (overlap > 0) {
            //crash! they collided!
            //make sure they aren't overlapping
            overlap = get_vec_DM(connecting_vec.get_direction(), overlap);
            var percent = this.mass / (this.mass + obj.mass);
            this.pos[0] -= overlap.components[0] * (1 - percent);
            this.pos[1] -= overlap.components[1] * (1 - percent);
            obj.pos[0] += overlap.components[0] * percent;
            obj.pos[1] += overlap.components[1] * percent;

            // var vx1i = this.velocity.components[0];
            var v1i = this.velocity.components;
            var v1f = [];
            var m1 = this.mass;

            // var vx2i = obj.velocity.components[0];
            var v2i = obj.velocity.components;
            var v2f = [];
            var m2 = obj.mass;

            //v1f = ((m1 - m2)/(m1 + m2))v1i + (2*m2/(m1 + m2))v2i
            v1f[0] = ((m1 - m2) / (m1 + m2)) * v1i[0]; //x
            v1f[0] += (2 * m2 / (m1 + m2)) * v2i[0];
            v1f[1] = ((m1 - m2) / (m1 + m2)) * v1i[1]; //y
            v1f[1] += (2 * m2 / (m1 + m2)) * v2i[1];
            //conservation of momentum
            v2f[0] = (m1 * v1i[0] + m2 * v2i[0] - m1 * v1f[0]) / m2; //x
            v2f[1] = (m1 * v1i[1] + m2 * v2i[1] - m1 * v1f[1]) / m2; //y

            //Warning! Directly setting velocity
            //Idk if this is bad or not.
            this.velocity = new Vector(v1f);
            obj.velocity = new Vector(v2f);
        }
    }

    //bounce off walls
    if (this.pos[0] - this.radius < 0) {
        this.velocity.multiply([-1, 1], true);
        this.pos[0] = this.radius;
    } else if (this.pos[0] + this.radius > game_width) {
        this.velocity.multiply([-1, 1], true);
        this.pos[0] = game_width - this.radius;
    } else if (this.pos[1] - this.radius < 0) {
        this.velocity.multiply([1, -1], true);
        this.pos[1] = this.radius;
    } else if (this.pos[1] + this.radius > game_height) {
        this.velocity.multiply([1, -1], true);
        this.pos[1] = game_height - this.radius;
    }

    //gravity
    if (this.has_gravity) this.accelerate([0, gravity]);

    //air resistance
    var v = this.velocity;
    var direction = Math.PI + v.get_direction();
    var magnitude = v.get_magnitude() * air_resistance;
    var acc_AR = get_vec_DM(direction, magnitude);//acceleration Air Resistance
    this.accelerate(acc_AR.components);

    //displace by velocity
    this.pos[0] += this.velocity.components[0];
    this.pos[1] += this.velocity.components[1];

    //make sure it stays on screen
    // this.pos[0] = wrap_number(0, canvas.width, this.pos[0]);
    // this.pos[1] = wrap_number(0, canvas.height, this.pos[1]);
}

Obj.prototype.render = function (ctx) {
    // console.log("DEBUG: render");
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.fillRect(0, 0, 100, 100);
}

//===================================Player==================================//
var Player = inherit(Obj, function Player(pos, radius, color) {
    color = color || 'blue';
    Obj.call(this, pos, radius, color);
});

Player.prototype.update = function () {
    Obj.prototype.update.call(this);

    if (Physics_Engine.mouse.click) {
        var x = (Physics_Engine.mouse.pos[0] - this.pos[0]) / 100;
        var y = (Physics_Engine.mouse.pos[1] - this.pos[1]) / 100;
        this.velocity.add([x, y], true);
    }
    console.log();
}