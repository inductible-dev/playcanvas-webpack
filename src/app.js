import Launcher from './core/launcher.js';
import globals from './core/globals.js';

import { debugOpts } from './core/utils/debug.js';
debugOpts.verbose = true;

import BaseScene from './app/scenes/basescene.js';

import BootScene from './app/scenes/boot/bootscene.js';
import ExplodeScene from './app/scenes/explode/explodescene.js';

let appOpts = {
    ASSET_PREFIX: "",
    SCRIPT_PREFIX: "",
    CONTEXT_OPTIONS: {
        'antialias': true,
        'alpha': false,
        'preserveDrawingBuffer': false,
        'preferWebGl2': true,
        'powerPreference': "default"
    },
    CONFIG_FILENAME: "config.json",
    BOOT_SCENE_PATH: "scenes/explode/scene.json",
    SCRIPTS: [],
    INPUT_SETTINGS: {
        useKeyboard: true,
        useMouse: true,
        useGamepads: false,
        useTouch: true
    },
    CONTAINER_ID: "",
    CANVAS_ID: 'application-canvas'
}
Launcher.init(appOpts);

globals.app.once('start',()=>{

    // init scenes
    //globals.sceneManager.register(new BootScene('scenes/boot/scene.json'));
    //globals.sceneManager.register(new ExplodeScene('scenes/explode/scene.json'));
    /*setTimeout( ()=>{ 
        globals.sceneManager.pushScene('ExplodeScene'); 
        setTimeout( ()=>{ globals.sceneManager.popScene(); }, 3000 );
    }, 3000 );*/

    globals.sceneManager.register(new BaseScene('s1','scenes/scene1/scene.json'));
    globals.sceneManager.register(new BaseScene('s2','scenes/scene2/scene.json'));

    // boot
    globals.sceneManager.setScene('s1');

    setTimeout( ()=>{ 
        globals.sceneManager.pushScene('s2'); 
        setTimeout( ()=>{ globals.sceneManager.popScene(); }, 3000 );
    }, 3000 );
    
    
    
})