// See the README! And have a Dr. Pepper!

var PlayState = function(phGame) {
    this.name = "PLAYSTATE";
    this.game = phGame;

    // Things to load go here.
    this.game.load.image('image/note', 'assets/note.png');
    this.game.load.audio('song/oceanic', 'assets/oceanic.ogg');
    
    // Create dicts for these to go in.
    this.inputs = {}
    this.songs = {}
    this.sprites = {}
};

PlayState.prototype = Object.create(GameState.prototype);

PlayState.prototype.enable = function() {
    // Adjust the background color.
    this.game.stage.backgroundColor = 0xffffff;

    // Setup note in the middle of the screen.
    var centerX = game.world.centerX;
    var centerY = game.world.centerY;
    this.sprites.note = this.game.add.sprite(centerX, centerY, 'image/note');
    this.sprites.note.renderable = false;

    // Setup the spacebar to count as a clap.
    this.inputs.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]); // browser can't stop the signal, Mel

    // Prepare the song.
    this.songs.oceanic = this.game.add.audio('song/oceanic');
    this.bpm = 90;

    // Keep track of time.
    this.startTime = this.game.time.totalElapsedSeconds();

    // OK GO!
    this.songs.oceanic.play();
}

PlayState.prototype.tick = function() {
    // Was the spacebar pressed?
    if (this.inputs.space.downDuration(500)) {
        // Hows close was this to the beat?
        elapsedTime = this.game.time.totalElapsedSeconds() - this.startTime;
        beatTime = 60 / this.bpm;
        elapsedBeats = Math.floor(elapsedTime / beatTime);
        remainder = elapsedTime - (elapsedBeats * beatTime);
        
        // Was it close enough?
        if (Math.abs(beatTime - remainder) < 0.2) {
            this.sprites.note.renderable = true;
        } else {
            console.log("not close nough, bruh: " + elapsedBeats);
        }
    } else {
        this.sprites.note.renderable = false;
    }
    return this.name;
}
