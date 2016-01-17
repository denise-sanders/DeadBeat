// See the README! And have a Dr. Pepper!

var PlayState = function(phGame) {
    this.name = "PLAYSTATE";
    this.game = phGame;

    // Load this.songs options from JSON.
    var request = new XMLHttpRequest();
    request.open("GET", "songs.json", false);
    request.send(null);
    this.songs = JSON.parse(request.responseText);

    // Select random song.
    this.songId = Math.floor(Math.random() * (this.songs.length));
    this.newSong();

    // Things to load go here.
    this.game.load.image('image/note', 'assets/note.png');
    for (var i = 0; i < this.songs.length; i++) {
        this.game.load.audio(this.songs[i].path, this.songs[i].path);
        console.log("LOADED " + i);
    }

    this.consecutiveCounter = 0;
    this.motivation = this.game.add.text(game.world.centerX+200, 200, "", { // Prints encouragement for consecutive correct beats
        font: "50px Arial", fill: "#ffffff", align: "center" });
	this.consecutiveMiss = 0;	
	this.missMotivation = this.game.add.text(game.world.centerX-300, 200, "", { // Prints encouragement for consecutive wrong beats
        font: "50px Arial", fill: "#ffffff", align: "center" });
		
	this.motivationMessages = ["Awesome!", "So cool!", "On time", "No pressure", "Legendary","So beautiful","","","","",""];
	this.motivationMissMessages = ["Mistakes are proof you're trying", "Your future is created by you", "There are no limits", "Strive for progress, not perfection", "Fall seven times, stand up eight","Experts were once beginners","Every second is a second chance","","","","","","",""];	
	
};

PlayState.prototype = Object.create(GameState.prototype);

var hitCounter;
var missCounter;
var spaceTime = 0; // Used in tick, prevents counter running up from spacebar being held down too long

PlayState.prototype.newSong = function() {
    this.songId += 1;
    if (this.songId == this.songs.length) {
        this.songId = 0;
    }
    var id = this.songId;
    console.log("SONG ID: " + id);
    this.songName = this.songs[id].name;
    this.songArtist = this.songs[id].artist;
    this.songLicense = this.songs[id].license;
    this.songBPM = this.songs[id].bpm;
    this.songOffset = this.songs[id].offset;
    this.songPath = this.songs[id].path;
    this.songThreshold = this.songs[id].threshold;
}

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
    this.song = this.game.add.audio(this.songPath);
    this.bpm = this.songBPM;

    // Prepare the beat information.
    this.beatTime = 60 / this.bpm;
    this.beats = 0;
    this.threshold = this.beatTime * 0.25;

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
    this.lastTime += this.songOffset;

    // OK GO!
    this.song.play();
}

PlayState.prototype.disable = function() {
    this.song.stop();
    this.newSong();
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
			this.randomMessage = Math.floor(Math.random() * (this.motivationMessages.length - 1));
            this.consecutiveCounter +=1;
			this.missMotivation.visible = false;
			this.consecutiveMiss = 0;
        } else if (timeUntilNext < this.threshold) {
            this.note.renderable = true;
            this.displayNoteUntil = this.lastTime + this.beatTime + this.threshold * 2;
            console.log("Off by: -" + timeUntilNext);
            hitCounter += 1;
            this.moveMotivation();
			this.randomMessage = Math.floor(Math.random() * (this.motivationMessages.length - 1));
            this.consecutiveCounter += 1;
			this.missMotivation.visible = false;
			this.consecutiveMiss = 0;
        } else {
            missCounter += 1;
            console.log("Off by: *" + timeUntilNext);
            this.consecutiveCounter = 0;
			this.consecutiveMiss +=1;
			this.motivation.visible = false;
			this.randomMessage = Math.floor(Math.random() * (this.motivationMissMessages.length - 1));
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
		this.missMotivation.visible = false;
        return "SCORESTATE";
    }


    this.tapped = false; // I dont know if this should be here
    updateBackgroundColor();
    return this.name;

}

// Function that handles encouragement that is printed in the upper right hand corner
PlayState.prototype.extras = function() {

	// For consecutive hits
	switch (true){
		case this.consecutiveCounter === 0:
			this.motivation.visible = false;
			break;
		case this.consecutiveCounter === 3:
			this.motivation.visible = true;
			this.motivation.text = "Awesome!";
			break;
		case this.consecutiveCounter === 5:
			this.motivation.text = "5 in a row!";
			break;
		case this.consecutiveCounter === 6:
			this.motivation.text = "";
			break;
			
		case this.consecutiveCounter === 10:
			this.motivation.text = "10 consecutive!";
			break;
		case this.consecutiveCounter === 11:
			this.motivation.text = "";
			break;	
		case this.consecutiveCounter > 12:
			this.motivation.text = this.motivationMessages[this.randomMessage];
	}
	
	// for consecutive misses
	switch (true) {
		case this.consecutiveMiss === 0:
			this.missMotivation.visible = false;
			break;
		case this.consecutiveMiss >= 5 && this.consecutiveMiss % 2 === 1:
			this.missMotivation.visible = true;
			this.missMotivation.text = this.motivationMissMessages[this.randomMessage];
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
