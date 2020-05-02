class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set up loading bar (to-do)

        // load graphics assets
        this.load.image('bun', './assets/img/bun.png');
        this.load.image('runnyspritesheet', './assets/img/runnyspritesheet.png');
        this.load.image('paddle', './assets/img/paddle.png');
        this.load.image('fragment', './assets/img/fragment.png');
        this.load.image('yolkcontainer', './assets/img/yolkcontainer.png');
        this.load.image('yolkbar', './assets/img/yolkbar.png');
        this.load.image('talltrees', './assets/img/talltrees.png');
        this.load.image('ChopstickHand', './assets/img/ChopstickHand.png');
        this.load.image('ForkHand', './assets/img/ForkHand.png');
        this.load.image('chopsticks', './assets/img/chopsticks.png');
        this.load.image('fork', './assets/img/fork.png');
        // this.load.spritesheet("coin", "coin.png", {
        //     frameWidth: 20,
        //     frameHeight: 20
        // });
        this.load.image('normal', './assets/img/normal.png');
        this.load.image('gooey', './assets/img/gooey.png');
        this.load.image('runny', './assets/img/runny.png');
        // load audio assets
        // this.load.audio('beats', ['./assets/audio/beats.mp3']);
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