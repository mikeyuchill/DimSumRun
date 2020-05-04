class People extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, velocity, image, type) {
       //this.type = Phaser.Math.RND.pick(['normal', 'gooey', 'runny'])
       // call Phaser Physics Sprite constructor
       super(scene, game.config.width + paddleWidth, 550, image, type); 

       
      //console.log('object is:'+type);

       //console.log('object is:'+Phaser.Physics.Arcade.Sprite.texture);
       // set up physics sprite
       scene.add.existing(this);               // add to existing scene, displayList, updateList
       scene.physics.add.existing(this);       // add physics body
       this.setVelocityX(velocity);            // make it go!
       this.setImmovable();                    
       //this.tint = Math.random() * 0xFFFFFF;   // randomize tint
       this.newBarrier = true;                 // custom property to control barrier spawning

       this.scene = scene;
       this.velocity = velocity;
   }

   update() {
       // override physics sprite update()
       super.update();

       // add new barrier when existing barrier hits center X
       if(this.newBarrier && this.x < 0) {
       //if(this.newBarrier) {
           this.newBarrier = false;
           // call parent scene method from this context
           this.scene.addPeople(this.parent, this.velocity);
       }

       // destroy paddle if it reaches the left edge of the screen
       if(this.x < -this.width) {
           this.destroy();
       }
   }
}