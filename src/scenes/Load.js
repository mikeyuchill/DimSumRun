class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set up loading bar (to-do)

        // load graphics assets
        //this.load.image('bun', './assets/img/bun.png');
        this.load.atlas('bun', './assets/img/bun.png', './assets/img/bun.json');
        //this.load.spritesheet('gooeyspritesheet', './assets/img/gooeyspritesheet.png', {frameWidth: 612, frameHeight: 186, startFrame: 0, endFrame: 2});
        this.load.spritesheet('gooeyspritesheet', './assets/img/gooeyspritesheet.png', {frameWidth: 1375, frameHeight: 450, startFrame: 0, endFrame: 2});
        this.load.image('paddle', './assets/img/paddle.png');
        this.load.image('fragment', './assets/img/fragment.png');
        this.load.image('yolkcontainer', './assets/img/yolkcontainer.png');
        this.load.image('yolkbar', './assets/img/yolkbar.png');
        this.load.image('table', './assets/img/table.png');
        this.load.image('ChopstickHand', './assets/img/ChopstickHand.png');
        this.load.image('ForkHand', './assets/img/ForkHand.png');
        this.load.image('chopsticks', './assets/img/chopsticks.png');
        this.load.image('fork', './assets/img/fork.png');
        this.load.image('plate', './assets/img/plate.png');
        this.load.image('soysauce', './assets/img/soysauce.png');
        this.load.image('teapot', './assets/img/teapot.png');
        this.load.image('porkbunsteamer', './assets/img/porkbunsteamer.png');
        this.load.image('shrimpdumplingsteamer', './assets/img/shrimpdumplingsteamer.png');
        // this.load.spritesheet("coin", "coin.png", {
        //     frameWidth: 20,
        //     frameHeight: 20
        // });
        this.load.image('normal', './assets/img/normal.png');
        this.load.image('gooey', './assets/img/gooey.png');
        this.load.image('runny', './assets/img/runny.png');
        this.load.image('menu', './assets/img/menu.png');
        this.load.image('howtoplay', './assets/img/howtoplay.png');
        this.load.image('howtoplay2', './assets/img/howtoplay2.png');
        this.load.image('endgame', './assets/img/endgame.png');

        // load audio assets
        this.load.audio('Effect', ['./assets/audio/Effect.m4a']);
        // this.load.audio('clang', ['./assets/audio/clang.mp3']);
        // this.load.audio('death', ['./assets/audio/death.mp3']);
    }

    create() {
        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        // go to Title scene
        this.scene.start('titleScene');
    }
}