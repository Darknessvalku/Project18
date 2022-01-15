var gameState = "playing";
var score = 0;

var trex_image, trexCollided_image;
var trex_sprite;

var ground_image;
var ground_sprite;

var cloud_image;
var cloud_sprite;

var invisibleGround_sprite;

var obstacles = [];
var obstacle_sprite;

var restart_image, restart_sprite;
var gameOver_image, gameOver_sprite;

var ob_group, cloud_group;

var sound_enums = ['checkPoint', 'died', 'jumped'];

function preload() {
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");

  trex_image = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided_image = loadAnimation("trex_collided.png");

  gameOver_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
  
  for (var i = 1; i <= 6; i++) {
    obstacles.push(loadImage('obstacle' + i + '.png'));
  }

  sound_enums.checkPoint = loadSound('checkPoint.mp3');
  sound_enums.died = loadSound('die.mp3');
  sound_enums.jumped = loadSound('jump.mp3');
}

function setup() {
  createCanvas(600, 200);
  ob_group = createGroup();
  cloud_group = createGroup();

  gameOver_sprite = createSprite(300, 85, 50, 50);
  gameOver_sprite.addImage(gameOver_image);
  gameOver_sprite.scale = 0.75;

  restart_sprite = createSprite(300, 130, 50, 50);
  restart_sprite.addImage(restart_image);
  restart_sprite.scale = 0.5;
  
  trex_sprite = createSprite(40, 175, 50, 40);
  trex_sprite.scale = 0.475;
  trex_sprite.addAnimation('trexCollided', trexCollided_image);
  trex_sprite.addAnimation('trex', trex_image);

  // trex_sprite.setCollider('rectangle', 0, 0, 400, trex_sprite.height);
  // trex_sprite.debug = true;

  ground_sprite = createSprite(300, 190, 600, 10);
  ground_sprite.addImage("ground", ground_image);

  invisibleGround_sprite = createSprite(300, 201, 600, 10);
  invisibleGround_sprite.visible = false;
}

function draw() {
  background("white");

  textSize(15);
  text('Score: ' + score, 20, 35);

  drawSprites();
  trex_sprite.collide(invisibleGround_sprite);

  if (gameState === "playing") {
    if (frameCount % 20 === 0) score++;
    if (score > 0 && score % 200 === 0) sound_enums.checkPoint.play();

    trex_sprite.changeAnimation("trex", trex_image);

    restart_sprite.visible = false;
    gameOver_sprite.visible = false;

    generateObstacles();
    generateClouds();
    if ((keyDown("space") || trex_sprite.isTouching(ob_group)) && trex_sprite.y > 165) {
      sound_enums.jumped.play();
      trex_sprite.velocityY = -14.25;
      trex_sprite.velocityX++;
    } else trex_sprite.velocityX = 0;
    if (ground_sprite.x <= 0) ground_sprite.x = 300;

    trex_sprite.velocityY++;
    ground_sprite.x = ground_sprite.x - 5;
    
    if (trex_sprite.isTouching(ob_group)) {
      sound_enums.died.play();
      gameState = "end";
    }
  } else if (gameState === "end") {
    trex_sprite.changeAnimation('trexCollided', trexCollided_image);
    trex_sprite.velocityY = 0;

    restart_sprite.visible = true;
    gameOver_sprite.visible = true;
    
    ground_sprite.velocityX = 0;

    ob_group.setVelocityXEach(0);
    cloud_group.setVelocityXEach(0);

    ob_group.setLifetimeEach(-1);
    cloud_group.setLifetimeEach(-1);
    if (mousePressedOver(restart_sprite)) location.reload();
  }
}

function generateClouds() {
  if (frameCount % 60 === 0) {
    cloud_sprite = createSprite(550, 75, 50, 40);
    cloud_sprite.addImage(cloud_image);
    cloud_sprite.y = random(5, 75);

    cloud_sprite.velocityX = -5;
    cloud_sprite.lifetime = 120;
    cloud_group.add(cloud_sprite);
  }
}

function generateObstacles() {
  if (frameCount % 60 === 0) {
    obstacle_sprite = createSprite(550, 171, 50, 50);
    obstacle_sprite.velocityX = -5;
    obstacle_sprite.scale = 0.475;

    obstacle_sprite.lifetime = 120;
    ob_group.add(obstacle_sprite);

    var rando = Math.round(random(1, 6));
    obstacle_sprite.addImage(obstacles[rando]);
  }
}
