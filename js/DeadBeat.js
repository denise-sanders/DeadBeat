// See the README! Licensed under MIT. Endorsed by raptors!

var width = $(window).width() - 20;
var height = $(window).height() - 20;
var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload, create: create, update: update
});

var startState;

var currentState;

function preload() {
    startState = new StartState(game);
    playState = new PlayState(game);
}

function create() {
    currentState = playState;
    currentState.enable();
}

function update() {
    var oldState = currentState;
    switch (currentState.tick()) {
        case "STARTSTATE":
            currentState = startState;
            break;
        case "PLAYSTATE":
            currentState = playState;
            break;
    }
    if (oldState != currentState) {
        oldState.disable();
        currentState.enable();
    }
}
