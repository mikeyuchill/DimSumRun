// Sheng Yu
// Dim Sum Run
// An endless dodging game
// Updated: 4/27/20

// keep me honest
'use strict';

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 720,
    width: 1000,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Load, Title, Instruction, Play, GameOver ],
    "transparent": true
}

// uncomment the following line if you need to purge local storage data
//localStorage.clear();

// define game
let game = new Phaser.Game(config);

// define globals
let centerX = game.config.width/2;
let centerY = game.config.height/2;
const textSpacer = 64;
let bun = null;
let paddle = null;
let sudden = null;
let suddentype = null;
const paddleWidth = 16;
const paddleHeight = 128;
const paddleVelocity = 200;
let bgm = null;
let powerups;
let level;
let highScore;
let newHighScore = false;
let cursors;