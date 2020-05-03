class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        // reset parameters
        this.barrierSpeed = -150;
        this.barrierSpeedMax = -1000;
        level = 0;
        this.hardMODE = false;
        this.extremeMODE = false;
        this.shadowLock = false;

        // set up audio, play bgm
        // this.bgm = this.sound.add('beats', { 
        //     mute: false,
        //     volume: 1,
        //     rate: 1,
        //     loop: true 
        // });
        // this.bgm.play();

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        this.background = this.add.tileSprite(centerX, centerY, game.config.width, game.config.height, 'table').setScale(1).setOrigin(0.5,0.5);

        // set up bun (physics sprite)
        //bun = this.physics.add.sprite(32, centerY, 'bun').setOrigin(1,1).setScale(0.1);
        bun = this.physics.add.sprite(32, centerY, 'bun', 'walk2.png');
        //bun.create( bun.x, bun.y, 'runnyspritesheet');
        bun.alpha = 2;
        var customBounds = new Phaser.Geom.Rectangle(0, 98, 1000, 600);
        bun.body.setBoundsRectangle(customBounds);
        //bun.width = 10;
        //bun.body.height = 10;
        console.log("bun's width:"+bun.body.width);
        console.log("bun's height:"+bun.body.height);
        bun.setSize(700, 700, true);
        bun.setScale(0.09);
        bun.setCollideWorldBounds(true);
        
        bun.setBounce(0.5);
        bun.setImmovable();
        bun.setMaxVelocity(600, 600);
        //bun.setDragY(200);
        bun.setDepth(1);         // ensures that bun z-depth remains above shadow buns
        bun.destroyed = false;   // custom property to track bun life

        // this.anims.create({ 
        //     key: 'walk', 
        //     frames: this.anims.generateFrameNames('bun', {      
        //         prefix: 'walk1.png',
        //         start: 1,
        //         end: 3,
        //         suffix: '',
        //         //zeroPad: 4 
        //     }), 
        //     frameRate: 30,
        //     repeat: -1 
        // });


        // leaking effect
        this.anims.create({
            key: 'leak',
            frames: this.anims.generateFrameNumbers('gooeyspritesheet', { start: 0, end: 2, first: 0}),
            frameRate: 1,
            repeat: -1
         });

         this.boom = this.add.sprite(bun.x, bun.y, 'gooeyspritesheet').setOrigin(1, 0.5).setScale(0.2);
         this.boom.anims.play('leak', true);           // play explode animation
         this.boom.alpha = 0;
        //  boom.on('animationcomplete', () => {  // callback after animation completes
        //     ship.reset();                      // reset ship position
        //     ship.alpha = 1;                    // make ship visible again
        //     boom.destroy();                    // remove explostion sprite
        //  });

        // set up barrier group and add first barrier to kick things off
        this.barrierGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        this.addBarrier();

        this.powerupsGroup = this.add.group({
 
            runChildUpdate: true    // make sure update runs on group children
        });
        this.addPowerups();

        this.suddenGroup = this.add.group({
 
            runChildUpdate: true    // make sure update runs on group children
        });

        // set up difficulty timer (triggers callback every second)
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        this.timeLeft = 50;
 
        // the Yolk Bar container.
        let yolkContainer = this.add.sprite(210, 40, "yolkcontainer").setScale(0.6);
 
        // the actual Yolk Bar.
        //this.yolkBar = this.add.sprite(yolkContainer.x + 23, yolkContainer.y, "yolkbar").setScale(0.5);
        this.yolkBar = this.add.sprite(220, 40, "yolkbar").setScale(0.5);
        
        // a copy of the Yolk bar to be used as a mask.
        this.yolkMask = this.add.sprite(this.yolkBar.x, this.yolkBar.y, "yolkbar").setScale(0.5);
        this.yolkMask.visible = false;
        this.yolkBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.yolkMask);
 
        // a planned timer.
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.countDown,
            callbackScope: this,
            loop: true
        });


        // sudden event timer.
        if(this.hardMODE) {
            this.randomTime = Phaser.Math.Between(4,8);
        }else if(this.extremeMODE) {
            this.randomTime = Phaser.Math.Between(1,3);
        }else{
            this.randomTime = Phaser.Math.Between(9,12);
        }
        
        this.suddenTimer = this.add.text(80,660, this.randomTime+'S', {color: '#F9BB1F'});
        

        this.chopsticks = this.add.image(40,660, 'chopsticks').setScale(0.1);
        this.fork = this.add.image(40,660, 'fork').setScale(0.1);
        this.chopsticks.alpha = 0;
        this.fork.alpha = 0;

        suddentype = Phaser.Math.RND.pick(['chopsticks', 'fork']);
