export default class EnablableManager {
    
    constructor()
    {
        this.enablables = [];
    }

    destroy()
    {
        this.enablables = null;
    }

    register(enablable)
    {
        this.enablables.push(enablable);
    }
    deregister(enablable)
    {
        var idx = this.enablables.indexOf(enablable);
        if( idx > -1 ) this.enablables.splice(idx,1);
    }

    enable()
    {
        this.enablables.forEach((obj,idx)=>{ obj.enable(); });
    }
    disable()
    {
        this.enablables.forEach((obj,idx)=>{ obj.disable(); });
    }

}