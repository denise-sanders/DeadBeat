// See the README! Licensed under MIT. Endorsed by raptors!

// Some useful NOTES!
//
// (1) Load assets in the constructor.
// (2) Create things in enable.
// (3) Logic goes in tick.
// (4) Delete things in disable.

// Base GameState

var GameState = function(phGame) {
    this.name = "GAMESTATE";
    this.game = phGame;
};

GameState.prototype.enable = function() {};     // mark this state as active
GameState.prototype.tick = function() {};       // tick the state
GameState.prototype.disable = function() {};    // mark this state as inactive

// StartState extends GameState

var StartState = function(phGame) {
    this.name = "STARTSTATE";
    this.game = phGame;

    this.game.load.image('title', 'assets/DeadBeatTitle.png');
    this.game.load.image('note', 'assets/note.png');
	this.game.load.image('start', 'assets/StartButton.png');
	
    this.game.load.audio('song', 'assets/song.ogg');

    this.backgroundColorValue = 0xff0000;
    this.incrementer = 1;
}

StartState.prototype = Object.create(GameState.prototype);

StartState.prototype.enable = function() {
    this.game.stage.backgroundColor = this.backgroundColorValue;
    this.game.add.sprite(25, 25, 'title');

    this.note = this.game.add.sprite(-100, -100, 'note');
    this.note.scale.setTo(.2,.2);

    this.startButton = this.game.add.button(game.world.centerX - 95, 400, 'start',
            this.actionOnClick, this, 2, 1, 0);

    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // Prevents the browser from taking the signal
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    var textSpaceHeight = 300;
    var textSpaceWidth = 200; // Try to find a way to center this
    this.textSpace = this.game.add.text(textSpaceWidth, textSpaceHeight, "", {
        font: "100px Arial", fill: "#ffffff", align: "center" });
}

StartState.prototype.tick = function() {
    this.updateBackgroundColor();

    // Using downDuration lets us display it longer
    if (this.spaceKey.downDuration(250)) { //(this.spaceKey.isDown) 
        this.textSpace.text = "Clap.";
        this.showNote();
    } else {
        this.textSpace.text = "";
        this.hideNote();
    }
    return this.name;
}

// Utilities for input and colors.

StartState.prototype.actionOnClick = function() {
    this.startButton.visible = false;
	// Call next state
}

StartState.prototype.showNote = function() {
    this.note.reset(100,200);
}

StartState.prototype.hideNote = function() {
    this.note.reset(-100,-100);
}

StartState.prototype.updateBackgroundColor = function() {
    switch (this.backgroundColorValue) {
        case 0xff0000:              // red
            this.incrementer = 0x100;    // approaches yellow
            break;
        case 0xffff00:              // yellow
            this.incrementer = -65536;   // -0x100000, approaches green
            break;
        case 0x00ff00:              // green
            this.incrementer = 0x1;      // approaches cyan
            break;
        case 0x00ffff:              // cyan
            this.incrementer = -256;     // approaches blue
            break;
        case 0x0000ff:              // blue
            this.incrementer = 0x010000; // approaches purple
            break;
        case 0xff00ff:              // purple
            this.incrementer = -1;       // approaches red
            break;
    }

    this.backgroundColorValue += this.incrementer;
    this.game.stage.backgroundColor = this.backgroundColorValue; // updates background
}

// Setup general stuff here.

var width = $(window).width() - 20;
var height = $(window).height() - 20;
var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload, create: create, update: update
});

var startState;

var currentState;

function preload() {
    startState = new StartState(game);
}

function create() {
    currentState = startState;
    currentState.enable();
}

function update() {
    var oldState = currentState;
    switch (currentState.tick()) {
        case "STARTSTATE":
            currentState = startState;
            break;
    }
    if (oldState != currentState) {
        oldState.disable();
        currentState.enable();
    }
}
