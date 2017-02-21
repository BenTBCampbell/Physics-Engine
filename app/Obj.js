var Obj = function (pos, size) {
    this.position = pos;
    this.size = size;
    this.velocity = new Vector([0, 0]);
    this.has_gravity = true;
}

Obj.prototype.accelerate = function (comps) {
    if (!comps instanceof Array || isNaN(comps[0]) || isNaN(comps[1])) {
        console.error("(Obj.accelerate) invalid acceleration");
        return;
    }
    this.velocity.add(comps);
};

Obj.prototype.update = function () {
    var x = this.position[0],
        y = this.position[1];
    
    //check collision
    for(var i in objects) {
        var obj = objects[i];
        if(obj === this) continue;

        //assume all objects are circles for now
        var connecting_vec = 
            new Vector([obj.position[0] - this.position[0],
                        obj.position[1] - this.position[1]]);
        var overlap = this.size + obj.size - connecting_vec.get_magnitude();
        if(overlap > 0) {
            var disp_vec = get_vec_DM(connecting_vec.get_direction(), overlap / 2);
            var disp_vec_2 = get_vec_DM(Math.PI + connecting_vec.get_direction(), overlap / 2)
            obj.accelerate(disp_vec.components);
            this.accelerate(disp_vec_2.components);
        }
    }

    //gravity
    if(this.has_gravity) this.accelerate([0, gravity]);

    //air resistance
    var v = this.velocity;
    var direction = Math.PI + v.get_direction();
    var magnitude = v.get_magnitude() * air_resistance;
    var acc_AR = get_vec_DM(direction, magnitude);//acceleration Air Resistance
    this.accelerate(acc_AR.components);

    //displace by velocity
    x += this.velocity.components[0];
    y += this.velocity.components[1];
    //make sure it stays on screen
    x = wrap_number(0, canvas.width, x);
    y = wrap_number(0, canvas.height, y);
    this.position = [x, y];
}

Obj.prototype.render = function (ctx) {
    // console.log("DEBUG: render");
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], this.size, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.fillRect(0, 0, 100, 100);
}