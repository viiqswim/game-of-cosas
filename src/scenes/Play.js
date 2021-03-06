import Phaser from "phaser";
import sky from "./../assets/sky.png";
import platform from "./../assets/platform.png";
import star from "./../assets/star.png";
import bomb from "./../assets/bomb.png";
import dude from "./../assets/dude.png";

let score = 0;

class Play extends Phaser.Scene {
  constructor() {
    super({
      key: "Play"
    });
  }

  preload() {
    this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', dude,
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.platforms = createPlatforms.apply(this);
    this.player = createPlayer.apply(this);
    this.stars = createStars.apply(this);
    this.scoreText = createScoreText.apply(this);

    const gameObjects = {
      player: this.player,
      platforms: this.platforms,
      stars: this.stars,
      scoreText: this.scoreText,
    }

    this.bombs = createBombs.apply(this, [{
      ...gameObjects,
      bombs: this.bombs,
    }]);
    createCollider.apply(this, [{
      ...gameObjects,
      bombs: this.bombs,
    }]);
  }

  update(time, delta) {
    createCursors.apply(this, [this.player]);
  }
}

function createPlatforms() {
  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  return platforms;
}

function createPlayer() {
  const player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.setScale(0.75, 0.75);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  return player;
}

function createScoreText() {
  const scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  return scoreText;
}

function createBombs(gameObjects) {
  const {
    player,
    platforms,
  } = gameObjects;
  const bombs = this.physics.add.group();
  const hitBomb = (player, bomb) => {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');

    restartGame.apply(this);
  };

  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);

  return bombs;
}

function restartGame() {
  var red = Phaser.Math.Between(50, 255);
  var green = Phaser.Math.Between(50, 255);
  var blue = Phaser.Math.Between(50, 255);

  this.cameras.main.on('camerafadeoutcomplete', function () {
    this.scene.restart();
  }, this);

  this.cameras.main.fade(2000, red, green, blue);
}

function createCollider(gameObjects) {
  const {
    player,
    platforms,
    stars,
    scoreText,
    bombs,
  } = gameObjects;

  const collectStar = (player, star) => {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  };

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
}

function createCursors(player) {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  return cursors;
}

function createStars() {
  const stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  return stars;
}

export default Play;
