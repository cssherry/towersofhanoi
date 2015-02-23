function Game (numberOfDisks) {
  this.towers = [[], [], []];
  for (var i = 0; i < numberOfDisks; i++) {
    this.towers[0] = this.towers[0].unshift(i);
  }
}

Game.prototype.isValidMove = function (startTowerIdx, endTowerIdx) {
  var startTower = this.towers[startTowerIdx];
  var endTower = this.towers[endTowerIdx];

  if (startTower.length === 0) {
    return false;
  } else if (endTower.length === 0) {
    return true;
  } else {
    var topStartDisc = startTower[startTower.length - 1];
    var topEndDisc = endTower[endTower.length - 1];
    return topStartDisc < topEndDisc;
  }
};

Game.prototype.isWon = function () {
  // move all the discs to the last or second tower
  return (this.towers[2].length == 3) || (this.towers[1].length == 3);
};

Game.prototype.move = function (startTowerIdx, endTowerIdx) {
  if (this.isValidMove(startTowerIdx, endTowerIdx)) {
    this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
    return true;
  } else {
    return false;
  }
};

Game.prototype.run = function (reader, gameCompletionCallback) {
  this.promptMove(reader, (function (startTowerIdx, endTowerIdx) {
    if (!this.isWon()) {
      // Continue to play!
      this.run(reader, gameCompletionCallback);
    } else {
      this.print();
      gameCompletionCallback();
    }
  }).bind(this));
};

module.exports = Game;