//console.log("expected sudden:"+suddentype);
        if(suddentype == 'chopsticks') {
            this.chopsticks.alpha = 1;
            
        }else if(suddentype == 'fork') {
            this.fork.alpha = 1;
        }

        this.countdownE = this.time.addEvent({ 
            delay: 1000, 
            callback: this.timerE, 
            callbackScope: this, 
            repeat: this.randomTime-1
        });
        this.suddenEvent = this.time.addEvent({ 
            delay: this.randomTime * 1000, 
            callback: this.addSudden, 
            callbackScope: this
        });
    }

    addBarrier() {
        let barrier = new Barrier(this, this.barrierSpeed, Phaser.Math.RND.pick(['plate', 'soysauce', 'teapot', 'porkbunsteamer', 'shrimpdumplingsteamer'])).setScale(0.3).setOrigin(0.5, 0.5);     // create new barrier
        //barrier.body.setCircle(190, 260, 230);
        this.barrierGroup.add(barrier);                         // add it to existing group
    }

    addPowerups() {
        let powerup = null;
        let spawnChance = Math.random();
        if(spawnChance <= 0.2) {
            powerup = 'gooey';
        }else if(spawnChance <= 0.95) {
            powerup = 'normal';
        }else {
            powerup = 'runny';
        } 
        powerups = new Powerups(this, -500, powerup).setScale(0.1).setOrigin(1,1);     // create new barrier
        powerups.body.setCircle(190, 260, 230);
        this.powerupsGroup.add(powerups);                         // add it to existing group
    }
    
    suddenE() {
        //console.log('sudden in function ='+suddentype);
        if(suddentype == 'chopsticks') {
            
            sudden = new Sudden(this, 500, 0, Phaser.Math.Between(0+200, game.config.height - 200), 'ChopstickHand').setScale(0.5).setOrigin(0.5,0.5);     // create new barrier
        }else if(suddentype == 'fork') {
            sudden = new Sudden(this, -500, Phaser.Math.Between(0+150, game.config.width - 150), Phaser.Math.RND.pick([0, game.config.height]), 'ForkHand').setScale(0.5).setOrigin(0.5,0.5);     // create new barrier
        }
        
        //sudden.body.setCircle(190, 260, 230);
        this.suddenGroup.add(sudden);                         // add it to existing group
    }

    countDown() {
        this.timeLeft --;
 
        // dividing enery bar width by the number of seconds gives us the amount
        // of pixels we need to move the energy bar each second
        //let stepWidth = this.energyMask.displayWidth / gameOptions.initialTime;
        let stepWidth = this.yolkMask.displayWidth / 50;
        // moving the mask
        this.yolkMask.x -= stepWidth;
        if(this.timeLeft <= 0){
             // kill paddle
              bun.destroy();              
             // switch states after timer expires
              this.time.delayedCall(1000, () => { this.scene.start('gameOverScene'); });
            //this.scene.start('gameOverScene');
        }
    }

    timerE() {
        //console.log("actual random:"+this.randomTime);
        this.randomTime -= 1;
        if(this.randomTime > 0) {
            this.suddenTimer.text = this.randomTime+'S';
        }else {
            this.suddenTimer.text = 'NOW!';
        }
        
    }

    addSudden() {
        
        this.suddenE();
        suddentype = Phaser.Math.RND.pick(['chopsticks', 'fork']);
        //console.log("new sudden:"+suddentype);
        if(suddentype == 'chopsticks') {
            this.chopsticks.alpha = 1;
            this.fork.alpha = 0;
        }else if(suddentype == 'fork') {
            this.chopsticks.alpha = 0;
            this.fork.alpha = 1;
        }
        if(this.hardMODE) {
            this.randomTime = Phaser.Math.Between(4,8);
        }else if(this.extremeMODE) {
            this.randomTime = Phaser.Math.Between(1,3);
        }else{
            this.randomTime = Phaser.Math.Between(9,12);
        }
        //console.log("new random:"+this.randomTime);
        this.suddenTimer.text = this.randomTime+'S';
        this.countdownE.remove();
        this.countdownE = this.time.addEvent({
            delay: 1000, 
            callback: this.timerE, 
            callbackScope: this, 
            repeat: this.randomTime-1
        })
        this.suddenEvent.remove();
        this.suddenEvent = this.time.addEvent({ 
            delay: this.randomTime * 1000,
            callback: this.addSudden, 
            callbackScope: this
        });
        
    }

    update() {
        //bun.anims.play('walk', true);
        this.boom.x = bun.x;
        this.boom.y = bun.y;
        //console.log(paddle.y-(paddle.height/2));
        this.background.tilePositionX += 4;

        if(this.timeLeft>0) {
            // check for player input
            if(cursors.up.isDown && bun.y >= 48) {
                bun.body.velocity.y -= paddleVelocity;
            } else if(cursors.down.isDown && bun.y <= 600) {
                bun.body.velocity.y += paddleVelocity;
            } else if(cursors.left.isDown) {
                bun.setVelocityX(-paddleVelocity);
                bun.anims.play('walk', true);
                //bun.body.velocity.x -= paddleVelocity;
            } else if(cursors.right.isDown) {
                bun.setVelocityX(paddleVelocity);
                bun.anims.play('walk', true);
                //bun.body.velocity.x += paddleVelocity;
            } else {
                bun.body.setDragX(1200);
                bun.body.setDragY(1200);
            }
            // check for collisions
            this.physics.world.collide(bun, this.barrierGroup, this.barrierCollision, null, this);
            this.physics.world.collide(bun, this.suddenGroup, this.barrierCollision, null, this);

            this.physics.add.overlap(bun, powerups, this.powerupsCollision, null, this);
        }

        // spawn rainbow trail if in EXTREME mode
        //if(this.extremeMODE && !this.shadowLock && !bun.destroyed) {
        if(!this.shadowLock && this.extremeMODE) {
            this.spawnShadowPaddles();
            this.shadowLock = true;
            // lock shadow bun spawning to a given time interval
            this.time.delayedCall(15, () => { this.shadowLock = false; })
        }
    }

    levelBump() {
        // increment level (aka score)
        level++;

        // bump speed every 5 levels
        if(level % 5 == 0) {
            //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
            //this.sound.play('clang', { volume: 0.75 });         // play clang to signal speed up
            if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
                this.barrierSpeed -= 25;
                //this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
            }
        }
        // set HARD mode
        if(level == 45) {
            this.hardMODE = true;
        }
        // set EXTREME mode
        if(level == 75) {
            //paddle.scaleY = 0.5;
            this.hardMODE = true;
            this.extremeMODE = true;
        }
    }

    spawnShadowPaddles() {
        // add a "shadow paddle" at main paddle position
        let shadowPaddle = this.add.image(bun.x, bun.y, 'bun').setOrigin(0.5);
        shadowPaddle.scaleX = bun.scaleX;
        shadowPaddle.scaleY = bun.scaleY;            // scale to parent paddle
        //shadowPaddle.tint = Math.random() * 0xFFFFFF;   // tint w/ rainbow colors
        shadowPaddle.tint = 0xF9BB1F;

        shadowPaddle.alpha = 0.5;                       // make semi-transparent
        // tween alpha to 0
        this.tweens.add({ 
            targets: shadowPaddle, 
            alpha: { from: 0.5, to: 0 }, 
            duration: 750,
            ease: 'Linear',
            repeat: 0 
        });
        // set a kill timer for trail effect
        this.time.delayedCall(750, () => { shadowPaddle.destroy(); } );
    }

    barrierCollision() {
        //console.log("time before:"+this.timeLeft);
        this.timeLeft -= 4;
        //console.log("time after:"+this.timeLeft);
        this.yolkMask.x -= 4 * this.yolkMask.displayWidth / (50);
        //this.gameTimer.remove();
        // this.gameTimer = this.time.addEvent({
        //     delay: 1000,
        //     callback: this.countDown,
        //     callbackScope: this,
        //     loop: true
        // });
        //paddle.destroyed = true;                    // turn off collision checking
        this.difficultyTimer.destroy();             // shut down timer
        //this.sound.play('death', { volume: 0.5 });  // play death sound
        // create tween to fade out audio
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });

        // create particle explosion
        // let deathParticles = this.add.particles('fragment');
        // let deathEmitter = deathParticles.createEmitter({
        //     alpha: { start: 1, end: 0 },
        //     scale: { start: 0.75, end: 0 },
        //     speedX: { min: -50, max: 500 },
        //     speedY: { min: -500, max: 500 },
        //     lifespan: 1500
        // });

        // make it boom 💥
        //deathEmitter.explode(150, paddle.x, paddle.y);
        // kill paddle
        //paddle.destroy();              
        // switch states after timer expires
        //this.time.delayedCall(3000, () => { this.scene.start('gameOverScene'); });
    }

    powerupsCollision(bun, powerups){

        powerups.sfxpower.play();
        powerups.disableBody(true, true);
        this.time.delayedCall(3000, () => {
            this.addPowerups();
        }, null, this);
        
        //this.powerupsGroup.remove(powerups, true);
        
        //console.log(powerups.eat);
        //console.log('type:'+powerups.functionality);
        if(powerups.functionality==='normal') {
            //console.log("things:"+this.add.displayList);
            //this.add.displayList.removeAll();
            //if(this.barrierGroup.children.isOnScreen())
            //console.log("powerups.eat:"+powerups.eat);
            //this.barrierGroup.killAndHide(this.barrierGroup.getChildren()[0]);
            //this.barrierGroup.remove(this.barrierGroup.getChildren()[1], true);
            
                //this.barrierGroup.clear(true);
            this.yolkBar.alpha = 0.8;
            this.gameTimer.paused = true;
            this.time.delayedCall(3000, () => {
                this.yolkBar.alpha = 1;
                this.gameTimer.paused = false;
            }, null, this);
        }else if(powerups.functionality==='gooey') {
            console.log("gooey");
            this.boom.alpha = 1;
        }else if(powerups.functionality==='runny') {
            console.log("runny");
            this.background.tilePositionX += 10;

            //bun.setVelocityX(paddleVelocity * 8);
        }else {
            for(var i = this.barrierGroup.getChildren().length - 1; i >= 0; --i) { 
                //console.log(i);
                //console.log("number of new barriers:"+this.barrierGroup.getChildren().length);
                this.barrierGroup.remove(this.barrierGroup.getChildren()[i], true);
            }

            this.time.delayedCall(3000, () => {
                this.addBarrier();
            }, null, this);
            
        }
        // if(this.physics.add.overlap(paddle, this.powerupsGroup)){
        //     
        // }

    }
}