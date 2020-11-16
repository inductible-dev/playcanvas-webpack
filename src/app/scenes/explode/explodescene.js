import globals from '../../../core/globals.js';

import { Logger } from '../../../core/utils/debug.js';

import ApplicationBaseScene from '../basescene.js';

export default class ExplodeScene extends ApplicationBaseScene {
    
    constructor(jsonPath)
    {
        super('ExplodeScene',jsonPath);
    }    

    enable()
    {
        Logger.log('enable ExplodeScene');
        super.enable();
    }
    disable()
    {
        Logger.log('disable ExplodeScene');
        super.disable();        
    }    

    create()
    {
        super.create();  
        
        Logger.log('create ExplodeScene.');
        //globals.sceneManager.setScene("title");

        //setTimeout( ()=>{ globals.sceneManager.setScene('BootScene'); }, 3000 );
    }
    shutdown()
    {
        Logger.log('shutdown ExplodeScene.');
        super.shutdown();        
    }

    update()
    {
        Logger.log('update ExplodeScene.');
        super.update();        
    }

}