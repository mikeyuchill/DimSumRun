class Instruction extends Phaser.Scene {
   constructor() {
       super('instruction');
   }

   create() {
       this.instruction = this.add.image(centerX, centerY, 'howtoplay').setScale(0.19).setOrigin(0.5,0.5);
       this.instruction2 = this.add.image(centerX, centerY, 'howtoplay2').setScale(0.19).setOrigin(0.5,0.5);
       this.instruction2.alpha = 0;
       // add title screen text
       // this.add.text(centerX, centerY, 'Dim Sum Run', { fontFamily: 'Helvetica', fontSize: '48px', color: '#F9BB1F' }).setOrigin(0.5);
       // this.add.text(centerX, centerY + textSpacer, 'Use the UP + DOWN ARROWS to dodge color paddles and avoid getting REKT', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);
       // this.add.text(centerX, centerY + textSpacer*2, 'Press UP ARROW to Start', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);

       // set up cursor keys
       cursors = this.input.keyboard.createCursorKeys();
       this.isView = false;
   }

   update() {
       // check for UP input
       if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        this.sound.play('Bling', { volume: 0.5});
           this.scene.start('playScene');
       }else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        this.sound.play('Bling', { volume: 0.5});
         this.instruction.alpha = 0;
         this.instruction2.alpha = 1;
         this.isView = true;
       }
       if (Phaser.Input.Keyboard.JustDown(cursors.left) && this.isView) {
        this.sound.play('Bling', { volume: 0.5});
        this.instruction.alpha = 1;
         this.instruction2.alpha = 0;
         this.isView = false;
        }

   }
}