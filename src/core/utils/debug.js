export var debugOpts = {
    verbose: true
};

export class Logger {
    static log(...args)
    {
        if( debugOpts.verbose ) console.log.apply(this,args);
    }
}

