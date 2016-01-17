// The README is calling! Don't let it go!

// ScoreState extends GameState

var ScoreState = function(phGame) {
    this.name = "SCORESTATE";
    this.game = phGame;

    this.game.load.image('title', 'assets/DeadBeatTitle.png');
    
    this.game.load.image('start', 'assets/StartButton.png');

    this.incrementer = 1;
	
}

ScoreState.prototype = Object.create(GameState.prototype);

ScoreState.prototype.enable = function() {
   
    this.game.add.sprite(25, 25, 'title');

    this.startButton = this.game.add.button(game.world.centerX - 95, 400, 'start',
            this.actionOnClick, this, 2, 1, 0);

    var textSpaceHeight = 300;
    var textSpaceWidth = 200; 
	
    this.textSpace = this.game.add.text(textSpaceWidth, textSpaceHeight, "", {
        font: "100px Arial", fill: "#ffffff", align: "center" });
			
	
	var ratioTextHeight = 150;
	var ratioTextWidth = width/2 - 500; 
	var replayTextHeight = 250;
	var replayTextWidth = width/2 - 150;
		
	this.ratioText = this.game.add.text(ratioTextWidth, ratioTextHeight, "You hit " + Math.round((hitCounter / (hitCounter + missCounter)* 100))  + "% of the downbeats.", {
        font: "75px Arial", fill: "#ffffff", align: "center" });
		

	
	this.replayText = this.game.add.text(replayTextWidth, replayTextHeight, "Play again?", {
        font: "50px Arial", fill: "#ffffff", align: "center" });

	if (isNaN(Math.round((hitCounter / (hitCounter + missCounter)* 100))))
	{
		this.ratioText.text = "You miss 100% of the shots \nyou don't take";
		this.x = this.x - 150;
		this.replayText.visible = false;
	}
}

ScoreState.prototype.tick = function() {
    updateBackgroundColor();
    return this.name;
}

// Utilities for input and colors.

ScoreState.prototype.actionOnClick = function() {
    this.startButton.visible = false;
	this.ratioText.visible = false;
	this.replayText.visible = false;
	this.toPlayState();
}

ScoreState.prototype.showNote = function() {
    this.note.visible = true;
}

ScoreState.prototype.hideNote = function() {
    this.note.visible = false;
}

ScoreState.prototype.toPlayState = function() {
	currentState = playState;
    currentState.enable(); 
}

