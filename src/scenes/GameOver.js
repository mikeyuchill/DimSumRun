class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        WebFont.load({
            google: {
                families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
            }
        });
        this.add.image(centerX, centerY, 'endgame').setScale(0.19).setOrigin(0.5,0.5);
        // check for high score in local storage
        // uncomment console.log statements if you need to debug local storage
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            //console.log(`storedScore: ${storedScore}`);
            // see if current score is higher than stored score
            if(level > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        // add GAME OVER text
        if(newHighScore) {
            this.hiscore = this.add.image(centerX+20, centerY+textSpacer, 'newhighscore').setScale(0.5);
        }
        
        
        this.survive = this.add.image(centerX+20, centerY+2*textSpacer, 'yousurvivedfor').setScale(0.15);
        this.add.text(centerX+220, centerY+2*textSpacer+10, `${level}   S`, { fontFamily: 'Freckle Face', fontSize: '36px', color: '#FFF' }).setOrigin(0.8);
        this.browser = this.add.image(centerX+20, centerY+3*textSpacer, 'thisbrowsersbest').setScale(0.15);
            //this.hiscore.setDepth(1);
        this.add.text(centerX+205, centerY+3*textSpacer, `${highScore}   S`, { fontFamily: 'Freckle Face', fontSize: '36px', color: '#F9BB1F' }).setOrigin(0.5);
        //this.add.text(centerX, centerY + textSpacer*2, `Press UP ARROW to Restart`, { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            bgm.stop();
            this.sound.play('Bling', { volume: 0.5});
            this.scene.start('playScene');
        }
    }
}