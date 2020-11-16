import globals from '../../../core/globals.js';

import { Logger } from '../../../core/utils/debug.js';

import ApplicationBaseScene from '../basescene.js';

export default class BootScene extends ApplicationBaseScene {
    
    constructor(jsonPath)
    {
        super('BootScene',jsonPath);
    }    

    enable()
    {
        Logger.log('enable BootScene');
        super.enable();
    }
    disable()
    {
        Logger.log('disable BootScene');
        super.disable();        
    }    

    create()
    {
        super.create();  
        
        Logger.log('create bootscene.');
        //globals.sceneManager.setScene("title");

        //setTimeout( ()=>{ globals.sceneManager.setScene('ExplodeScene'); }, 3000 );
    }
    shutdown()
    {
        Logger.log('shutdown bootscene.');
        super.shutdown();        
    }

    update()
    {
        Logger.log('update bootscene.');
        super.update();        
    }

}