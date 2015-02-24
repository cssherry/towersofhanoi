(function () {
  var Hanoi = window.Hanoi = (window.Hanoi || {});

  var View = Hanoi.View = function View (game, $el) {
    this.$el = $el;
    this.game = game;
    this.numberOfDisks = this.game.towers[0].length;
    this.percentage = 100/this.numberOfDisks;
    this.setupTowers($el);
    this.$from = "";
    this.$to = "";
  };

  // Registers tower clicks
  View.prototype.clickTower = function () {
    var that = this;
    $(".hanoi > div").on("click", function(){
      if (that.$from === "") {
        $('.error').remove();
        that.$from = $(event.currentTarget);
        that.$from.children('[disc-size]:first').addClass('fromTower');
      } else {
        that.$to = $(event.currentTarget);
        var from = parseInt(that.$from.attr("tower"));
        var to = parseInt(that.$to.attr("tower"));
        if (that.game.move(from, to)){
          var $currentDisc = that.$from.children('[disc-size]:first');
          var currentDiscSize = $currentDisc.attr('disc-size');
          var $newDisc = that.$to
                             .children(':not([disc-size]):last');
          $newDisc.attr('disc-size', currentDiscSize);
          that.setDiscWidth($newDisc, currentDiscSize);
          $currentDisc.removeAttr('disc-size');
        } else {
          $errorText = $("<p class='text-danger centered'>Invalid move. Try again.</p>");
          $errorText.addClass('error');
          $('.game-board').append($errorText);
        }
        that.$from.children().removeClass('fromTower');
        that.clearSelections();
      }

      if (that.game.isWon()) {
        that.won();
      }
    });
  };

  // Remembers the towers that are selected
  View.prototype.clearSelections = function(){
    this.$from = "";
    this.$to = "";
  };

  // Set up towers
  View.prototype.setupTowers = function ($el) {
    $el.text("");
    // Make 3 towers
    for (var i = 0; i < 3; i++){
      var $tower = $("<div></div>");
      $tower.attr("tower", i);
      for (var j = 0; j < this.numberOfDisks; j++){
        var $disc = $("<div></div>").css("height", this.percentage + "%");
        // Make all the disks in the first tower
        if (i === 0) {
          $disc.attr("disc-size", j);
          this.setDiscWidth($disc, j);
        }
        $tower.append($disc);
      }
      $el.append($tower);
    }
  };

  View.prototype.setDiscWidth = function ($el, size) {
    $el.css("width",  this.percentage * (parseInt(size) + 1) + "%");
  };

  // Display winner text, deactivate event listeners on towers,
  // and wait for restarting game
  View.prototype.won = function () {
    $winnerText = $("<h2 class='text-success centered'>You Win!</h2>");
    var $button = $("#play").addClass("display btn btn-default");
    $(".winner-text").prepend($winnerText);

    $(".hanoi > div").off();

    var that = this;
    $button.on("click", function(){
      that.game = new Hanoi.Game(that.numberOfDisks);
      that.setupTowers(that.$el);
      that.redraw($button, $winnerText);
      that.clearSelections();
      $button.off();
      that.clickTower();
    });
  };

  // Hides the winner text, restart button, and resets the Hanoi game
  View.prototype.redraw = function ($button, $winnerText) {
    $("[disc-size]").removeAttr("disc-size");
    $("[tower = 0]").children().each(function(index, $element) {
      $(this).attr("disc-size", index);
    });
    $button.removeClass('display');
    $winnerText.remove();
  };

})();
