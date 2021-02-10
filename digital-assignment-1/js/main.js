import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

//My first game example: https://phaser.io/examples/v3/view/games/firstgame/part10

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 600,
    height: 920,
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
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    //this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('icon', 'assets/07a.jpg')
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(300, 450, 'icon');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 950, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(650, 100, 'ground').setScale(0.5).refreshBody();
    platforms.create(550, 270, 'ground').setScale(0.5).refreshBody();
    platforms.create(10, 300, 'ground').setScale(0.5).refreshBody();
    platforms.create(250, 450, 'ground').setScale(0.5).refreshBody();
    platforms.create(150, 620, 'ground').setScale(0.5).refreshBody();
    platforms.create(650, 620, 'ground').setScale(0.5).refreshBody();
    platforms.create(10, 750, 'ground').setScale(0.5).refreshBody();
    platforms.create(550, 790, 'ground').setScale(0.5).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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
        repeat: 20,
        setXY: { x: 12, y: 0, stepX: 30 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 8, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Create a sprite at the center of the screen using the 'logo' image.
    this.bouncy = this.physics.add.sprite( this.cameras.main.centerX, this.cameras.main.centerX, 'bomb' );

    // Make it bounce off of the world bounds.
    this.bouncy.body.collideWorldBounds = true;
        
    // Make the camera shake when clicking/tapping on it.
    this.bouncy.setInteractive();
    this.bouncy.on( 'pointerdown', function( pointer ) {
        this.scene.cameras.main.shake(500);
        });
    
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

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

    // Accelerate the 'logo' sprite towards the cursor,
    // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
    // in X or Y.
    // This function returns the rotation angle that makes it visually match its
    // new trajectory.
    this.bouncy.rotation = this.physics.accelerateToObject( this.bouncy, this.input.activePointer, 500, 500, 500 );
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0x000000);

    player.anims.play('turn');

    gameOver = true;
}
