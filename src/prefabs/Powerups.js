class Powerups extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, velocity, functionality) {
       // call Phaser Physics Sprite constructor
       super(scene, game.config.width + paddleWidth, Phaser.Math.Between(100, 520), functionality);
       
       // set up physics sprite

       scene.add.existing(this);               // add to existing scene, displayList, updateList
       scene.physics.add.existing(this);       // add physics body
       if(functionality == 'runny') {
        //this.setBounceY(1);
        this.setVelocity(-300, Phaser.Math.RND.pick([300, -300]));
        this.setCollideWorldBounds(true, true, true);
        // scene.time.delayedCall(3000, () => {
        //     this.destroy();
        //     scene.addPowerups(this.parent, this.velocity);
        // }, null, this); 
      }else{
       this.setVelocityX(velocity);  
        }          // make it go!
       this.setImmovable();                    
       //this.tint = Math.random() * 0xFFFFFF;   // randomize tint
       this.newNormal = true;                 // custom property to control barrier spawning

       this.functionality = functionality;
       this.scene = scene;
       this.velocity = velocity;
       this.sfxpower = scene.sound.add('Effect').setVolume(0.1); // add powerup sfx
       
   }

   update() {
       // override physics sprite update()
       super.update();

       //console.log(this.eat);
       // add new barrier when existing barrier hits center X
       if((this.newNormal && this.x < 0)) {
           this.newNormal = false;
           // call parent scene method from this context
           this.scene.addPowerups(this.parent, this.velocity);
       }

       // destroy paddle if it reaches the left edge of the screen
       if(this.x < -this.width) {
           this.destroy();
       }
   }
}