var Physics_Engine = Physics_Engine || {};
Physics_Engine.keys = [];

//---Listeners---//
document.addEventListener('keydown', function (e) {
    if (Physics_Engine.keys.indexOf(e.key) === -1) {
        Physics_Engine.keys.push(e.key);
    };
});
document.addEventListener('keyup', function (e) {
    Physics_Engine.keys.splice(Physics_Engine.keys.indexOf(e.key), 1);
});
document.addEventListener('mousemove', function (e) {

});
document.addEventListener('click', function (e) {

});
document.addEventListener('resize', function (e) {

});
//---End Listeners---//

var stop = false,
    canvas = {},
    canvCtx = {},
    objects = [],
    game_height = 700,
    game_width = 1000;

var air_resistance = 0.005,
    gravity = 0.2;

Physics_Engine.init = function () {

    //set height for game
    $('#game-div').css('max-width', game_width);
    $('#game-div').css('max-height', game_height);

    //and the canvas
    canvas = $('#game-canvas')[0];
    canvCtx = canvas.getContext('2d');
    canvas.width = game_width;
    canvas.height = game_height;

    //spawn some objects
    for(var i = 0; i < 10; i++) {
        var obj = new Obj([game_width * i / 10, game_height * (i % 2) / 2], 40);
        obj.has_gravity = false;
        obj.accelerate([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30]);
        objects.push(obj);
    }

    //start the main loop
    Physics_Engine.main();
};

Physics_Engine.stop = function () {
    stop = true;
};

Physics_Engine.main = function () {
    var anim_request_ID = window.requestAnimationFrame(Physics_Engine.main);
    if (stop) {
        window.cancelAnimationFrame(anim_request_ID);
        return;
    }

    Physics_Engine.update();
    Physics_Engine.render();
};

Physics_Engine.update = function () {
    for (var obj in objects) {
        objects[obj].update();
    }
};

Physics_Engine.render = function () {

    //clear the canvas
    canvCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    // canvCtx.fillStyle = 'black';
    canvCtx.fillRect(0, 0, canvas.width, canvas.height);

    for (var obj in objects) {
        objects[obj].render(canvCtx);
    }
};

//this is where it all begins!
$(document).ready(Physics_Engine.init);


//=============================HELPER FUNCTIONS===============================//

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
//============================================================================//

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