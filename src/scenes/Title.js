class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        this.add.image(centerX, centerY, 'menu').setScale(0.8).setOrigin(0.5,0.5);
        // add title screen text
        this.add.text(centerX, centerY, 'Dim Sum Run', { fontFamily: 'Helvetica', fontSize: '48px', color: '#F9BB1F' }).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Use the UP + DOWN ARROWS to dodge color paddles and avoid getting REKT', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*2, 'Press UP ARROW to Start', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // check for UP input
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('playScene');
        }
    }
}