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
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var player;
var stars;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var clouds;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('cloud', 'assets/cloud.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
  //  A simple background for our game
  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(50, 600, 'ground').setScale(2).refreshBody();
  platforms.create(900, 600, 'ground').setScale(1.5).refreshBody();

  // The player and its settings
  player = this.physics.add.sprite(100, 450, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(false);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
      key: 'star',
      repeat: 5,
      setXY: { x: 12, y: 0, stepX: 200 }
  });

  stars.children.iterate(function (child) {

      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);


  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);
  
  /*clouds = this.add.physicsGroup();/*
  var cloud1 = new clouds(this.game, 100, 150, 'cloud', this.clouds);
  cloud1.addMotionPath([{
    x: "+200",
    xSpeed: 2000,
    xEase: "Linear",
    y: "-200",
    ySpeed: 2000,
    yEase: "Sine.easeIn"
  }, {
    x: "-200",
    xSpeed: 2000,
    xEase: "Linear",
    y: "-200",
    ySpeed: 2000,
    yEase: "Sine.easeOut"
  }, {
    x: "-200",
    xSpeed: 2000,
    xEase: "Linear",
    y: "+200",
    ySpeed: 2000,
    yEase: "Sine.easeIn"
  }, {
    x: "+200",
    xSpeed: 2000,
    xEase: "Linear",
    y: "+200",
    ySpeed: 2000,
    yEase: "Sine.easeOut"
  }]);*/

}

function update ()
{
  if (gameOver)
  {
      return;
  }

  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);

      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);

      player.anims.play('right', true);
  }
  else
  {
      player.setVelocityX(0);

      player.anims.play('turn');
  }

  if(player.x < 0){
    player.x = 700
  }else if(player.x > 800){ //Why does the character fall through the floor?
    player.x = 100
  }

  //player = game.physics.angleToPointer(player);
  /*
  if (game.input.activePointer.isDown) {
    game.physics.accelerateToPointer(player);
    player.body.drag.setTo(0, 0);
  } else {
    sprite.body.acceleration.set(0, 0);
    sprite.body.drag.setTo(25, 25);
  }*/
}

function collectStar (player, star)
{
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText('Score: ' + score);

  if(score == 40){
    alert('You win!');
    location.reload();
  }

  if (stars.countActive(true) === 2)
  {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true);

      });

      //var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

  }
}
