// Programmer: Sheng Yu
// Artists: Sunny Jang, Victor Dong
// Dim Sum Run
// An endless dim sum dodging game
// Created: 04/27/20
// Updated: 05/03/20
// Creaative justification:  I use local storage to track the player's
//     high score across browser sessions, and in the game we also have 
//     a neat visual effect--a yolk leaking trail--that triggers if a player
//     pick up some certion powerups. Moreover, after a player survived for a
//     certain time, the "yolk shadow" will spawn, which is quite interesting.
//     Overall, I think our idea of this game is original and interesting
//     becuase we came up with our own ideas and I made most of the sound
//     in the game by myself, and I am proud about I am able to realize
//     the sudden events and properly handle them :)
// Cite: Chopstick icon and Fork icon from Noun Project
//       BGM from the Internet

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
            //debug: true,
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