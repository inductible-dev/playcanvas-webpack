import globals from '../globals.js';
import { Logger } from '../utils/debug.js';

export const SceneState = Object.freeze({
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
});

export default class BaseScene {
    
    constructor(label,jsonPath)
    {
        globals.app.scenes.add(label,jsonPath); // integrate with playcanvas' own scenemanagement

        this.label = label;
        this.jsonPath = jsonPath;

        this.rootEntity = null;

        this.state = SceneState.INACTIVE;

        this.enabled = false;

        this.isCreated = false;
    }

    destroy()
    {
        if( this.state != SceneState.INACTIVE ) this.deactivate();
    }

    activate()
    {
        if( this.state == SceneState.INACTIVE ) 
        {
            this.state = SceneState.ACTIVE;
            
            globals.app.scenes.loadSceneHierarchy( this.jsonPath, (err, parent)=>{
                if (err) console.error(err);

                this.rootEntity = parent;

                console.log('this.rootEntity',this.rootEntity);
                this.create();
            });
        }
        else throw new Error('Scene is in an incorrect state');
    }
    deactivate()
    {
        this.state = SceneState.INACTIVE;

        this.disable();
        this.shutdown();     
    }

    enable()
    {
        this.enabled = true;
        this.setUpdate(true);
    }
    disable()
    {
        this.enabled = false;
        this.setUpdate(false);
    }   

    create()
    {
        this.isCreated = true;
    }
    update(delta)
    {        
        //
    }
    shutdown()
    {
        this.isCreated = false;

        this.rootEntity.destroy();
    }   

    setUpdate(val)
    {
        if( val ) globals.app.on('update',this.update,this);
        else globals.app.off('update',this.update,this);
    }    

}