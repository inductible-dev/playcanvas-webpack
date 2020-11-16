import './style/reset.css';
import './style/main.css';

import * as pc from 'playcanvas';

import globals from './globals.js';

import SceneManager from './utils/scenemanager.js';

let instance = null;

export default class Launcher {
    
    constructor(appOpts)
    {
        if( instance ) throw new Error('Can only instantiate one Application!');

        pc.script.legacy = false;        

        // initialise the application canvas element
        let canvas = this.canvas = globals.canvas = document.createElement('canvas');
        canvas.setAttribute('id', appOpts.CANVAS_ID);
        canvas.setAttribute('tabindex', 0);
        canvas.onselectstart = () => false; // Disable I-bar cursor on click+drag
        if( appOpts.CONTAINER_ID && document.getElementById(appOpts.CONTAINER_ID) ) document.getElementById(appOpts.CONTAINER_ID).appendChild(canvas);
        else document.body.appendChild(canvas);
        //

        const devices = {
            elementInput: new pc.ElementInput(canvas, {
                useMouse: appOpts.INPUT_SETTINGS.useMouse,
                useTouch: appOpts.INPUT_SETTINGS.useTouch
            }),
            keyboard: appOpts.INPUT_SETTINGS.useKeyboard ? new pc.Keyboard(window) : null,
            mouse: appOpts.INPUT_SETTINGS.useMouse ? new pc.Mouse(canvas) : null,
            gamepads: appOpts.INPUT_SETTINGS.useGamepads ? new pc.GamePads() : null,
            touch: appOpts.INPUT_SETTINGS.useTouch && pc.platform.touch ? new pc.TouchDevice(canvas) : null
        };

        try {
            this.app = globals.app = new pc.Application(canvas, {
                elementInput: devices.elementInput,
                keyboard: devices.keyboard,
                mouse: devices.mouse,
                gamepads: devices.gamepads,
                touch: devices.touch,
                graphicsDeviceOptions: appOpts.CONTEXT_OPTIONS,
                assetPrefix: appOpts.ASSET_PREFIX || "",
                scriptPrefix: appOpts.SCRIPT_PREFIX || "",
                scriptsOrder: appOpts.SCRIPTS || []
            });
        } catch (e) {
            if (e instanceof pc.UnsupportedBrowserError) {
                displayError('This page requires a browser that supports WebGL.<br/>' +
                        '<a href="http://get.webgl.org">Click here to find out more.</a>');
            } else if (e instanceof pc.ContextCreationError) {
                displayError("It doesn't appear your computer can support WebGL.<br/>" +
                        '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>');
            } else {
                displayError('Could not initialize application. Error: ' + e);
            }
        }

        this.boundReflow = this.reflow.bind(this);

        this.app.configure( appOpts.CONFIG_FILENAME, (err)=>{

            if (err) console.error(err);
        
            this.configureCss( this.app._fillMode, this.app._width, this.app._height );
        
            // do the first reflow after a timeout because of
            // iOS showing a squished iframe sometimes
            setTimeout( ()=>{

                this.reflow();
        
                window.addEventListener('resize', this.boundReflow, false);
                window.addEventListener('orientationchange', this.boundReflow, false);

                this.sceneManager = globals.sceneManager = SceneManager.init(this.app); // manages scenes and state changes
        
                // Load all assets in the asset registry that are marked as 'preload'
                this.app.preload( (err)=>{

                    if (err) console.error(err);                    
                    
                    this.app.start();
                });
            });
        });
        
        this.booted = false;
    }

    configureCss(fillMode, width, height)
    {
        if (this.canvas.classList) this.canvas.classList.add('fill-mode-' + fillMode);
    
        var css  = "@media screen and (min-aspect-ratio: " + width + "/" + height + ") {";
        css += "    #application-canvas.fill-mode-KEEP_ASPECT {";
        css += "        width: auto;";
        css += "        height: 100%;";
        css += "        margin: 0 auto;";
        css += "    }";
        css += "}";
    
        if (document.head.querySelector) document.head.querySelector('style').innerHTML += css;
    };

    reflow()
    {
        this.app.resizeCanvas(this.canvas.width, this.canvas.height);
        this.canvas.style.width = '';
        this.canvas.style.height = '';
    
        var fillMode = this.app._fillMode;    
        if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
            if ((fillMode == pc.FILLMODE_NONE && this.canvas.clientHeight < window.innerHeight) || (this.canvas.clientWidth / this.canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
                this.canvas.style.marginTop = Math.floor((window.innerHeight - this.canvas.clientHeight) / 2) + 'px';
            } else {
                this.canvas.style.marginTop = '';
            }
        }
    };

    displayError(html)
    {
        var div = document.createElement('div');
    
        div.innerHTML  = [
            '<table style="background-color: #8CE; width: 100%; height: 100%;">',
            '  <tr>',
            '      <td align="center">',
            '          <div style="display: table-cell; vertical-align: middle;">',
            '              <div style="">' + html + '</div>',
            '          </div>',
            '      </td>',
            '  </tr>',
            '</table>'
        ].join('\n');
    
        document.body.appendChild(div);
    };
    
    static init(appOpts)
    {
        return instance = new Launcher(appOpts);
    }

    static getInstance(appOpts)
    {
        return instance;
    }
    
}