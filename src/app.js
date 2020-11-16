import './style/reset.css';
import './style/main.css';

import * as pc from 'playcanvas';


const ASSET_PREFIX = "";
const SCRIPT_PREFIX = "";
const CONTEXT_OPTIONS = {
    'antialias': true,
    'alpha': false,
    'preserveDrawingBuffer': false,
    'preferWebGl2': true,
    'powerPreference': "default"
};
const CONFIG_FILENAME = "config.json";
const BOOT_SCENE_PATH = "scenes/boot/scene.json";
const SCRIPTS = [];
const INPUT_SETTINGS = {
    useKeyboard: true,
    useMouse: true,
    useGamepads: false,
    useTouch: true
};
pc.script.legacy = false;
const CANVAS_ID = 'application-canvas';

// initialise the application canvas element
const canvas = document.createElement('canvas');
canvas.setAttribute('id', CANVAS_ID);
canvas.setAttribute('tabindex', 0);
canvas.onselectstart = function () { return false; }; // Disable I-bar cursor on click+drag
document.body.appendChild(canvas);
//

const devices = {
    elementInput: new pc.ElementInput(canvas, {
        useMouse: INPUT_SETTINGS.useMouse,
        useTouch: INPUT_SETTINGS.useTouch
    }),
    keyboard: INPUT_SETTINGS.useKeyboard ? new pc.Keyboard(window) : null,
    mouse: INPUT_SETTINGS.useMouse ? new pc.Mouse(canvas) : null,
    gamepads: INPUT_SETTINGS.useGamepads ? new pc.GamePads() : null,
    touch: INPUT_SETTINGS.useTouch && pc.platform.touch ? new pc.TouchDevice(canvas) : null
};

const configureCss = (fillMode, width, height)=>{
    // Configure resolution and resize event
    if (canvas.classList) canvas.classList.add('fill-mode-' + fillMode);

    // css media query for aspect ratio changes
    var css  = "@media screen and (min-aspect-ratio: " + width + "/" + height + ") {";
    css += "    #application-canvas.fill-mode-KEEP_ASPECT {";
    css += "        width: auto;";
    css += "        height: 100%;";
    css += "        margin: 0 auto;";
    css += "    }";
    css += "}";

    // append css to style
    if (document.head.querySelector) {
        document.head.querySelector('style').innerHTML += css;
    }
};

const reflow = ()=>{
    app.resizeCanvas(canvas.width, canvas.height);
    canvas.style.width = '';
    canvas.style.height = '';

    var fillMode = app._fillMode;

    if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
        if ((fillMode == pc.FILLMODE_NONE && canvas.clientHeight < window.innerHeight) || (canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
            canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
        } else {
            canvas.style.marginTop = '';
        }
    }
};

const displayError = (html)=>{
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

let app;
try {
    app = new pc.Application(canvas, {
        elementInput: devices.elementInput,
        keyboard: devices.keyboard,
        mouse: devices.mouse,
        gamepads: devices.gamepads,
        touch: devices.touch,
        graphicsDeviceOptions: CONTEXT_OPTIONS,
        assetPrefix: ASSET_PREFIX || "",
        scriptPrefix: SCRIPT_PREFIX || "",
        scriptsOrder: SCRIPTS || []
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

app.configure( CONFIG_FILENAME, (err)=>{
    if (err) console.error(err);

    configureCss(app._fillMode, app._width, app._height);

    // do the first reflow after a timeout because of
    // iOS showing a squished iframe sometimes
    setTimeout( ()=>{
        reflow();

        window.addEventListener('resize', reflow, false);
        window.addEventListener('orientationchange', reflow, false);

        app.preload(function (err) {
            if (err) console.error(err);
            
            app.loadScene(BOOT_SCENE_PATH, function (err, scene) {
                if (err) console.error(err);

                app.start();
            });
        });
    });
});