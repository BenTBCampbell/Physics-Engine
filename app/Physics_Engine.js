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