var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('title', 'assets/DeadBeatTitle.png');
        game.load.image('note', 'assets/note.png');
}



function create() {
    game.stage.backgroundColor = 0xffffff;
    game.add.sprite(25, 25, 'title');
    var note = game.add.sprite(50, 50, 'note');
	
	platforms = game.add.group();
	
   
	note.scale.setTo(.2,.2);

	
}

function update() {

}
