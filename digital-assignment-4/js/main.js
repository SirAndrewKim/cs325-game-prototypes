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
    width: 640,
    height: 480,
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

var score;
var snake;
var food;
var cursors;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('food', 'assets/star.png');
    this.load.image('body', 'assets/body.png');
}

function create ()
{
    
    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Food (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;

            scene.children.add(this);
        },

        eat: function ()
        {
            this.total++;
        }

    });

    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body');
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 100;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = 3;
            this.direction = 3;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === 0 || this.direction === 1)
            {
                this.heading = 2;
            }
        },

        faceRight: function ()
        {
            if (this.direction === 0 || this.direction === 1)
            {
                this.heading = 3;
            }
        },

        faceUp: function ()
        {
            if (this.direction === 2 || this.direction === 3)
            {
                this.heading = 0;
            }
        },

        faceDown: function ()
        {
            if (this.direction === 2 || this.direction === 3)
            {
                this.heading = 1;
            }
        },

        move: function (time)
        {
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            * 
            * The Math.wrap call allow the snake to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
            switch (this.heading)
            {
                case 2:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case 3:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case 0:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case 1:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                console.log('dead');

                this.alive = false;

                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (food)
        {
            if (this.head.x === food.x && this.head.y === food.y)
            {
                this.grow();

                food.eat();

                //  For every 5 items of food eaten we'll decrease the snake speed
                if (this.speed > 10 && food.total % 5 === 0)
                {
                    this.speed -= -10;
                }

                return true;
            //collision against the wall
            }else if ((this.head.x === 0 || this.head.y === 0) || (this.head.x === 640 || this.head.y === 480)) {
                console.log('dead');

                this.alive = false;
                
                return false;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
            //  Remove all body pieces from valid positions list
            this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

    });

    food = new Food(this, 3, 4);

    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

}

function update (time, delta)
{
    if (!snake.alive)
    {
        return;
    }

    /**
    * Check which key is pressed, and then change the direction the snake
    * is heading based on that. The checks ensure you don't double-back
    * on yourself, for example if you're moving to the right and you press
    * the LEFT cursor, it ignores it, because the only valid directions you
    * can move in at that time is up and down.
    */
    if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }
    


    if (snake.update(time))
    {
        //  If the snake updated, we need to check for collision against food

        if (snake.collideWithFood(food))
        {
            repositionFood();
            score += 1;
        }
    }
    /** Do more research into tween. Not sure why this is not working.
    if (score == 5 && this.effect == 0) {
      this.effect += 1;
      game.add.tween(this.level).to({
        angle: 30
      }, 5000).start();
    } else if (score == 10 && this.effect == 1) {
      this.effect += 1;
      game.add.tween(this.level.scale).to({
        x: 0.5,
        y: 0.5
      }, 3000).start();
    } else if (score == 15 && this.effect == 2) {
      this.effect += 1;
      game.add.tween(this.level).to({
        x: w / 2,
        y: h / 2
      }, 5000).start();
      game.add.tween(this.level.scale).to({
        x: 0.3,
        y: 0.9
      }, 5000).start();
      game.add.tween(this.level).to({
        angle: 0
      }, 5000).start();
    } else if (score == 20 && this.effect == 3) {
      this.effect += 1;
      game.add.tween(this.level.scale).to({
        x: 1,
        y: 1
      }, 3000).start();
    } else if (score == 25 && this.effect == 4) {
      this.effect += 1;
      game.add.tween(this.level.scale).to({
        x: 0.2,
        y: 0.2
      }, 5000).start();
      game.add.tween(this.level).to({
        x: w / 2 + 150,
        y: h / 2 + 150
      }, 5000).start();
    } else if (score == 30 && this.effect == 5) {
      this.effect += 1;
      game.add.tween(this.level).to({
        x: w / 2,
        y: h / 2
      }, 5).
      to({
        x: w / 2,
        y: h / 2
      }, 4000).to({
        x: w / 2 - 150,
        y: h / 2 - 150
      }, 5).start();
    } else if (score == 35 && this.effect == 6) {
      this.effect += 1;
      game.add.tween(this.level.scale).to({
        x: 1,
        y: 1
      }, 5000).start();
      game.add.tween(this.level).to({
        x: w / 2,
        y: h / 2
      }, 5000).start();
    } else if (score == 40 && this.effect == 7) {
      this.effect += 1;
      game.add.tween(this.level).to({
        angle: -100
      }, 5000).start();
    } else if (score == 45 && this.effect == 8) {
      this.effect += 1;
      game.add.tween(this.level).to({
        angle: -190
      }, 3000).start();
    } else if (score >= 50) {
      this.level.angle -= 0.2;
    }
    */
}

/**
* We can place the food anywhere in our 40x30 grid
* *except* on-top of the snake, so we need
* to filter those out of the possible food locations.
* If there aren't any locations left, they've won!
*
* @method repositionFood
* @return {boolean} true if the food was placed, otherwise false
*/
function repositionFood ()
{
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //  Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else
    {
        return false;
    }
}
