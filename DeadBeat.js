var width = document.body.offsetWidth; 
var height = document.body.offsetHeight;

//var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
//    preload: preload, create: create, update: update });

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() 
{
	game.load.image('title', 'assets/DeadBeatTitle.png');
	//game.load.image('cat', 'assets/uglyCat.png');

}

var platforms;

function create() 
{
	//game.add.sprite(0, 0, 'title');
	
	
   
    game.add.sprite(25, 25, 'title');
	//game.add.sprite(0, 0, 'cat');

}
function update() 
{

}
