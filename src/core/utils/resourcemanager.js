import * as PIXI from 'pixi.js-legacy'

import Signal from 'signals'

let singleton = null;

export default class ResourceManager {

    constructor(app)
    {
        if( singleton != null ) throw new Error('ResourceManager is a singleton - use ResourceManager.instance');

        this.app = app;        

        this.baseUrl = "";

        this.loader = PIXI.Loader.shared;

        this.progressSignal = new Signal();
        this.loadedSignal = new Signal();

        this.signalBinding_onProgress = null;
        this.signalBinding_onError = null;
        this.signalBinding_onLoad = null;
        this.signalBinding_onComplete = null;

        this.resources = [];
    }

    static getInstance()
    {
        if( !singleton ) throw new Error('ResourceManager must first be initialised - use ResourceManager.init');
        else return singleton;
    }

    static init(app)
    {
        singleton = new ResourceManager(app);
        return singleton;
    }

    add(path)
    {
        if( this.get(path) ) return; // asset is already available        

        this.loader.add( path, this.baseUrl + path );
    }

    get(key)
    {
        return this.loader.resources[key];
    }

    load()
    {
        this.addListeners();
        this.loader.load();
    }

    addListeners()
    {
        this.signalBinding_onProgress = this.loader.onProgress.add(()=>{this.onProgress()}); // called once per loaded/errored file
        this.signalBinding_onError = this.loader.onError.add(()=>{this.onError()}); // called once per errored file
        //this.signalBinding_onLoad = this.loader.onLoad.add(()=>{this.onLoad()}); // called once per loaded file
        this.signalBinding_onComplete = this.loader.onComplete.add(()=>{this.onComplete()}); // called once when the queued resources all load
    }
    removeListeners()
    {
        this.loader.onProgress.detach(this.signalBinding_onProgress);
        this.loader.onError.detach(this.signalBinding_onError);
        //this.loader.onLoad.detach(this.signalBinding_onLoad);
        this.loader.onComplete.detach(this.signalBinding_onComplete);
    }

    onError()
    {
        this.removeListeners();
        console.warn("ResourceManager load error");
    }

    onProgress()
    {
        this.progressSignal.dispatch(this.loader.progress);        
    }
    
    onLoad()
    {
        //
    }

    onComplete(val)
    {
        this.removeListeners();

        this.loadedSignal.dispatch(this.loader.resources);
    }

}

