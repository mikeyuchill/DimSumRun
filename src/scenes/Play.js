class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        // reset parameters
        this.barrierSpeed = -150;
        this.barrierSpeedMax = -1000;
        level = 0;
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

        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'talltrees').setOrigin(0);

        // set up paddle (physics sprite)
        paddle = this.physics.add.sprite(32, centerY, 'paddle').setOrigin(0.5);
        var customBounds = new Phaser.Geom.Rectangle(0, 98, 800, 540);
        paddle.body.setBoundsRectangle(customBounds);
        paddle.setCollideWorldBounds(true);
        
        paddle.setBounce(0.5);
        paddle.setImmovable();
        paddle.setMaxVelocity(600, 600);
        //paddle.setDragY(200);
        paddle.setDepth(1);         // ensures that paddle z-depth remains above shadow paddles
        paddle.destroyed = false;   // custom property to track paddle life

        // set up barrier group and add first barrier to kick things off
        this.barrierGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        this.addBarrier();

        // set up difficulty timer (triggers callback every second)
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        this.timeLeft = 50;
 
        // the Yolk Bar container.
        let energyContainer = this.add.sprite(180, 40, "energycontainer").setScale(0.5);
 
        // the actual Yolk Bar.
        let energyBar = this.add.sprite(energyContainer.x + 23, energyContainer.y, "energybar").setScale(0.5);
        
        // a copy of the Yolk bar to be used as a mask.
        this.energyMask = this.add.sprite(energyBar.x, energyBar.y, "energybar").setScale(0.5);
        this.energyMask.visible = false;
        energyBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.energyMask);
 
        // a planned timer.
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.countDown,
            callbackScope: this,
            loop: true
        });
    }

    addBarrier() {
        let barrier = new Barrier(this, this.barrierSpeed).setScale(0.1).setOrigin(1,1);     // create new barrier
        barrier.body.setCircle(190, 260, 230);
        this.barrierGroup.add(barrier);                         // add it to existing group
    }

    countDown() {
        this.timeLeft --;
 
                // dividing enery bar width by the number of seconds gives us the amount
                // of pixels we need to move the energy bar each second
                //let stepWidth = this.energyMask.displayWidth / gameOptions.initialTime;
 //console.log(this.energyMask.displayWidth);
                let stepWidth = this.energyMask.displayWidth / 50;
                // moving the mask
                this.energyMask.x -= stepWidth;
                if(this.timeLeft <= 0){
                    //this.scene.start('gameOverScene');
                }
    }
    update() {
        console.log(paddle.y-(paddle.height/2));
        this.background.tilePositionX += 4;

        if(this.timeLeft>0) {
            // check for player input
            if(cursors.up.isDown && paddle.y >= 48) {
                paddle.body.velocity.y -= paddleVelocity;
            } else if(cursors.down.isDown && paddle.y <= 600) {
                paddle.body.velocity.y += paddleVelocity;
            } else if(cursors.left.isDown) {
                paddle.setVelocityX(-paddleVelocity);
                //paddle.body.velocity.x -= paddleVelocity;
            } else if(cursors.right.isDown) {
                paddle.setVelocityX(paddleVelocity);
                //paddle.body.velocity.x += paddleVelocity;
            } else {
                paddle.body.setDragX(1200);
                paddle.body.setDragY(1200);
            }
            // check for collisions
            this.physics.world.collide(paddle, this.barrierGroup, this.paddleCollision, null, this);

            //this.physics.add.overlap(paddle, this.)
        }

        // spawn rainbow trail if in EXTREME mode
        if(this.extremeMODE && !this.shadowLock && !paddle.destroyed) {
            this.spawnShadowPaddles();
            this.shadowLock = true;
            // lock shadow paddle spawning to a given time interval
            this.time.delayedCall(15, () => { this.shadowLock = false; })
        }
    }

    levelBump() {
        // increment level (aka score)
        level++;

        // bump speed every 5 levels
        // if(level % 5 == 0) {
        //     //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
        //     this.sound.play('clang', { volume: 0.75 });         // play clang to signal speed up
        //     if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
        //         this.barrierSpeed -= 25;
        //         this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
        //     }
        // }
        // set HARD mode
        if(level == 45) {
            paddle.scaleY = 0.75;
        }
        // set EXTREME mode
        if(level == 75) {
            paddle.scaleY = 0.5;
            this.extremeMODE = true;
        }
    }

    spawnShadowPaddles() {
        // add a "shadow paddle" at main paddle position
        let shadowPaddle = this.add.image(paddle.x, paddle.y, 'paddle').setOrigin(0.5);
        shadowPaddle.scaleY = paddle.scaleY;            // scale to parent paddle
        shadowPaddle.tint = Math.random() * 0xFFFFFF;   // tint w/ rainbow colors
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

    paddleCollision() {
        console.log("time before:"+this.timeLeft);
        this.timeLeft -= 4;
        console.log("time after:"+this.timeLeft);
        this.energyMask.x -= 4 * this.energyMask.displayWidth / (50);
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
        let deathParticles = this.add.particles('fragment');
        let deathEmitter = deathParticles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speedX: { min: -50, max: 500 },
            speedY: { min: -500, max: 500 },
            lifespan: 1500
        });

        // make it boom 💥
        deathEmitter.explode(150, paddle.x, paddle.y);
        // kill paddle
        //paddle.destroy();              
        // switch states after timer expires
        //this.time.delayedCall(3000, () => { this.scene.start('gameOverScene'); });
    }

    // addTime(){
        
    // }
}