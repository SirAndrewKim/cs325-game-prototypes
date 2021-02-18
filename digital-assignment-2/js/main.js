import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// Referenced from: http://phaser.io/examples/v3/view/events/listen-to-game-object-event

let info;
let timer;
let alive = 0;
let text;
var cursors;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.gameOver = false
    }

    preload ()
    {
        this.load.image("oasis", "assets/oasis.jpg");
        this.load.image('coco', 'assets/coco4.png');
    }

    create ()
    {
        //  How many crates can you click on in 10 seconds?
        this.add.image(400, 300, 'oasis').setScale(1.5);

        //  Create a bunch of images
        for (var i = 0; i < 100; i++)
        {
            var x = Phaser.Math.Between(0, 900);
            var y = Phaser.Math.Between(0, 700);

            var box = this.add.image(x, y, 'coco');
            box.setScale(0.5);            

            //  Make them all input enabled
            box.setInteractive();

            //  The images will dispatch a 'clicked' event when they are clicked on
            box.on('clicked', this.clickHandler, this);

            alive++;
        }

        //  If a Game Object is clicked on, this event is fired.
        //  We can use it to emit the 'clicked' event on the game object itself.
        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);

        //  Display the game stats
        info = this.add.text(10, 10, '', { font: '48px Arial', fill: '#0' });

        timer = this.time.addEvent({ delay: 20000, callback: this.gameOver, callbackScope: this });

        cursors = this.input.keyboard.createCursorKeys();

        this.reset = this.input.keyboard.addKey('SPACE');


    }

    update ()
    {
        info.setText('Alive: ' + alive + '\nTime: ' + Math.floor(20 - timer.getElapsedSeconds()));

        //If there is 1 coconut left, the game is over. Player enjoys the coconut.
        if(alive < 1){
            //gameOver = true;

            let style = { font: "24px Times New Roman", fill: "#FFFFFF", align: "center"};
            text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "You did it! \nTime to relax \nPress SPACE to restart game", style );
            text.setOrigin(0.5);
        }

        if(this.reset.isDown){
            this.scene.restart();
        }
    }

    clickHandler (box)
    {
        alive--;

        box.on('clicked', this.clickHandler);
        box.input.enabled = false;
        box.setVisible(false);
    }

    gameOver ()
    {
        this.input.off('gameobjectup');
        timer.paused = true;
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 800,
    scene: [ Example ],
    "transparent": true
};

var game = new Phaser.Game(config);
