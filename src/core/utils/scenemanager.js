import Signal from 'signals'

let singleton = null;

export default class SceneManager
{
    constructor(app)
    {
        if( singleton != null ) throw new Error('SceneManager is a singleton - use SceneManager.instance');

        this.app = app;

        this.scenesByLabel = new Map();
        this.sceneStack = [];
        this.events = [];

        this.app.on('update',this.update,this);

        this.sceneChanged = new Signal();
    }

    destroy()
    {
        this.app.off('update',this.update,this);

        this.purgeAllScenes(true);

        this.sceneStack = [];
        this.events = [];

        this.app = null;
        this.stage = null;

        this.sceneChanged.removeAll();
        this.sceneChanged = null;
    }

    static getInstance()
    {
        if( !singleton ) throw new Error('SceneManager must first be initialised - use SceneManager.init');
        else return singleton;
    }

    static init(app)
    {
        singleton = new SceneManager(app);
        return singleton;
    }

    register(scene,label=null)
    {
        this.scenesByLabel.set( label ? label : scene.label, scene);        
    }
    unregister(label)
    {
        if(this.scenesByLabel.has(label)) this.scenesByLabel.delete(label);        
    }

    enable()
    {
        let tScene = this.getCurrentSceneObj();
        if(tScene) tScene.enable();        
    }
    disable()
    {
        let tScene = this.getCurrentSceneObj();
        if(tScene) tScene.disable();
    }

    purgeAllScenes(destroy=true)
    {
        if( destroy) 
        {
            this.scenesByLabel.forEach((scene, key)=>{
                scene.destroy();
            });
        }
        
        this.scenesByLabel.clear();
        this.sceneStack = [];
    }

    setScene(label)
    {
        this.events.push({
            type: "SET",
            label: label
        });
    }

    pushScene(label)
    {
        this.events.push({
            type: "PUSH",
            label: label
        });
    }

    popScene()
    {
        this.events.push({
            type: "POP"
        });
    }

    getSceneNameByValue(searchValue) 
    {
        for(let [key, value] of this.scenesByLabel.entries()) 
        {
            if (value === searchValue)
            return key;
        }
    }

    getCurrentSceneLabel()
    {
        try{
            return this.getSceneNameByValue(this.getCurrentSceneObj());
        }catch(e){
            return null;
        }
    }

    getCurrentSceneObj()
    {
        return this.sceneStack[this.sceneStack.length-1];
    }

    getSceneWithLabel(label)
    {
        return this.scenesByLabel.get(label);
    }

    update()
    {
        // This update happens at the end of the frame - and triggers scene changes
        // This fixes errors with other updates causing destruction.
        if(this.events.length > 0){
            for(let i = 0; i < this.events.length; ++i){
                let currentScene = null;
                let nextScene = null;
                let label = this.events[i].label;

                switch(this.events[i].type)
                {
                // SET STATE ------------------
                case "SET":
                    
                    while(this.sceneStack.length){
                        let tScene = this.sceneStack.pop();
                        tScene.deactivate();
                    }

                    nextScene = label ? this.getSceneWithLabel(label) : null;

                    if(nextScene){
                        
                        this.sceneStack.push(nextScene);
                        nextScene.activate();
                        nextScene.enable();

                        this.sceneChanged.dispatch(label);
                    }else{
                        throw new Error("No Scene with label (" + label + ") is registered");
                    }
                    break;
                // PUSH STATE ------------------
                case "PUSH":
                    if(this.getCurrentSceneLabel() == label){ 
                        throw new Error("Caught attempt to PUSH a scene over itself");
                        break;
                    }

                    currentScene = this.getCurrentSceneObj();
                    nextScene = label ? this.getSceneWithLabel(label) : null;
                    if(currentScene) currentScene.disable();
                    
                    if(nextScene){
                        this.sceneStack.push(nextScene);
                        nextScene.activate();
                        nextScene.enable();

                        this.sceneChanged.dispatch(label);
                    }else{
                        throw new Error("Cannot push scene with label: " + label);
                    }
                    break;
                // POP STATE ------------------
                case "POP":
                    currentScene = this.sceneStack.pop();
                    if(currentScene) currentScene.deactivate();
                    else break;

                    nextScene = this.getCurrentSceneObj();
                    if(nextScene) nextScene.enable();
                    
                    this.sceneChanged.dispatch(label);
                    break;
                }
            }

            this.events = []; // reset events
        }
    }    
    
}
