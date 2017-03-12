var Physics_Engine = Physics_Engine || {};
Physics_Engine.keys = [];
Physics_Engine.mouse = {
    pos: [0, 0],
    click: false
}

//---Listeners---//
document.addEventListener('keydown', function (e) {
    if (Physics_Engine.keys.indexOf(e.key) === -1) {
        Physics_Engine.keys.push(e.key);
    };
});
document.addEventListener('keyup', function (e) {
    Physics_Engine.keys.splice(Physics_Engine.keys.indexOf(e.key), 1);
});
// document.addEventListener('mousemove', function (e) {
//     console.log(e.clientY);
// });
// document.addEventListener('click', function (e) {

// });
// document.addEventListener('resize', function (e) {

// });
//---End Listeners---//

var stop = false,
    canvas = {},
    canvCtx = {},
    objects = [],
    game_height = 700,
    game_width = 1000,
    blur = true;

var air_resistance = 0.01,
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
    $("#game-canvas").mousemove(function (e) {
        Physics_Engine.mouse.pos = [e.offsetX, e.offsetY];
    });
    $("#game-canvas").mousedown(function (e) {
        Physics_Engine.mouse.click = true;
    });
    $("#game-canvas").mouseup(function (e) {
        Physics_Engine.mouse.click = false;
    });

    objects.push(new Player([300, 300], 40));
    objects[0].has_gravity = false;

    // spawn some objects
    for(var i = 0; i < 30; i++) {
        var obj = new Obj([game_width * Math.random(), game_height * Math.random()], Math.round(40 * Math.random() + 10));
        obj.has_gravity = false;
        obj.accelerate([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]);
        // if(i <= 5) obj.is_movable = false;
        objects.push(obj);
    }
    objects[0].radius = 100;
    objects[0].mass = 1e50;
    objects[0].velocity = new Vector([0, 0]);
    objects[0].position = [game_width/2, game_height/2];

    // var obj1 = new Player([game_width * 2 / 3, game_height / 2], 10);
    // var obj2 = new Obj([game_width / 3, game_height / 2], 40);
    // var obj3 = new Obj([obj2.pos[0] + 80, obj2.pos[1]], 40);
    // var obj4 = new Obj([obj3.pos[0] + 80, obj2.pos[1]], 40);
    // obj1.mass *= 100;
    // obj1.has_gravity = false;
    // obj2.has_gravity = false;
    // obj3.has_gravity = false;
    // obj4.has_gravity = false;
    // obj1.accelerate([-0, 0]);
    // objects = [obj1, obj2, obj3, obj4];

    //start the main loop
    Physics_Engine.main();
};

Physics_Engine.stop = function () {
    stop = true;
};

Physics_Engine.main = function () {
    var anim_request_ID = window.requestAnimationFrame(Physics_Engine.main);
    // var anim_request_ID = window.setTimeout(Physics_Engine.main, 100);
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
    canvCtx.fillStyle = blur ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)';

    // canvCtx.fillStyle = 'black';
    canvCtx.fillRect(0, 0, canvas.width, canvas.height);

    for (var obj in objects) {
        objects[obj].render(canvCtx);
    }
};

//this is where it all begins!
$(document).ready(Physics_Engine.init);