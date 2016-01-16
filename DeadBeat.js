var width = document.body.offsetWidth; 
var height = document.body.offsetHeight;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload, create: create, update: update });

function preload() 
{
	game.load.image('title', 'DeadBeatTitle.png');
	// alert("Ellen loves us")
}

function create() 
{
	game.add.sprite(0, 0, 'title');
}
function update() 
{

}
