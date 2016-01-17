// The README is calling! Don't let it go!

// StartState extends GameState

var StartState = function(phGame) {
    this.name = "STARTSTATE";
    this.game = phGame;

    this.game.load.image('title', 'assets/DeadBeatTitle.png');
    this.game.load.image('note', 'assets/note.png');
    this.game.load.image('start', 'assets/StartButton.png');

    this.game.load.audio('song', 'assets/song.ogg');

    this.incrementer = 1;
}

StartState.prototype = Object.create(GameState.prototype);

StartState.prototype.enable = function() {
    
    this.game.add.sprite(25, 25, 'title');

    this.startButton = this.game.add.button(game.world.centerX - 95, 400, 'start',
            this.actionOnClick, this, 2, 1, 0);

    var textSpaceHeight = 300;
    var textSpaceWidth = 200; 
	
    this.textSpace = this.game.add.text(textSpaceWidth, textSpaceHeight, "", {
        font: "100px Arial", fill: "#ffffff", align: "center" });
			
	
	var introHeight = 150;
	var introWidth = width/2 - 300; // There has gotta be a better way
	var instructionHeight = 250;
	var instructionWidth = width/2 - 500;
		
	this.intro = this.game.add.text(introWidth, introHeight, "Learn to clap on beat.", {
        font: "75px Arial", fill: "#ffffff", align: "center" });
	this.instruction = this.game.add.text(instructionWidth, instructionHeight, "Press the spacebar on the beat to the music.", {
        font: "50px Arial", fill: "#ffffff", align: "center" });
	
}

StartState.prototype.tick = function() {
    updateBackgroundColor();
    return this.name;
}

// Utilities for input and colors.

StartState.prototype.actionOnClick = function() {
    this.startButton.visible = false;
	this.intro.visible = false;
	this.instruction.visible = false;
	this.toPlayState();
}

StartState.prototype.showNote = function() {
    this.note.visible = true;
}

StartState.prototype.hideNote = function() {
    this.note.visible = false;
}

StartState.prototype.toPlayState = function() {
	currentState = playState;
    currentState.enable(); 
}

