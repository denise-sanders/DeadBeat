var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });


var spaceKey;

var textSpace;	
var textSpaceHeight = 300;
var textSpaceWidth = 200; // Try to find a way to center this

var backgroundColorValue; 

var note;

function preload() {
	game.load.image('title', 'assets/DeadBeatTitle.png');
    game.load.image('note', 'assets/note.png');
	backgroundColorValue = "#ff0000";	
}



function create() {
    game.stage.backgroundColor = 0x00ffff;
    game.add.sprite(25, 25, 'title');
	
    note = game.add.sprite(-100, -100, 'note');
	
	platforms = game.add.group();
	
   
	note.scale.setTo(.2,.2);

	
	
	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]); // Prevents the browswer from taking the signal
	
	this.textSpace = game.add.text(textSpaceWidth, textSpaceHeight, "", { font: "100px Arial", fill: "#ffffff", align: "center" });
	
	
	
	game.stage.backgroundColor = backgroundColorValue;
	
}


function update() {
	

	// Using downDuration lets us display it longer
	if (this.spaceKey.downDuration(250)) //(this.spaceKey.isDown) 
    {
         
		this.textSpace.text = "Clap.";
		showNote();
    }
	else 
	{
		this.textSpace.text = "";
		hideNote();
	}
}


function showNote()
{
	note.reset(100,200);
	
}

function hideNote()
{
	note.reset(-100,-100);
	
}
