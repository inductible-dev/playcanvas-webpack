/**
 * Bowser {@link https://github.com/lancedikson/bowser}
 */
import Bowser from "bowser/src/bowser.js";

const browserInfo = Bowser.getParser(window.navigator.userAgent);
const name = browserInfo.getBrowserName();
const version = browserInfo.getBrowserVersion();
const isSilk = name === "Amazon Silk";

export {
    browserInfo,
    name,
    version,
    isSilk
}
