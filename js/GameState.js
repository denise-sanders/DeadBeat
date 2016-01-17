// See the README! There might be cookies there!

// Some useful NOTES!
//
// (1) Load assets in the constructor.
// (2) Create things in enable.
// (3) Logic goes in tick.
// (4) Delete things in disable.

// Base GameState

var GameState = function(phGame) {
    this.name = "GAMESTATE";
    this.game = phGame;
	
};

GameState.prototype.enable = function() {};     // mark this state as active
GameState.prototype.tick = function() {};       // tick the state
GameState.prototype.disable = function() {};    // mark this state as inactive

