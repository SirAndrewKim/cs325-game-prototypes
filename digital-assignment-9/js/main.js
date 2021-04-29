import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1024,
  height: 1152,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var rolls = 5;
var rolls1 = 5;
var rolled = false;
var rolled1 = false;
var rollText;
var rollText1;
var rollSum = 0;
var rollSum1 = 0;
var rollSumTest;
var rollSumTest1;
var text;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("button", "assets/button.jpg");
  this.load.image("button1", "assets/button1.jpg");

  this.load.image("d1", "assets/dice1.png");
  this.load.image("d2", "assets/dice2.png");
  this.load.image("d3", "assets/dice3.png");
  this.load.image("d4", "assets/dice4.png");
  this.load.image("d5", "assets/dice5.png");
  this.load.image("d6", "assets/dice6.png");

  this.load.image("a1", "assets/die1.jpg");
  this.load.image("a2", "assets/die2.jpg");
  this.load.image("a3", "assets/die3.jpg");
  this.load.image("a4", "assets/die4.jpg");
  this.load.image("a5", "assets/die5.jpg");
  this.load.image("a6", "assets/die6.jpg");

  this.load.image("playmat", "assets/playmat.jpg");

  this.load.audio("bgm", "assets/yugiohbgm.mp3");
}

function create() {

  this.add.image(520, 500, "playmat");

  this.music = this.sound.add('bgm', {volume: 0.2}); 
  this.music.play();

  this.reset = this.input.keyboard.addKey("SPACE");

  rollText = this.add.text(600, 1035, "rolls left: " + rolls, {
    fontSize: "32px",
    fill: "#FFF",
  });

  rollText1 = this.add.text(600, 105, "rolls left: " + rolls1, {
    fontSize: "32px",
    fill: "#FFF",
  });

  rollSumTest = this.add.text(325, 805, "Sum: " + rollSum, {
    fontSize: "64px",
    fill: "#FFF",
  });

  rollSumTest1 = this.add.text(325, 305, "Sum: " + rollSum1, {
    fontSize: "64px",
    fill: "#FFF",
  });

  var button = this.add.sprite(450, 1050, "button1").setInteractive();
  var button1 = this.add.sprite(450, 105, "button").setInteractive();

  button.on("pointerdown", function (pointer) {
    rollCount();
  });

  button1.on("pointerdown", function (pointer) {
    rollCount1();
  });
}

function update() {
  if (this.reset.isDown) {
    this.scene.restart();
    rolls = 5;
  }

  if (rolled == true && rolls > 0) {
    var rng = Phaser.Math.RND.between(1, 6);

    if (rng == 1) {
      this.add.image(250, 1050, "d1");
    } else if (rng == 2) {
      this.add.image(250, 1050, "d2");
    } else if (rng == 3) {
      this.add.image(250, 1050, "d3");
    } else if (rng == 4) {
      this.add.image(250, 1050, "d4");
    } else if (rng == 5) {
      this.add.image(250, 1050, "d5");
    } else {
      this.add.image(250, 1050, "d6");
    }
    rolled = false;
  }

  if (rolled1 == true && rolls1 > 0) {
    var rng1 = Phaser.Math.RND.between(1, 6);

    if (rng1 == 1) {
      this.add.image(250, 105, "a1");
    } else if (rng1 == 2) {
      this.add.image(250, 105, "a2");
    } else if (rng1 == 3) {
      this.add.image(250, 105, "a3");
    } else if (rng1 == 4) {
      this.add.image(250, 105, "a4");
    } else if (rng1 == 5) {
      this.add.image(250, 105, "a5");
    } else {
      this.add.image(250, 105, "a6");
    }
    rolled1 = false;
  }

  rollSum = rng + rng;
  rollSumTest.setText("Sum: " + rollSum);

  rollSum1 = rng1 + rng1;
  rollSumTest1.setText("Sum: " + rollSum1);
}

function rollCount() {
  rolled = true;
  rolls--;
  if (rolls == 0) {
    rollText.setText("Rolls: None");
  } else if (rolls > 0) {
    rollText.setText("Rolls left: " + rolls);
  }
}

function rollCount1() {
  rolled1 = true;
  rolls1--;
  if (rolls1 == 0) {
    rollText1.setText("Rolls: None");
  } else if (rolls1 > 0) {
    rollText1.setText("Rolls left: " + rolls1);
  }
}
