// See the README! And have a Dr. Pepper!

var PlayState = function(phGame) {
    this.name = "PLAYSTATE";
    this.game = phGame;

    // Things to load go here.
    this.game.load.image('image/note', 'assets/note.png');
    this.game.load.audio('song/oceanic', 'assets/oceanic.ogg');
};

PlayState.prototype = Object.create(GameState.prototype);

PlayState.prototype.enable = function() {
    // Adjust the background color.
    this.game.stage.backgroundColor = 0xffffff;

    // Setup note in the middle of the screen.
    var centerX = game.world.centerX;
    var centerY = game.world.centerY;
    this.note = this.game.add.sprite(centerX, centerY, 'image/note');
    this.note.renderable = false;

    // Setup the spacebar to count as a clap.
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]); // browser can't stop the signal, Mel

    // Prepare the song.
    this.song = this.game.add.audio('song/oceanic');
    this.bpm = 90;

    // Prepare the beat information.
    this.beatTime = 60 / this.bpm;
    this.beats = 0;
    this.threshold = this.beatTime * 0.2;

    // Prepare SpaceBar tracking information.
    this.lastInput = 0;
    this.inputFreq = this.beatTime / 2;

    // Note display information.
    this.displayNoteUntil = this.currentTime - 1;

    // Keep track of time.
    this.startTime = this.game.time.totalElapsedSeconds();
    this.lastTime = this.startTime;

    // Factor in a minor offset for audio.
    this.lastTime -= 0.2;

    // OK GO!
    this.song.play();
}

PlayState.prototype.tick = function() {
    // Update the time/beat information.
    var currentTime = this.game.time.totalElapsedSeconds();
    while (currentTime > (this.lastTime + this.beatTime)) {
        this.beats += 1;
        this.lastTime += this.beatTime;
    }
    
    // Get surrounding beat information.
    var timeSinceLast = currentTime - this.lastTime;
    var timeUntilNext = this.lastTime + this.beatTime - currentTime;

    // Did the user press the SpaceBar? Were they allowed to?
    if (this.space.isDown && (currentTime - this.lastInput) > this.inputFreq) {
        this.lastInput = currentTime;
        // Does the beat count?
        if (timeSinceLast < this.threshold) {
            this.note.renderable = true;
            this.displayNoteUntil = this.lastTime + this.threshold * 2;
            console.log("Off by: " + timeSinceLast);
        } else if (timeUntilNext < this.threshold) {
            this.note.renderable = true;
            this.displayNoteUntil = this.lastTime + this.beatTime + this.threshold * 2;
            console.log("Off by: -" + timeUntilNext);
        }
    }

    // Verify that the note is in it's correct visibility state.
    if (currentTime > this.displayNoteUntil) {
        this.note.renderable = false;
    }
}

// RULES
// (1) User can only press the spacebar once every beatTime*(2/3) seconds.
// (2) Must be within 20% of the beat in order to count.
