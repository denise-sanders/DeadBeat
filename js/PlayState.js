// See the README! And have a Dr. Pepper!

var PlayState = function(phGame) {
    this.name = "PLAYSTATE";
    this.game = phGame;
};

PlayState.prototype = Object.create(GameState.prototype);
