// See the README! And have a Dr. Pepper!

var PlayState = function(phGame) {
    this.name = "PLAYSTATE";
    this.game = phGame;

    // Things to load go here.
    this.game.load.image('image/note', 'assets/note.png');
    this.game.load.audio('song/oceanic', 'assets/oceanic.ogg');
	
	this.consecutiveCounter = 0;
	this.motivation = this.game.add.text(game.world.centerX+200, 200, "", { // Prints encouragement for consecutive correct beats
        font: "50px Arial", fill: "#ffffff", align: "center" });
};

PlayState.prototype = Object.create(GameState.prototype);

var hitCounter;
var missCounter;
var spaceTime = 0; // Used in tick, prevents counter running up from spacebar being held down too long

PlayState.prototype.enable = function() {

    // Counts the hits and misses
	hitCounter = 0;
	missCounter = 0;
	
	// Adjust the background color.
	updateBackgroundColor();
	
	// Make the song only play 30 seconds
	this.beginTime = this.game.time.totalElapsedSeconds();
	this.endTime = this.beginTime + 30; // They have 30 seconds with the song

    // Setup note in the middle of the screen.
    var centerX = game.world.centerX;
    var centerY = game.world.centerY;

    this.note = this.game.add.sprite(centerX - 50, centerY - 50, 'image/note');
    this.note.scale.setTo(.5,.5);
    this.note.renderable = false;

    // Setup the spacebar to count as a clap.
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]); // browser can't stop the signal, Mel

	// Create scoreboard
	var hitText = "Hits: " + 0;
	var missText = "Misses: " + 0;
	var hitX = centerX + 250;
	var hitY = centerY + 150;
	var missX = centerX + 250;
	var missY = centerY + 200;

    this.space.onDown.add(this.tap, this);
    this.tapped = false;
    //this.game.input.onTap.add(this.tap, this);
    this.game.input.onDown.add(this.tap, this);

    // Create scoreboard
    var hitText = "Hits: " + 0;
    var missText = "Misses: " + 0;
    var hitX = centerX + 200;
    var hitY = centerY + 100;
    var missX = centerX + 200;
    var missY = centerY + 200;

    this.hit = this.game.add.text(hitX, hitY, hitText, {
        font: "50px Arial", fill: "#ffffff", align: "center" });
    this.miss = this.game.add.text(missX, missY, missText, {
        font: "50px Arial", fill: "#ffffff", align: "center" });

    // Prepare the song.
    this.song = this.game.add.audio('song/oceanic');
    this.bpm = 90;

    // Prepare the beat information.
    this.beatTime = 60 / this.bpm;
    this.beats = 0;
    this.threshold = this.beatTime * 0.35;

    // Prepare input tracking information.
    this.lastInput = 0;
    this.inputFreq = this.beatTime / 2;

    // Note display information.
    this.displayNoteUntil = 0;

    // Try to load the song?
    this.song.play();
    this.song.pause();

    // Keep track of time.
    this.startTime = this.game.time.totalElapsedSeconds();
    this.lastTime = this.startTime;

    // Factor in a minor offset for audio.
    //this.lastTime -= 0.1;

    // OK GO!
    this.song.play();
}

PlayState.prototype.tap = function() {
    this.tapped = true;
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
    if (this.tapped  && (currentTime - this.lastInput) > this.inputFreq) {
        this.lastInput = currentTime;
        // Does the beat count?
        if (timeSinceLast < this.threshold) {
            this.note.renderable = true;
            this.displayNoteUntil = this.lastTime + this.threshold * 2;
            console.log("Off by: " + timeSinceLast);
			hitCounter += 1;
			this.moveMotivation();
			this.consecutiveCounter +=1;
        } else if (timeUntilNext < this.threshold) {
            this.note.renderable = true;
            this.displayNoteUntil = this.lastTime + this.beatTime + this.threshold * 2;
            console.log("Off by: -" + timeUntilNext);
			hitCounter += 1;
			this.moveMotivation();
			this.consecutiveCounter += 1;
        } else {
			missCounter += 1;
			console.log("Off by: *" + timeUntilNext);
			this.consecutiveCounter = 0;
		}
    	
		//writes the updated score
		this.hit.text = "Hits: " + hitCounter; 
		this.miss.text = "Misses: " + missCounter;
    }

    // Verify that the note is in it's correct visibility state.
    if (currentTime > this.displayNoteUntil) {
        this.note.renderable = false;
    }

	
	this.extras();
	
	if (this.endTime < game.time.totalElapsedSeconds()){
		this.note.renderable = false;
		this.hit.visible = false;
		this.miss.visible = false;
		this.motivation.visible = false;
		return "SCORESTATE";
	}
	
	
    this.tapped = false; // I dont know if this should be here
    updateBackgroundColor();
    return this.name;

}

// Function that handles encouragement that is printed in the upper right hand corner
PlayState.prototype.extras = function() {
	switch (this.consecutiveCounter){
		case 0:
			this.motivation.visible = false;
			break;
		case 3:
			this.motivation.visible = true;
			this.motivation.text = "Awesome!";
			break;
		case 5:
			this.motivation.text = "5 in a row!";
			break;
		case 6:
			this.motivation.text = "";
			break;
			
		case 10:
			this.motivation.text = "10 consecutive!";
			break;
		case 11:
			this.motivation.text = "";
	}
}

// Called whenever consecutiveCounter is incrementedCh
PlayState.prototype.moveMotivation =function(){
	randomX = Math.floor(Math.random() * game.world.centerX + 150); // For maximum fun, message will be printed on a random place on the screen
	randomY = Math.floor(Math.random() * game.world.centerY + 100) + 100; 
	
	this.motivation.x = randomX; 
	this.motivation.y = randomY;
}

// RULES
// (1) User can only press the spacebar once every beatTime*(2/3) seconds.
// (2) Must be within 20% of the beat in order to count.
