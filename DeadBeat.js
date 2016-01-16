var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });


var spaceKey;

var textSpace;	// Says clap
var textSpaceHeight = 300;
var textSpaceWidth = 200; // Try to find a way to center this

var backgroundColorValue; 
var incrementer;

var note; // The music note sprite

function preload() {
	game.load.image('title', 'assets/DeadBeatTitle.png');
    game.load.image('note', 'assets/note.png');
	
	backgroundColorValue = 0xff0000;
	incrementer = 1;
}



function create() {
    game.stage.backgroundColor = backgroundColorValue;
    game.add.sprite(25, 25, 'title');
	
    note = game.add.sprite(-100, -100, 'note');
	
	platforms = game.add.group();
	
   
	note.scale.setTo(.2,.2);

	
	
	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]); // Prevents the browswer from taking the signal
	
	this.textSpace = game.add.text(textSpaceWidth, textSpaceHeight, "", { font: "100px Arial", fill: "#ffffff", align: "center" });
	
	
	
	//game.stage.backgroundColor = backgroundColorValue;
	
}


function update() {
	
	updateBackgroundColor();
	
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


function updateBackgroundColor()
{
	//incrementer = 1;
	//console.log(backgroundColorValue);
	
	if (backgroundColorValue === 0xff0000) // red
	{
		incrementer = 0x100 // approaches yellow
	}
	
	else if (backgroundColorValue === 0xffff00) // yellow
	{
		incrementer = -65536; // essentially -0x10000,approaches green
	}
	
	else if (backgroundColorValue === 0xff00) // green
	{
		incrementer = 0x1; // approaches cyan 
	}
	
	else if (backgroundColorValue === 0xffff) // cyan
	{
		incrementer = -256; // essentially -0x100 approaches blue 
	}
	
	else if (backgroundColorValue === 0xff) // blue
	{
		incrementer = 0x10000; // approaches purple 
	}
	
	else if (backgroundColorValue === 0xff00ff) // purple
	{
		incrementer = -1; // approaches red 
	}
	
	backgroundColorValue += incrementer;
	
	game.stage.backgroundColor = backgroundColorValue;
}