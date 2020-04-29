class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set up loading bar (to-do)

        // load graphics assets
        this.load.image('paddle', './assets/img/paddle.png');
        this.load.image('fragment', './assets/img/fragment.png');
        this.load.image('energycontainer', './assets/img/energycontainer.png');
        this.load.image('energybar', './assets/img/energybar.png');
        this.load.image('talltrees', './assets/img/talltrees.png');
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