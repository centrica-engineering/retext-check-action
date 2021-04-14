/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3625:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(4803);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 9326:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(3625);
const file_command_1 = __nccwpck_require__(7576);
const utils_1 = __nccwpck_require__(4803);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 7576:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(4803);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 4803:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 710:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
const fs_1 = __nccwpck_require__(5747);
const os_1 = __nccwpck_require__(2087);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 245:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(710));
const utils_1 = __nccwpck_require__(4532);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 8847:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__nccwpck_require__(1690));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4532:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(710));
const Utils = __importStar(__nccwpck_require__(8847));
// octokit + plugins
const core_1 = __nccwpck_require__(168);
const plugin_rest_endpoint_methods_1 = __nccwpck_require__(517);
const plugin_paginate_rest_1 = __nccwpck_require__(2216);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1690:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(369);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(5964);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 369:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 6950:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 168:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var universalUserAgent = __nccwpck_require__(3443);
var beforeAfterHook = __nccwpck_require__(3374);
var request = __nccwpck_require__(4038);
var graphql = __nccwpck_require__(6826);
var authToken = __nccwpck_require__(6950);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const VERSION = "3.4.0";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const {
        authStrategy
      } = options,
            otherOptions = _objectWithoutProperties(options, ["authStrategy"]);

      const auth = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        // we pass the current octokit instance as well as its constructor options
        // to allow for authentication strategies that return a new octokit instance
        // that shares the same internal state as the current one. The original
        // requirement for this was the "event-octokit" authentication strategy
        // of https://github.com/probot/octokit-auth-probot.
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 7897:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var isPlainObject = __nccwpck_require__(3691);
var universalUserAgent = __nccwpck_require__(3443);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject.isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.11";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6826:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var request = __nccwpck_require__(4038);
var universalUserAgent = __nccwpck_require__(3443);

const VERSION = "4.6.1";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    Object.assign(this, {
      headers: response.headers
    });
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }

    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
    }
  }

  const parsedOptions = typeof query === "string" ? Object.assign({
    query
  }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2216:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "2.13.3";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return {
          done: true
        };
        const response = await requestMethod({
          method,
          url,
          headers
        });
        const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
        // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
        // sets `url` to undefined if "next" URL is not present or `link` header is not set

        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
        return {
          value: normalizedResponse
        };
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

const composePaginateRest = Object.assign(paginate, {
  iterator
});

const paginatingEndpoints = ["GET /app/installations", "GET /applications/grants", "GET /authorizations", "GET /enterprises/{enterprise}/actions/permissions/organizations", "GET /enterprises/{enterprise}/actions/runner-groups", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners", "GET /enterprises/{enterprise}/actions/runners", "GET /enterprises/{enterprise}/actions/runners/downloads", "GET /events", "GET /gists", "GET /gists/public", "GET /gists/starred", "GET /gists/{gist_id}/comments", "GET /gists/{gist_id}/commits", "GET /gists/{gist_id}/forks", "GET /installation/repositories", "GET /issues", "GET /marketplace_listing/plans", "GET /marketplace_listing/plans/{plan_id}/accounts", "GET /marketplace_listing/stubbed/plans", "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", "GET /networks/{owner}/{repo}/events", "GET /notifications", "GET /organizations", "GET /orgs/{org}/actions/permissions/repositories", "GET /orgs/{org}/actions/runner-groups", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners", "GET /orgs/{org}/actions/runners", "GET /orgs/{org}/actions/runners/downloads", "GET /orgs/{org}/actions/secrets", "GET /orgs/{org}/actions/secrets/{secret_name}/repositories", "GET /orgs/{org}/blocks", "GET /orgs/{org}/credential-authorizations", "GET /orgs/{org}/events", "GET /orgs/{org}/failed_invitations", "GET /orgs/{org}/hooks", "GET /orgs/{org}/installations", "GET /orgs/{org}/invitations", "GET /orgs/{org}/invitations/{invitation_id}/teams", "GET /orgs/{org}/issues", "GET /orgs/{org}/members", "GET /orgs/{org}/migrations", "GET /orgs/{org}/migrations/{migration_id}/repositories", "GET /orgs/{org}/outside_collaborators", "GET /orgs/{org}/projects", "GET /orgs/{org}/public_members", "GET /orgs/{org}/repos", "GET /orgs/{org}/team-sync/groups", "GET /orgs/{org}/teams", "GET /orgs/{org}/teams/{team_slug}/discussions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/invitations", "GET /orgs/{org}/teams/{team_slug}/members", "GET /orgs/{org}/teams/{team_slug}/projects", "GET /orgs/{org}/teams/{team_slug}/repos", "GET /orgs/{org}/teams/{team_slug}/team-sync/group-mappings", "GET /orgs/{org}/teams/{team_slug}/teams", "GET /projects/columns/{column_id}/cards", "GET /projects/{project_id}/collaborators", "GET /projects/{project_id}/columns", "GET /repos/{owner}/{repo}/actions/artifacts", "GET /repos/{owner}/{repo}/actions/runners", "GET /repos/{owner}/{repo}/actions/runners/downloads", "GET /repos/{owner}/{repo}/actions/runs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", "GET /repos/{owner}/{repo}/actions/secrets", "GET /repos/{owner}/{repo}/actions/workflows", "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs", "GET /repos/{owner}/{repo}/assignees", "GET /repos/{owner}/{repo}/branches", "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", "GET /repos/{owner}/{repo}/code-scanning/alerts", "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", "GET /repos/{owner}/{repo}/code-scanning/analyses", "GET /repos/{owner}/{repo}/collaborators", "GET /repos/{owner}/{repo}/comments", "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/commits", "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments", "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", "GET /repos/{owner}/{repo}/commits/{ref}/check-runs", "GET /repos/{owner}/{repo}/commits/{ref}/check-suites", "GET /repos/{owner}/{repo}/commits/{ref}/statuses", "GET /repos/{owner}/{repo}/contributors", "GET /repos/{owner}/{repo}/deployments", "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses", "GET /repos/{owner}/{repo}/events", "GET /repos/{owner}/{repo}/forks", "GET /repos/{owner}/{repo}/git/matching-refs/{ref}", "GET /repos/{owner}/{repo}/hooks", "GET /repos/{owner}/{repo}/invitations", "GET /repos/{owner}/{repo}/issues", "GET /repos/{owner}/{repo}/issues/comments", "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/issues/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", "GET /repos/{owner}/{repo}/issues/{issue_number}/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/labels", "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", "GET /repos/{owner}/{repo}/keys", "GET /repos/{owner}/{repo}/labels", "GET /repos/{owner}/{repo}/milestones", "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels", "GET /repos/{owner}/{repo}/notifications", "GET /repos/{owner}/{repo}/pages/builds", "GET /repos/{owner}/{repo}/projects", "GET /repos/{owner}/{repo}/pulls", "GET /repos/{owner}/{repo}/pulls/comments", "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments", "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits", "GET /repos/{owner}/{repo}/pulls/{pull_number}/files", "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments", "GET /repos/{owner}/{repo}/releases", "GET /repos/{owner}/{repo}/releases/{release_id}/assets", "GET /repos/{owner}/{repo}/secret-scanning/alerts", "GET /repos/{owner}/{repo}/stargazers", "GET /repos/{owner}/{repo}/subscribers", "GET /repos/{owner}/{repo}/tags", "GET /repos/{owner}/{repo}/teams", "GET /repositories", "GET /repositories/{repository_id}/environments/{environment_name}/secrets", "GET /scim/v2/enterprises/{enterprise}/Groups", "GET /scim/v2/enterprises/{enterprise}/Users", "GET /scim/v2/organizations/{org}/Users", "GET /search/code", "GET /search/commits", "GET /search/issues", "GET /search/labels", "GET /search/repositories", "GET /search/topics", "GET /search/users", "GET /teams/{team_id}/discussions", "GET /teams/{team_id}/discussions/{discussion_number}/comments", "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /teams/{team_id}/discussions/{discussion_number}/reactions", "GET /teams/{team_id}/invitations", "GET /teams/{team_id}/members", "GET /teams/{team_id}/projects", "GET /teams/{team_id}/repos", "GET /teams/{team_id}/team-sync/group-mappings", "GET /teams/{team_id}/teams", "GET /user/blocks", "GET /user/emails", "GET /user/followers", "GET /user/following", "GET /user/gpg_keys", "GET /user/installations", "GET /user/installations/{installation_id}/repositories", "GET /user/issues", "GET /user/keys", "GET /user/marketplace_purchases", "GET /user/marketplace_purchases/stubbed", "GET /user/memberships/orgs", "GET /user/migrations", "GET /user/migrations/{migration_id}/repositories", "GET /user/orgs", "GET /user/public_emails", "GET /user/repos", "GET /user/repository_invitations", "GET /user/starred", "GET /user/subscriptions", "GET /user/teams", "GET /users", "GET /users/{username}/events", "GET /users/{username}/events/orgs/{org}", "GET /users/{username}/events/public", "GET /users/{username}/followers", "GET /users/{username}/following", "GET /users/{username}/gists", "GET /users/{username}/gpg_keys", "GET /users/{username}/keys", "GET /users/{username}/orgs", "GET /users/{username}/projects", "GET /users/{username}/received_events", "GET /users/{username}/received_events/public", "GET /users/{username}/repos", "GET /users/{username}/starred", "GET /users/{username}/subscriptions"];

function isPaginatingEndpoint(arg) {
  if (typeof arg === "string") {
    return paginatingEndpoints.includes(arg);
  } else {
    return false;
  }
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.composePaginateRest = composePaginateRest;
exports.isPaginatingEndpoint = isPaginatingEndpoint;
exports.paginateRest = paginateRest;
exports.paginatingEndpoints = paginatingEndpoints;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 517:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

const Endpoints = {
  actions: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateEnvironmentSecret: ["PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteEnvironmentSecret: ["DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getEnvironmentPublicKey: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"],
    getEnvironmentSecret: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getPendingDeploymentsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
    getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
      renamed: ["actions", "getGithubActionsPermissionsRepository"]
    }],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getReviewsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    reviewPendingDeploymentsForRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: ["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
      renamedParameters: {
        alert_id: "alert_number"
      }
    }],
    getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  enterpriseAdmin: {
    disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
    getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
    listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
    setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
    setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits", {}, {
      renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]
    }],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits", {}, {
      renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]
    }],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits", {}, {
      renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
    deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
    deletePackageVersionForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    deletePackageVersionForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getAllPackageVersionsForAPackageOwnedByAnOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions", {}, {
      renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"]
    }],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions", {}, {
      renamed: ["packages", "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]
    }],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions"],
    getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
    getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
    getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
    getPackageVersionForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    restorePackageForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageVersionForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
    restorePackageVersionForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://docs.github.com/rest/reference/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks{?org,organization}"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: ["PUT /repos/{owner}/{repo}/environments/{environment_name}"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteAnEnvironment: ["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
      renamed: ["repos", "downloadZipballArchive"]
    }],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getEnvironment: ["GET /repos/{owner}/{repo}/environments/{environment_name}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
      renamed: ["repos", "updateStatusCheckProtection"]
    }],
    updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "4.15.0";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit, Endpoints);
  return _objectSpread2(_objectSpread2({}, api), {}, {
    rest: api
  });
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4967:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __nccwpck_require__(9302);
var once = _interopDefault(__nccwpck_require__(328));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4038:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __nccwpck_require__(7897);
var universalUserAgent = __nccwpck_require__(3443);
var isPlainObject = __nccwpck_require__(3691);
var nodeFetch = _interopDefault(__nccwpck_require__(9030));
var requestError = __nccwpck_require__(4967);

const VERSION = "5.4.15";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, // `requestOptions.request.agent` type is incompatible
  // see https://github.com/octokit/types.ts/pull/264
  requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 732:
/***/ ((module) => {

"use strict";


module.exports = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ 7968:
/***/ ((module) => {

"use strict";


module.exports = iterate

var own = {}.hasOwnProperty

function iterate(values, callback, context) {
  var index = -1
  var result

  if (!values) {
    throw new Error('Iterate requires that |this| not be ' + values)
  }

  if (!own.call(values, 'length')) {
    throw new Error('Iterate requires that |this| has a `length`')
  }

  if (typeof callback !== 'function') {
    throw new Error('`callback` must be a function')
  }

  // The length might change, so we do not cache it.
  while (++index < values.length) {
    // Skip missing values.
    if (!(index in values)) {
      continue
    }

    result = callback.call(context, values[index], index, values)

    // If `callback` returns a `number`, move `index` over to `number`.
    if (typeof result === 'number') {
      // Make sure that negative numbers do not break the loop.
      if (result < 0) {
        index = 0
      }

      index = result - 1
    }
  }
}


/***/ }),

/***/ 4879:
/***/ ((module) => {

"use strict";


module.exports = automatedReadability

var characterWeight = 4.71
var sentenceWeight = 0.5
var base = 21.43

function automatedReadability(counts) {
  if (!counts || !counts.sentence || !counts.word || !counts.character) {
    return NaN
  }

  return (
    characterWeight * (counts.character / counts.word) +
    sentenceWeight * (counts.word / counts.sentence) -
    base
  )
}


/***/ }),

/***/ 5617:
/***/ ((module) => {

"use strict";


module.exports = bail

function bail(err) {
  if (err) {
    throw err
  }
}


/***/ }),

/***/ 3374:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(1965)
var addHook = __nccwpck_require__(928)
var removeHook = __nccwpck_require__(7492)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 1965:
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 7492:
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 7592:
/***/ ((module) => {

"use strict";


module.exports = colemanLiau

var letterWeight = 0.0588
var sentenceWeight = 0.296
var base = 15.8
var percentage = 100

function colemanLiau(counts) {
  if (!counts || !counts.sentence || !counts.word || !counts.letter) {
    return NaN
  }

  return (
    letterWeight * ((counts.letter / counts.word) * percentage) -
    sentenceWeight * ((counts.sentence / counts.word) * percentage) -
    base
  )
}


/***/ }),

/***/ 2641:
/***/ ((module) => {

"use strict";


module.exports = daleChall
daleChall.gradeLevel = daleChallGradeLevel

var difficultWordWeight = 0.1579
var wordWeight = 0.0496
var difficultWordThreshold = 0.05
var percentage = 100
var adjustment = 3.6365

// Grade map associated with the scores.
var gradeMap = {
  4: [0, 4],
  5: [5, 6],
  6: [7, 8],
  7: [9, 10],
  8: [11, 12],
  9: [13, 15],
  10: [16, Infinity],
  NaN: [NaN, NaN]
}

function daleChall(counts) {
  var percentageOfDifficultWords
  var score

  if (!counts || !counts.sentence || !counts.word) {
    return NaN
  }

  percentageOfDifficultWords = (counts.difficultWord || 0) / counts.word

  score =
    difficultWordWeight * percentageOfDifficultWords * percentage +
    (wordWeight * counts.word) / counts.sentence

  if (percentageOfDifficultWords > difficultWordThreshold) {
    score += adjustment
  }

  return score
}

// Mapping between a dale-chall score and a U.S. grade level.
function daleChallGradeLevel(score) {
  score = Math.floor(score)

  if (score < 5) {
    score = 4
  } else if (score > 9) {
    score = 10
  }

  return gradeMap[score].concat()
}


/***/ }),

/***/ 9302:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 7161:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var read = __nccwpck_require__(5747).readFile
var join = __nccwpck_require__(5622).join

module.exports = load

function load(callback) {
  var pos = -1
  var exception = null
  var result = {}

  one('aff')
  one('dic')

  function one(name) {
    read(join(__dirname, 'index.' + name), function (error, doc) {
      pos++
      exception = exception || error
      result[name] = doc

      if (pos) {
        callback(exception, exception ? null : result)
        exception = null
        result = null
      }
    })
  }
}


/***/ }),

/***/ 4660:
/***/ ((module) => {

"use strict";


module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ 8845:
/***/ ((module) => {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var setProperty = function setProperty(target, options) {
	if (defineProperty && options.name === '__proto__') {
		defineProperty(target, options.name, {
			enumerable: true,
			configurable: true,
			value: options.newValue,
			writable: true
		});
	} else {
		target[options.name] = options.newValue;
	}
};

// Return undefined instead of __proto__ if '__proto__' is not an own property
var getProperty = function getProperty(obj, name) {
	if (name === '__proto__') {
		if (!hasOwn.call(obj, name)) {
			return void 0;
		} else if (gOPD) {
			// In early versions of node, obj['__proto__'] is buggy when obj has
			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
			return gOPD(obj, name).value;
		}
	}

	return obj[name];
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = getProperty(target, name);
				copy = getProperty(options, name);

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						setProperty(target, { name: name, newValue: copy });
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ 5422:
/***/ ((module) => {

"use strict";


module.exports = flesch

var sentenceWeight = 1.015
var wordWeight = 84.6
var base = 206.835

function flesch(counts) {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return NaN
  }

  return (
    base -
    sentenceWeight * (counts.word / counts.sentence) -
    wordWeight * (counts.syllable / counts.word)
  )
}


/***/ }),

/***/ 3026:
/***/ ((module) => {

//
// format - printf-like string formatting for JavaScript
// github.com/samsonjs/format
// @_sjs
//
// Copyright 2010 - 2013 Sami Samhuri <sami@samhuri.net>
//
// MIT License
// http://sjs.mit-license.org
//

;(function() {

  //// Export the API
  var namespace;

  // CommonJS / Node module
  if (true) {
    namespace = module.exports = format;
  }

  // Browsers and other environments
  else {}

  namespace.format = format;
  namespace.vsprintf = vsprintf;

  if (typeof console !== 'undefined' && typeof console.log === 'function') {
    namespace.printf = printf;
  }

  function printf(/* ... */) {
    console.log(format.apply(null, arguments));
  }

  function vsprintf(fmt, replacements) {
    return format.apply(null, [fmt].concat(replacements));
  }

  function format(fmt) {
    var argIndex = 1 // skip initial format argument
      , args = [].slice.call(arguments)
      , i = 0
      , n = fmt.length
      , result = ''
      , c
      , escaped = false
      , arg
      , tmp
      , leadingZero = false
      , precision
      , nextArg = function() { return args[argIndex++]; }
      , slurpNumber = function() {
          var digits = '';
          while (/\d/.test(fmt[i])) {
            digits += fmt[i++];
            c = fmt[i];
          }
          return digits.length > 0 ? parseInt(digits) : null;
        }
      ;
    for (; i < n; ++i) {
      c = fmt[i];
      if (escaped) {
        escaped = false;
        if (c == '.') {
          leadingZero = false;
          c = fmt[++i];
        }
        else if (c == '0' && fmt[i + 1] == '.') {
          leadingZero = true;
          i += 2;
          c = fmt[i];
        }
        else {
          leadingZero = true;
        }
        precision = slurpNumber();
        switch (c) {
        case 'b': // number in binary
          result += parseInt(nextArg(), 10).toString(2);
          break;
        case 'c': // character
          arg = nextArg();
          if (typeof arg === 'string' || arg instanceof String)
            result += arg;
          else
            result += String.fromCharCode(parseInt(arg, 10));
          break;
        case 'd': // number in decimal
          result += parseInt(nextArg(), 10);
          break;
        case 'f': // floating point number
          tmp = String(parseFloat(nextArg()).toFixed(precision || 6));
          result += leadingZero ? tmp : tmp.replace(/^0/, '');
          break;
        case 'j': // JSON
          result += JSON.stringify(nextArg());
          break;
        case 'o': // number in octal
          result += '0' + parseInt(nextArg(), 10).toString(8);
          break;
        case 's': // string
          result += nextArg();
          break;
        case 'x': // lowercase hexadecimal
          result += '0x' + parseInt(nextArg(), 10).toString(16);
          break;
        case 'X': // uppercase hexadecimal
          result += '0x' + parseInt(nextArg(), 10).toString(16).toUpperCase();
          break;
        default:
          result += c;
          break;
        }
      } else if (c === '%') {
        escaped = true;
      } else {
        result += c;
      }
    }
    return result;
  }

}());


/***/ }),

/***/ 2766:
/***/ ((module) => {

"use strict";


module.exports = gunningFog

var complexWordWeight = 100
var weight = 0.4

function gunningFog(counts) {
  if (!counts || !counts.sentence || !counts.word) {
    return NaN
  }

  return (
    weight *
    (counts.word / counts.sentence +
      complexWordWeight * ((counts.complexPolysillabicWord || 0) / counts.word))
  )
}


/***/ }),

/***/ 4766:
/***/ ((module) => {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 5588:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(1669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8828);
}


/***/ }),

/***/ 8828:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 3670:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ 2228:
/***/ ((module) => {

"use strict";
/* eslint-disable yoda */


const isFullwidthCodePoint = codePoint => {
	if (Number.isNaN(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		codePoint >= 0x1100 && (
			codePoint <= 0x115F || // Hangul Jamo
			codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
			// Hangul Jamo Extended-A
			(0xA960 <= codePoint && codePoint <= 0xA97C) ||
			// Hangul Syllables
			(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
			// CJK Compatibility Ideographs
			(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
			// Vertical Forms
			(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
			// Halfwidth and Fullwidth Forms
			(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
			(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
			// Kana Supplement
			(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
			// Enclosed Ideographic Supplement
			(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= codePoint && codePoint <= 0x3FFFD)
		)
	) {
		return true;
	}

	return false;
};

module.exports = isFullwidthCodePoint;
module.exports.default = isFullwidthCodePoint;


/***/ }),

/***/ 2212:
/***/ ((module) => {

"use strict";


module.exports = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};


/***/ }),

/***/ 3691:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 2421:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)

module.exports = isLiteral

var single = [
  '-', // Hyphen-minus
  '–', // En dash
  '—', // Em dash
  ':', // Colon
  ';' // Semi-colon
]

// Pair delimiters.
// From common sense, and WikiPedia:
// <https://en.wikipedia.org/wiki/Quotation_mark>.
var pairs = {
  ',': [','],
  '-': ['-'],
  '–': ['–'],
  '—': ['—'],
  '"': ['"'],
  "'": ["'"],
  '‘': ['’'],
  '‚': ['’'],
  '’': ['’', '‚'],
  '“': ['”'],
  '”': ['”'],
  '„': ['”', '“'],
  '«': ['»'],
  '»': ['«'],
  '‹': ['›'],
  '›': ['‹'],
  '(': [')'],
  '[': [']'],
  '{': ['}'],
  '⟨': ['⟩'],
  '「': ['」']
}

var open = []
var key

for (key in pairs) {
  open.push(key)
}

// Check if the node in `parent` at `position` is enclosed by matching
// delimiters.
function isLiteral(parent, index) {
  if (!(parent && parent.children)) {
    throw new Error('Parent must be a node')
  }

  if (index !== null && typeof index === 'object' && 'type' in index) {
    index = parent.children.indexOf(index)

    if (index === -1) {
      throw new Error('Node must be a child of `parent`')
    }
  }

  if (isNaN(index)) {
    throw new Error('Index must be a number')
  }

  return Boolean(
    (!containsWord(parent, -1, index) &&
      siblingDelimiter(parent, index, 1, single)) ||
      (!containsWord(parent, index, parent.children.length) &&
        siblingDelimiter(parent, index, -1, single)) ||
      isWrapped(parent, index)
  )
}

// Check if the node in `parent` at `position` is enclosed by matching
// delimiters.
function isWrapped(parent, position) {
  var previous = siblingDelimiter(parent, position, -1, open)

  if (previous) {
    return siblingDelimiter(parent, position, 1, pairs[toString(previous)])
  }
}

// Find the previous or next delimiter before or after `position` in `parent`.
// Returns the delimiter node when found.
function siblingDelimiter(parent, position, step, delimiters) {
  var index = position + step
  var sibling

  while (index > -1 && index < parent.children.length) {
    sibling = parent.children[index]

    if (sibling.type === 'WordNode' || sibling.type === 'SourceNode') {
      return
    }

    if (sibling.type !== 'WhiteSpaceNode') {
      return delimiters.indexOf(toString(sibling)) > -1 && sibling
    }

    index += step
  }
}

// Check if parent contains word-nodes between `start` and `end` (both
// excluding).
function containsWord(parent, start, end) {
  while (++start < end) {
    if (parent.children[start].type === 'WordNode') {
      return true
    }
  }
}


/***/ }),

/***/ 594:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)

module.exports = normalize

function normalize(node, options) {
  var value = (typeof node === 'string' ? node : toString(node))
    .toLowerCase()
    .replace(/’/g, "'")

  if (!options || !options.allowDashes) {
    value = value.replace(/-/g, '')
  }

  if (!options || !options.allowApostrophes) {
    value = value.replace(/'/g, '')
  }

  return value
}


/***/ }),

/***/ 6915:
/***/ ((module) => {

"use strict";


module.exports = nlcstToString

// Stringify one nlcst node or list of nodes.
function nlcstToString(node, separator) {
  var sep = separator || ''
  var values
  var length
  var children

  if (!node || (!('length' in node) && !node.type)) {
    throw new Error('Expected node, not `' + node + '`')
  }

  if (typeof node.value === 'string') {
    return node.value
  }

  children = 'length' in node ? node : node.children
  length = children.length

  // Shortcut: This is pretty common, and a small performance win.
  if (length === 1 && 'value' in children[0]) {
    return children[0].value
  }

  values = []

  while (length--) {
    values[length] = nlcstToString(children[length], sep)
  }

  return values.join(sep)
}


/***/ }),

/***/ 9030:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__nccwpck_require__(2413));
var http = _interopDefault(__nccwpck_require__(8605));
var Url = _interopDefault(__nccwpck_require__(8835));
var https = _interopDefault(__nccwpck_require__(7211));
var zlib = _interopDefault(__nccwpck_require__(8761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __nccwpck_require__(3632).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 4291:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(global, global.document);
    });
  } else if ( true && module.exports) {
    module.exports = factory(global, global.document);
  } else {
      global.normalize = factory(global, global.document);
  }
} (typeof window !== 'undefined' ? window : this, function (window, document) {
  var charmap = __nccwpck_require__(8354);
  var regex = null;
  var current_charmap;
  var old_charmap;

  function normalize(str, custom_charmap) {
    old_charmap = current_charmap;
    current_charmap = custom_charmap || charmap;

    regex = (regex && old_charmap === current_charmap) ? regex : buildRegExp(current_charmap);

    return str.replace(regex, function(charToReplace) {
      return current_charmap[charToReplace.charCodeAt(0)] || charToReplace;
    });
  }

  function buildRegExp(charmap){
     return new RegExp('[' + Object.keys(charmap).map(function(code) {return String.fromCharCode(code); }).join(' ') + ']', 'g');
   }

  return normalize;
}));


/***/ }),

/***/ 776:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var push = __nccwpck_require__(3529)

module.exports = add

var NO_CODES = []

// Add `value` to the checker.
function add(value, model) {
  var self = this

  push(self.data, value, self.data[model] || NO_CODES, self)

  return self
}


/***/ }),

/***/ 6986:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var form = __nccwpck_require__(8514)

module.exports = correct

// Check spelling of `value`.
function correct(value) {
  return Boolean(form(this, value))
}


/***/ }),

/***/ 5682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var parse = __nccwpck_require__(8518)

module.exports = add

// Add a dictionary file.
function add(buf) {
  var self = this
  var index = -1
  var rule
  var source
  var character
  var offset

  parse(buf, self, self.data)

  // Regenerate compound expressions.
  while (++index < self.compoundRules.length) {
    rule = self.compoundRules[index]
    source = ''
    offset = -1

    while (++offset < rule.length) {
      character = rule.charAt(offset)
      source += self.compoundRuleCodes[character].length
        ? '(?:' + self.compoundRuleCodes[character].join('|') + ')'
        : character
    }

    self.compoundRules[index] = new RegExp(source, 'i')
  }

  return self
}


/***/ }),

/***/ 873:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var buffer = __nccwpck_require__(3670)
var affix = __nccwpck_require__(9152)

module.exports = NSpell

var proto = NSpell.prototype

proto.correct = __nccwpck_require__(6986)
proto.suggest = __nccwpck_require__(7015)
proto.spell = __nccwpck_require__(1317)
proto.add = __nccwpck_require__(776)
proto.remove = __nccwpck_require__(6245)
proto.wordCharacters = __nccwpck_require__(9741)
proto.dictionary = __nccwpck_require__(5682)
proto.personal = __nccwpck_require__(3379)

// Construct a new spelling context.
function NSpell(aff, dic) {
  var index = -1
  var dictionaries

  if (!(this instanceof NSpell)) {
    return new NSpell(aff, dic)
  }

  if (typeof aff === 'string' || buffer(aff)) {
    if (typeof dic === 'string' || buffer(dic)) {
      dictionaries = [{dic: dic}]
    }
  } else if (aff) {
    if ('length' in aff) {
      dictionaries = aff
      aff = aff[0] && aff[0].aff
    } else {
      if (aff.dic) {
        dictionaries = [aff]
      }

      aff = aff.aff
    }
  }

  if (!aff) {
    throw new Error('Missing `aff` in dictionary')
  }

  aff = affix(aff)

  this.data = Object.create(null)
  this.compoundRuleCodes = aff.compoundRuleCodes
  this.replacementTable = aff.replacementTable
  this.conversion = aff.conversion
  this.compoundRules = aff.compoundRules
  this.rules = aff.rules
  this.flags = aff.flags

  if (dictionaries) {
    while (++index < dictionaries.length) {
      if (dictionaries[index].dic) {
        this.dictionary(dictionaries[index].dic)
      }
    }
  }
}


/***/ }),

/***/ 3379:
/***/ ((module) => {

"use strict";


module.exports = add

// Add a dictionary.
function add(buf) {
  var self = this
  var lines = buf.toString('utf8').split('\n')
  var index = -1
  var line
  var forbidden
  var word
  var flag

  // Ensure there’s a key for `FORBIDDENWORD`: `false` cannot be set through an
  // affix file so its safe to use as a magic constant.
  if (self.flags.FORBIDDENWORD === undefined) self.flags.FORBIDDENWORD = false
  flag = self.flags.FORBIDDENWORD

  while (++index < lines.length) {
    line = lines[index].trim()

    if (!line) {
      continue
    }

    line = line.split('/')
    word = line[0]
    forbidden = word.charAt(0) === '*'

    if (forbidden) {
      word = word.slice(1)
    }

    self.add(word, line[1])

    if (forbidden) {
      self.data[word].push(flag)
    }
  }

  return self
}


/***/ }),

/***/ 6245:
/***/ ((module) => {

"use strict";


module.exports = remove

// Remove `value` from the checker.
function remove(value) {
  var self = this

  delete self.data[value]

  return self
}


/***/ }),

/***/ 1317:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var form = __nccwpck_require__(8514)
var flag = __nccwpck_require__(2378)

module.exports = spell

// Check spelling of `word`.
function spell(word) {
  var self = this
  var value = form(self, word, true)

  // Hunspell also provides `root` (root word of the input word), and `compound`
  // (whether `word` was compound).
  return {
    correct: self.correct(word),
    forbidden: Boolean(
      value && flag(self.flags, 'FORBIDDENWORD', self.data[value])
    ),
    warn: Boolean(value && flag(self.flags, 'WARN', self.data[value]))
  }
}


/***/ }),

/***/ 7015:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var casing = __nccwpck_require__(8910)
var normalize = __nccwpck_require__(2213)
var flag = __nccwpck_require__(2378)
var form = __nccwpck_require__(8514)

module.exports = suggest

var push = [].push

// Suggest spelling for `value`.
// eslint-disable-next-line complexity
function suggest(value) {
  var self = this
  var charAdded = {}
  var suggestions = []
  var weighted = {}
  var memory
  var replacement
  var edits = []
  var values
  var index
  var offset
  var position
  var count
  var otherOffset
  var otherCharacter
  var character
  var group
  var before
  var after
  var upper
  var insensitive
  var firstLevel
  var previous
  var next
  var nextCharacter
  var max
  var distance
  var size
  var normalized
  var suggestion
  var currentCase

  value = normalize(value.trim(), self.conversion.in)

  if (!value || self.correct(value)) {
    return []
  }

  currentCase = casing(value)

  // Check the replacement table.
  index = -1

  while (++index < self.replacementTable.length) {
    replacement = self.replacementTable[index]
    offset = value.indexOf(replacement[0])

    while (offset > -1) {
      edits.push(value.replace(replacement[0], replacement[1]))
      offset = value.indexOf(replacement[0], offset + 1)
    }
  }

  // Check the keyboard.
  index = -1

  while (++index < value.length) {
    character = value.charAt(index)
    before = value.slice(0, index)
    after = value.slice(index + 1)
    insensitive = character.toLowerCase()
    upper = insensitive !== character
    charAdded = {}

    offset = -1

    while (++offset < self.flags.KEY.length) {
      group = self.flags.KEY[offset]
      position = group.indexOf(insensitive)

      if (position < 0) {
        continue
      }

      otherOffset = -1

      while (++otherOffset < group.length) {
        if (otherOffset !== position) {
          otherCharacter = group.charAt(otherOffset)

          if (charAdded[otherCharacter]) {
            continue
          }

          charAdded[otherCharacter] = true

          if (upper) {
            otherCharacter = otherCharacter.toUpperCase()
          }

          edits.push(before + otherCharacter + after)
        }
      }
    }
  }

  // Check cases where one of a double character was forgotten, or one too many
  // were added, up to three “distances”.  This increases the success-rate by 2%
  // and speeds the process up by 13%.
  index = -1
  nextCharacter = value.charAt(0)
  values = ['']
  max = 1
  distance = 0

  while (++index < value.length) {
    character = nextCharacter
    nextCharacter = value.charAt(index + 1)
    before = value.slice(0, index)

    replacement = character === nextCharacter ? '' : character + character
    offset = -1
    count = values.length

    while (++offset < count) {
      if (offset <= max) {
        values.push(values[offset] + replacement)
      }

      values[offset] += character
    }

    if (++distance < 3) {
      max = values.length
    }
  }

  push.apply(edits, values)

  // Ensure the capitalised and uppercase values are included.
  values = [value]
  replacement = value.toLowerCase()

  if (value === replacement || currentCase === null) {
    values.push(value.charAt(0).toUpperCase() + replacement.slice(1))
  }

  replacement = value.toUpperCase()

  if (value !== replacement) {
    values.push(replacement)
  }

  // Construct a memory object for `generate`.
  memory = {
    state: {},
    weighted: weighted,
    suggestions: suggestions
  }

  firstLevel = generate(self, memory, values, edits)

  // While there are no suggestions based on generated values with an
  // edit-distance of `1`, check the generated values, `SIZE` at a time.
  // Basically, we’re generating values with an edit-distance of `2`, but were
  // doing it in small batches because it’s such an expensive operation.
  previous = 0
  max = Math.min(firstLevel.length, Math.pow(Math.max(15 - value.length, 3), 3))
  size = Math.max(Math.pow(10 - value.length, 3), 1)

  while (!suggestions.length && previous < max) {
    next = previous + size
    generate(self, memory, firstLevel.slice(previous, next))
    previous = next
  }

  // Sort the suggestions based on their weight.
  suggestions.sort(sort)

  // Normalize the output.
  values = []
  normalized = []
  index = -1

  while (++index < suggestions.length) {
    suggestion = normalize(suggestions[index], self.conversion.out)
    replacement = suggestion.toLowerCase()

    if (normalized.indexOf(replacement) < 0) {
      values.push(suggestion)
      normalized.push(replacement)
    }
  }

  // BOOM! All done!
  return values

  function sort(a, b) {
    return sortWeight(a, b) || sortCasing(a, b) || sortAlpha(a, b)
  }

  function sortWeight(a, b) {
    return weighted[a] === weighted[b] ? 0 : weighted[a] > weighted[b] ? -1 : 1
  }

  function sortCasing(a, b) {
    var leftCasing = casing(a)
    var rightCasing = casing(b)

    return leftCasing === rightCasing
      ? 0
      : leftCasing === currentCase
      ? -1
      : rightCasing === currentCase
      ? 1
      : undefined
  }

  function sortAlpha(a, b) {
    return a.localeCompare(b)
  }
}

// Get a list of values close in edit distance to `words`.
function generate(context, memory, words, edits) {
  var characters = context.flags.TRY
  var data = context.data
  var flags = context.flags
  var result = []
  var index = -1
  var word
  var before
  var character
  var nextCharacter
  var nextAfter
  var nextNextAfter
  var nextUpper
  var currentCase
  var position
  var after
  var upper
  var inject
  var offset

  // Check the pre-generated edits.
  if (edits) {
    while (++index < edits.length) {
      check(edits[index], true)
    }
  }

  // Iterate over given word.
  index = -1

  while (++index < words.length) {
    word = words[index]
    before = ''
    character = ''
    nextCharacter = word.charAt(0)
    nextAfter = word
    nextNextAfter = word.slice(1)
    nextUpper = nextCharacter.toLowerCase() !== nextCharacter
    currentCase = casing(word)
    position = -1

    // Iterate over every character (including the end).
    while (++position <= word.length) {
      before += character
      after = nextAfter
      nextAfter = nextNextAfter
      nextNextAfter = nextAfter.slice(1)
      character = nextCharacter
      nextCharacter = word.charAt(position + 1)
      upper = nextUpper

      if (nextCharacter) {
        nextUpper = nextCharacter.toLowerCase() !== nextCharacter
      }

      if (nextAfter && upper !== nextUpper) {
        // Remove.
        check(before + switchCase(nextAfter))

        // Switch.
        check(
          before +
            switchCase(nextCharacter) +
            switchCase(character) +
            nextNextAfter
        )
      }

      // Remove.
      check(before + nextAfter)

      // Switch.
      if (nextAfter) {
        check(before + nextCharacter + character + nextNextAfter)
      }

      // Iterate over all possible letters.
      offset = -1

      while (++offset < characters.length) {
        inject = characters[offset]

        // Try uppercase if the original character was uppercased.
        if (upper && inject !== inject.toUpperCase()) {
          if (currentCase !== 's') {
            check(before + inject + after)
            check(before + inject + nextAfter)
          }

          inject = inject.toUpperCase()

          check(before + inject + after)
          check(before + inject + nextAfter)
        } else {
          // Add and replace.
          check(before + inject + after)
          check(before + inject + nextAfter)
        }
      }
    }
  }

  // Return the list of generated words.
  return result

  // Check and handle a generated value.
  function check(value, double) {
    var state = memory.state[value]
    var corrected

    if (state !== Boolean(state)) {
      result.push(value)

      corrected = form(context, value)
      state = corrected && !flag(flags, 'NOSUGGEST', data[corrected])

      memory.state[value] = state

      if (state) {
        memory.weighted[value] = double ? 10 : 0
        memory.suggestions.push(value)
      }
    }

    if (state) {
      memory.weighted[value]++
    }
  }

  function switchCase(fragment) {
    var first = fragment.charAt(0)

    return (
      (first.toLowerCase() === first
        ? first.toUpperCase()
        : first.toLowerCase()) + fragment.slice(1)
    )
  }
}


/***/ }),

/***/ 3529:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var apply = __nccwpck_require__(1605)

module.exports = add

var push = [].push

var NO_RULES = []

// Add `rules` for `word` to the table.
function addRules(dict, word, rules) {
  var curr = dict[word]

  // Some dictionaries will list the same word multiple times with different
  // rule sets.
  if (word in dict) {
    if (curr === NO_RULES) {
      dict[word] = rules.concat()
    } else {
      push.apply(curr, rules)
    }
  } else {
    dict[word] = rules.concat()
  }
}

function add(dict, word, codes, options) {
  var position = -1
  var rule
  var offset
  var subposition
  var suboffset
  var combined
  var newWords
  var otherNewWords

  // Compound words.
  if (
    !('NEEDAFFIX' in options.flags) ||
    codes.indexOf(options.flags.NEEDAFFIX) < 0
  ) {
    addRules(dict, word, codes)
  }

  while (++position < codes.length) {
    rule = options.rules[codes[position]]

    if (codes[position] in options.compoundRuleCodes) {
      options.compoundRuleCodes[codes[position]].push(word)
    }

    if (rule) {
      newWords = apply(word, rule, options.rules, [])
      offset = -1

      while (++offset < newWords.length) {
        if (!(newWords[offset] in dict)) {
          dict[newWords[offset]] = NO_RULES
        }

        if (rule.combineable) {
          subposition = position

          while (++subposition < codes.length) {
            combined = options.rules[codes[subposition]]

            if (
              combined &&
              combined.combineable &&
              rule.type !== combined.type
            ) {
              otherNewWords = apply(
                newWords[offset],
                combined,
                options.rules,
                []
              )
              suboffset = -1

              while (++suboffset < otherNewWords.length) {
                if (!(otherNewWords[suboffset] in dict)) {
                  dict[otherNewWords[suboffset]] = NO_RULES
                }
              }
            }
          }
        }
      }
    }
  }
}


/***/ }),

/***/ 9152:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var parse = __nccwpck_require__(8884)

module.exports = affix

var push = [].push

// Relative frequencies of letters in the English language.
var alphabet = 'etaoinshrdlcumwfgypbvkjxqz'.split('')

// Expressions.
var whiteSpaceExpression = /\s+/

// Defaults.
var defaultKeyboardLayout = [
  'qwertzuop',
  'yxcvbnm',
  'qaw',
  'say',
  'wse',
  'dsx',
  'sy',
  'edr',
  'fdc',
  'dx',
  'rft',
  'gfv',
  'fc',
  'tgz',
  'hgb',
  'gv',
  'zhu',
  'jhn',
  'hb',
  'uji',
  'kjm',
  'jn',
  'iko',
  'lkm'
]

// Parse an affix file.
// eslint-disable-next-line complexity
function affix(doc) {
  var rules = Object.create(null)
  var compoundRuleCodes = Object.create(null)
  var flags = Object.create(null)
  var replacementTable = []
  var conversion = {in: [], out: []}
  var compoundRules = []
  var aff = doc.toString('utf8')
  var lines = []
  var last = 0
  var index = aff.indexOf('\n')
  var parts
  var line
  var ruleType
  var count
  var remove
  var add
  var source
  var entry
  var position
  var rule
  var value
  var offset
  var character

  flags.KEY = []

  // Process the affix buffer into a list of applicable lines.
  while (index > -1) {
    pushLine(aff.slice(last, index))
    last = index + 1
    index = aff.indexOf('\n', last)
  }

  pushLine(aff.slice(last))

  // Process each line.
  index = -1

  while (++index < lines.length) {
    line = lines[index]
    parts = line.split(whiteSpaceExpression)
    ruleType = parts[0]

    if (ruleType === 'REP') {
      count = index + parseInt(parts[1], 10)

      while (++index <= count) {
        parts = lines[index].split(whiteSpaceExpression)
        replacementTable.push([parts[1], parts[2]])
      }

      index--
    } else if (ruleType === 'ICONV' || ruleType === 'OCONV') {
      count = index + parseInt(parts[1], 10)
      entry = conversion[ruleType === 'ICONV' ? 'in' : 'out']

      while (++index <= count) {
        parts = lines[index].split(whiteSpaceExpression)
        entry.push([new RegExp(parts[1], 'g'), parts[2]])
      }

      index--
    } else if (ruleType === 'COMPOUNDRULE') {
      count = index + parseInt(parts[1], 10)

      while (++index <= count) {
        rule = lines[index].split(whiteSpaceExpression)[1]
        position = -1

        compoundRules.push(rule)

        while (++position < rule.length) {
          compoundRuleCodes[rule.charAt(position)] = []
        }
      }

      index--
    } else if (ruleType === 'PFX' || ruleType === 'SFX') {
      count = index + parseInt(parts[3], 10)

      rule = {
        type: ruleType,
        combineable: parts[2] === 'Y',
        entries: []
      }

      rules[parts[1]] = rule

      while (++index <= count) {
        parts = lines[index].split(whiteSpaceExpression)
        remove = parts[2]
        add = parts[3].split('/')
        source = parts[4]

        entry = {
          add: '',
          remove: '',
          match: '',
          continuation: parse(flags, add[1])
        }

        if (add && add[0] !== '0') {
          entry.add = add[0]
        }

        try {
          if (remove !== '0') {
            entry.remove = ruleType === 'SFX' ? end(remove) : remove
          }

          if (source && source !== '.') {
            entry.match = ruleType === 'SFX' ? end(source) : start(source)
          }
        } catch (_) {
          // Ignore invalid regex patterns.
          entry = null
        }

        if (entry) {
          rule.entries.push(entry)
        }
      }

      index--
    } else if (ruleType === 'TRY') {
      source = parts[1]
      offset = -1
      value = []

      while (++offset < source.length) {
        character = source.charAt(offset)

        if (character.toLowerCase() === character) {
          value.push(character)
        }
      }

      // Some dictionaries may forget a character.
      // Notably `en` forgets `j`, `x`, and `y`.
      offset = -1

      while (++offset < alphabet.length) {
        if (source.indexOf(alphabet[offset]) < 0) {
          value.push(alphabet[offset])
        }
      }

      flags[ruleType] = value
    } else if (ruleType === 'KEY') {
      push.apply(flags[ruleType], parts[1].split('|'))
    } else if (ruleType === 'COMPOUNDMIN') {
      flags[ruleType] = Number(parts[1])
    } else if (ruleType === 'ONLYINCOMPOUND') {
      // If we add this ONLYINCOMPOUND flag to `compoundRuleCodes`, then
      // `parseDic` will do the work of saving the list of words that are
      // compound-only.
      flags[ruleType] = parts[1]
      compoundRuleCodes[parts[1]] = []
    } else if (
      ruleType === 'FLAG' ||
      ruleType === 'KEEPCASE' ||
      ruleType === 'NOSUGGEST' ||
      ruleType === 'WORDCHARS'
    ) {
      flags[ruleType] = parts[1]
    } else {
      // Default handling: set them for now.
      flags[ruleType] = parts[1]
    }
  }

  // Default for `COMPOUNDMIN` is `3`.
  // See `man 4 hunspell`.
  if (isNaN(flags.COMPOUNDMIN)) {
    flags.COMPOUNDMIN = 3
  }

  if (!flags.KEY.length) {
    flags.KEY = defaultKeyboardLayout
  }

  /* istanbul ignore if - Dictionaries seem to always have this. */
  if (!flags.TRY) {
    flags.TRY = alphabet.concat()
  }

  if (!flags.KEEPCASE) {
    flags.KEEPCASE = false
  }

  return {
    compoundRuleCodes: compoundRuleCodes,
    replacementTable: replacementTable,
    conversion: conversion,
    compoundRules: compoundRules,
    rules: rules,
    flags: flags
  }

  function pushLine(line) {
    line = line.trim()

    // Hash can be a valid flag, so we only discard line that starts with it.
    if (line && line.charCodeAt(0) !== 35 /* `#` */) {
      lines.push(line)
    }
  }
}

// Wrap the `source` of an expression-like string so that it matches only at
// the end of a value.
function end(source) {
  return new RegExp(source + '$')
}

// Wrap the `source` of an expression-like string so that it matches only at
// the start of a value.
function start(source) {
  return new RegExp('^' + source)
}


/***/ }),

/***/ 1605:
/***/ ((module) => {

"use strict";


module.exports = apply

// Apply a rule.
function apply(value, rule, rules, words) {
  var index = -1
  var entry
  var next
  var continuationRule
  var continuation
  var position

  while (++index < rule.entries.length) {
    entry = rule.entries[index]
    continuation = entry.continuation
    position = -1

    if (!entry.match || entry.match.test(value)) {
      next = entry.remove ? value.replace(entry.remove, '') : value
      next = rule.type === 'SFX' ? next + entry.add : entry.add + next
      words.push(next)

      if (continuation && continuation.length) {
        while (++position < continuation.length) {
          continuationRule = rules[continuation[position]]

          if (continuationRule) {
            apply(next, continuationRule, rules, words)
          }
        }
      }
    }
  }

  return words
}


/***/ }),

/***/ 8910:
/***/ ((module) => {

"use strict";


module.exports = casing

// Get the casing of `value`.
function casing(value) {
  var head = exact(value.charAt(0))
  var rest = value.slice(1)

  if (!rest) {
    return head
  }

  rest = exact(rest)

  if (head === rest) {
    return head
  }

  if (head === 'u' && rest === 'l') {
    return 's'
  }

  return null
}

function exact(value) {
  return value === value.toLowerCase()
    ? 'l'
    : value === value.toUpperCase()
    ? 'u'
    : null
}


/***/ }),

/***/ 8518:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var parseCodes = __nccwpck_require__(8884)
var add = __nccwpck_require__(3529)

module.exports = parse

// Expressions.
var whiteSpaceExpression = /\s/g

// Parse a dictionary.
function parse(buf, options, dict) {
  // Parse as lines (ignoring the first line).
  var value = buf.toString('utf8')
  var last = value.indexOf('\n') + 1
  var index = value.indexOf('\n', last)

  while (index > -1) {
    // Some dictionaries use tabs as comments.
    if (value.charCodeAt(last) !== 9 /* `\t` */) {
      parseLine(value.slice(last, index), options, dict)
    }

    last = index + 1
    index = value.indexOf('\n', last)
  }

  parseLine(value.slice(last), options, dict)
}

// Parse a line in dictionary.
function parseLine(line, options, dict) {
  var slashOffset = line.indexOf('/')
  var hashOffset = line.indexOf('#')
  var codes = ''
  var word
  var result

  // Find offsets.
  while (
    slashOffset > -1 &&
    line.charCodeAt(slashOffset - 1) === 92 /* `\` */
  ) {
    line = line.slice(0, slashOffset - 1) + line.slice(slashOffset)
    slashOffset = line.indexOf('/', slashOffset)
  }

  // Handle hash and slash offsets.
  // Note that hash can be a valid flag, so we should not just discard
  // everything after it.
  if (hashOffset > -1) {
    if (slashOffset > -1 && slashOffset < hashOffset) {
      word = line.slice(0, slashOffset)
      whiteSpaceExpression.lastIndex = slashOffset + 1
      result = whiteSpaceExpression.exec(line)
      codes = line.slice(slashOffset + 1, result ? result.index : undefined)
    } else {
      word = line.slice(0, hashOffset)
    }
  } else if (slashOffset > -1) {
    word = line.slice(0, slashOffset)
    codes = line.slice(slashOffset + 1)
  } else {
    word = line
  }

  word = word.trim()

  if (word) {
    add(dict, word, parseCodes(options.flags, codes.trim()), options)
  }
}


/***/ }),

/***/ 126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var flag = __nccwpck_require__(2378)

module.exports = exact

// Check spelling of `value`, exactly.
function exact(context, value) {
  var index = -1

  if (context.data[value]) {
    return !flag(context.flags, 'ONLYINCOMPOUND', context.data[value])
  }

  // Check if this might be a compound word.
  if (value.length >= context.flags.COMPOUNDMIN) {
    while (++index < context.compoundRules.length) {
      if (context.compoundRules[index].test(value)) {
        return true
      }
    }
  }

  return false
}


/***/ }),

/***/ 2378:
/***/ ((module) => {

"use strict";


module.exports = flag

// Check whether a word has a flag.
function flag(values, value, flags) {
  return flags && value in values && flags.indexOf(values[value]) > -1
}


/***/ }),

/***/ 8514:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var normalize = __nccwpck_require__(2213)
var exact = __nccwpck_require__(126)
var flag = __nccwpck_require__(2378)

module.exports = form

// Find a known form of `value`.
function form(context, value, all) {
  var normal = value.trim()
  var alternative

  if (!normal) {
    return null
  }

  normal = normalize(normal, context.conversion.in)

  if (exact(context, normal)) {
    if (!all && flag(context.flags, 'FORBIDDENWORD', context.data[normal])) {
      return null
    }

    return normal
  }

  // Try sentence case if the value is uppercase.
  if (normal.toUpperCase() === normal) {
    alternative = normal.charAt(0) + normal.slice(1).toLowerCase()

    if (ignore(context.flags, context.data[alternative], all)) {
      return null
    }

    if (exact(context, alternative)) {
      return alternative
    }
  }

  // Try lowercase.
  alternative = normal.toLowerCase()

  if (alternative !== normal) {
    if (ignore(context.flags, context.data[alternative], all)) {
      return null
    }

    if (exact(context, alternative)) {
      return alternative
    }
  }

  return null
}

function ignore(flags, dict, all) {
  return (
    flag(flags, 'KEEPCASE', dict) || all || flag(flags, 'FORBIDDENWORD', dict)
  )
}


/***/ }),

/***/ 2213:
/***/ ((module) => {

"use strict";


module.exports = normalize

// Normalize `value` with patterns.
function normalize(value, patterns) {
  var index = -1

  while (++index < patterns.length) {
    value = value.replace(patterns[index][0], patterns[index][1])
  }

  return value
}


/***/ }),

/***/ 8884:
/***/ ((module) => {

"use strict";


module.exports = ruleCodes

var NO_CODES = []

// Parse rule codes.
function ruleCodes(flags, value) {
  var index = 0
  var result

  if (!value) return NO_CODES

  if (flags.FLAG === 'long') {
    // Creating an array of the right length immediately
    // avoiding resizes and using memory more efficiently
    result = new Array(Math.ceil(value.length / 2))

    while (index < value.length) {
      result[index / 2] = value.slice(index, index + 2)
      index += 2
    }

    return result
  }

  return value.split(flags.FLAG === 'num' ? ',' : '')
}


/***/ }),

/***/ 9741:
/***/ ((module) => {

"use strict";


module.exports = wordCharacters

// Get the word characters defined in affix.
function wordCharacters() {
  return this.flags.WORDCHARS || null
}


/***/ }),

/***/ 495:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
 

module.exports = {
    toOrdinal: __nccwpck_require__(2277),
    toWords: __nccwpck_require__(5558),
    toWordsOrdinal: __nccwpck_require__(408)
};


/***/ }),

/***/ 946:
/***/ ((module) => {

"use strict";


// Simplified https://gist.github.com/marlun78/885eb0021e980c6ce0fb
function isFinite(value) {
    return !(typeof value !== 'number' || value !== value || value === Infinity || value === -Infinity);
}

module.exports = isFinite;


/***/ }),

/***/ 4920:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var MAX_SAFE_INTEGER = __nccwpck_require__(2441);

function isSafeNumber(value) {
    return typeof value === 'number' && Math.abs(value) <= MAX_SAFE_INTEGER;
}

module.exports = isSafeNumber;


/***/ }),

/***/ 5493:
/***/ ((module) => {

"use strict";


var ENDS_WITH_DOUBLE_ZERO_PATTERN = /(hundred|thousand|(m|b|tr|quadr)illion)$/;
var ENDS_WITH_TEEN_PATTERN = /teen$/;
var ENDS_WITH_Y_PATTERN = /y$/;
var ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN = /(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/;
var ordinalLessThanThirteen = {
    zero: 'zeroth',
    one: 'first',
    two: 'second',
    three: 'third',
    four: 'fourth',
    five: 'fifth',
    six: 'sixth',
    seven: 'seventh',
    eight: 'eighth',
    nine: 'ninth',
    ten: 'tenth',
    eleven: 'eleventh',
    twelve: 'twelfth'
};

/**
 * Converts a number-word into an ordinal number-word.
 * @example makeOrdinal('one') => 'first'
 * @param {string} words
 * @returns {string}
 */
function makeOrdinal(words) {
    // Ends with *00 (100, 1000, etc.) or *teen (13, 14, 15, 16, 17, 18, 19)
    if (ENDS_WITH_DOUBLE_ZERO_PATTERN.test(words) || ENDS_WITH_TEEN_PATTERN.test(words)) {
        return words + 'th';
    }
    // Ends with *y (20, 30, 40, 50, 60, 70, 80, 90)
    else if (ENDS_WITH_Y_PATTERN.test(words)) {
        return words.replace(ENDS_WITH_Y_PATTERN, 'ieth');
    }
    // Ends with one through twelve
    else if (ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN.test(words)) {
        return words.replace(ENDS_WITH_ZERO_THROUGH_TWELVE_PATTERN, replaceWithOrdinalVariant);
    }
    return words;
}

function replaceWithOrdinalVariant(match, numberWord) {
    return ordinalLessThanThirteen[numberWord];
}

module.exports = makeOrdinal;


/***/ }),

/***/ 2441:
/***/ ((module) => {

"use strict";


var MAX_SAFE_INTEGER = 9007199254740991;

module.exports = MAX_SAFE_INTEGER;


/***/ }),

/***/ 2277:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isFinite = __nccwpck_require__(946);
var isSafeNumber = __nccwpck_require__(4920);

/**
 * Converts an integer into a string with an ordinal postfix.
 * If number is decimal, the decimals will be removed.
 * @example toOrdinal(12) => '12th'
 * @param {number|string} number
 * @returns {string}
 */
function toOrdinal(number) {
    var num = parseInt(number, 10);

    if (!isFinite(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it’s either too large or too small.'
        );
    }
    var str = String(num);
    var lastTwoDigits = Math.abs(num % 100);
    var betweenElevenAndThirteen = lastTwoDigits >= 11 && lastTwoDigits <= 13;
    var lastChar = str.charAt(str.length - 1);
    return str + (betweenElevenAndThirteen ? 'th'
            : lastChar === '1' ? 'st'
            : lastChar === '2' ? 'nd'
            : lastChar === '3' ? 'rd'
            : 'th');
}

module.exports = toOrdinal;


/***/ }),

/***/ 5558:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var makeOrdinal = __nccwpck_require__(5493);
var isFinite = __nccwpck_require__(946);
var isSafeNumber = __nccwpck_require__(4920);

var TEN = 10;
var ONE_HUNDRED = 100;
var ONE_THOUSAND = 1000;
var ONE_MILLION = 1000000;
var ONE_BILLION = 1000000000;           //         1.000.000.000 (9)
var ONE_TRILLION = 1000000000000;       //     1.000.000.000.000 (12)
var ONE_QUADRILLION = 1000000000000000; // 1.000.000.000.000.000 (15)
var MAX = 9007199254740992;             // 9.007.199.254.740.992 (15)

var LESS_THAN_TWENTY = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

var TENTHS_LESS_THAN_HUNDRED = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number, asOrdinal) {
    var words;
    var num = parseInt(number, 10);

    if (!isFinite(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it’s either too large or too small.'
        );
    }
    words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number) {
    var remainder, word,
        words = arguments[1];

    // We’re done
    if (number === 0) {
        return !words ? 'zero' : words.join(' ').replace(/,$/, '');
    }
    // First run
    if (!words) {
        words = [];
    }
    // If negative, prepend “minus”
    if (number < 0) {
        words.push('minus');
        number = Math.abs(number);
    }

    if (number < 20) {
        remainder = 0;
        word = LESS_THAN_TWENTY[number];

    } else if (number < ONE_HUNDRED) {
        remainder = number % TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
        // In case of remainder, we need to handle it here to be able to add the “-”
        if (remainder) {
            word += '-' + LESS_THAN_TWENTY[remainder];
            remainder = 0;
        }

    } else if (number < ONE_THOUSAND) {
        remainder = number % ONE_HUNDRED;
        word = generateWords(Math.floor(number / ONE_HUNDRED)) + ' hundred';

    } else if (number < ONE_MILLION) {
        remainder = number % ONE_THOUSAND;
        word = generateWords(Math.floor(number / ONE_THOUSAND)) + ' thousand,';

    } else if (number < ONE_BILLION) {
        remainder = number % ONE_MILLION;
        word = generateWords(Math.floor(number / ONE_MILLION)) + ' million,';

    } else if (number < ONE_TRILLION) {
        remainder = number % ONE_BILLION;
        word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion,';

    } else if (number < ONE_QUADRILLION) {
        remainder = number % ONE_TRILLION;
        word = generateWords(Math.floor(number / ONE_TRILLION)) + ' trillion,';

    } else if (number <= MAX) {
        remainder = number % ONE_QUADRILLION;
        word = generateWords(Math.floor(number / ONE_QUADRILLION)) +
        ' quadrillion,';
    }

    words.push(word);
    return generateWords(remainder, words);
}

module.exports = toWords;


/***/ }),

/***/ 408:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var makeOrdinal = __nccwpck_require__(5493);
var toWords = __nccwpck_require__(5558);

/**
 * Converts a number into ordinal words.
 * @example toWordsOrdinal(12) => 'twelfth'
 * @param {number|string} number
 * @returns {string}
 */
function toWordsOrdinal(number) {
    var words = toWords(number);
    return makeOrdinal(words);
}

module.exports = toWordsOrdinal;


/***/ }),

/***/ 328:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(7320)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 9234:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var Parser = __nccwpck_require__(1852)
var toString = __nccwpck_require__(6915)
var visitChildren = __nccwpck_require__(5113)
var modifyChildren = __nccwpck_require__(6325)

module.exports = ParseEnglish

// Inherit from `ParseLatin`.
ParserPrototype.prototype = Parser.prototype

var proto = new ParserPrototype()

ParseEnglish.prototype = proto

// Add modifiers to `parser`.
proto.tokenizeSentencePlugins = [
  visitChildren(mergeEnglishElisionExceptions)
].concat(proto.tokenizeSentencePlugins)

proto.tokenizeParagraphPlugins = [
  modifyChildren(mergeEnglishPrefixExceptions)
].concat(proto.tokenizeParagraphPlugins)

// Transform English natural language into an NLCST-tree.
function ParseEnglish(doc, file) {
  if (!(this instanceof ParseEnglish)) {
    return new ParseEnglish(doc, file)
  }

  Parser.apply(this, arguments)
}

// Constructor to create a `ParseEnglish` prototype.
function ParserPrototype() {}

// Match a blacklisted (case-insensitive) abbreviation which when followed by a
// full-stop does not depict a sentence terminal marker.
var abbreviations = new RegExp(
  '^(' +
    // Business Abbreviations: Incorporation, Limited company.
    'inc|ltd|' +
    // English unit abbreviations:
    // -   Note that *Metric abbreviations* do not use full stops.
    // -   Note that some common plurals are included, although units should not
    //     be pluralised.
    //
    // barrel, cubic, dozen, fluid (ounce), foot, gallon, grain, gross,
    // inch, karat / knot, pound, mile, ounce, pint, quart, square,
    // tablespoon, teaspoon, yard.
    'bbls?|cu|doz|fl|ft|gal|gr|gro|in|kt|lbs?|mi|oz|pt|qt|sq|tbsp|' +
    'tsp|yds?|' +
    // Abbreviations of time references:
    // seconds, minutes, hours, Monday, Tuesday, *, Wednesday, Thursday, *,
    // Friday, Saturday, Sunday, January, Februari, March, April, June, July,
    // August, September, *, October, November, December.
    'sec|min|hr|mon|tue|tues|wed|thu|thurs|fri|sat|sun|jan|feb|mar|' +
    'apr|jun|jul|aug|sep|sept|oct|nov|dec' +
    ')$'
  // Note: There's no `i` flag here because the value to test against should be
  // all lowercase!
)

// Match a blacklisted (case-sensitive) abbreviation which when followed by a
// full-stop does not depict a sentence terminal marker.
var abbreviationsSensitive = new RegExp(
  '^(' +
    // Social:
    // Mister, Mistress, Mistress, woman, Mademoiselle, Madame, Monsieur,
    // Misters, Mesdames, Junior, Senior, *.
    'Mr|Mrs|Miss|Ms|Mss|Mses|Mlle|Mme|M|Messrs|Mmes|Jr|Sr|Snr|' +
    // Rank and academic:
    // Doctor, Magister, Attorney, Profesor, Honourable, Reverend, Father,
    // Monsignor, Sister, Brother, Saint, President, Superintendent,
    // Representative, Senator.
    'Dr|Mgr|Atty|Prof|Hon|Rev|Fr|Msgr|Sr|Br|St|Pres|Supt|Rep|Sen|' +
    // Rank and military:
    // Governor, Ambassador, Treasurer, Secretary, Admiral, Brigadier, General,
    // Commander, Colonel, Captain, Lieutenant, Major, Sergeant, Petty Officer,
    // Warrant Officer, Purple Heart.
    'Gov|Amb|Treas|Sec|Amd|Brig|Gen|Cdr|Col|Capt|Lt|Maj|Sgt|Po|Wo|Ph|' +
    // Common geographical abbreviations:
    // Avenue, Boulevard, Mountain, Road, Building, National, *, Route, *,
    // County, Park, Square, Drive, Port or Point, Street or State, Fort,
    // Peninsula, Territory, Highway, Freeway, Parkway.
    'Ave|Blvd|Mt|Rd|Bldgs?|Nat|Natl|Rt|Rte|Co|Pk|Sq|Dr|Pt|St|' +
    'Ft|Pen|Terr|Hwy|Fwy|Pkwy|' +
    // American state abbreviations:
    // Alabama, Arizona, Arkansas, California, *, Colorado, *,
    // Connecticut, Delaware, Florida, Georgia, Idaho, *, Illinois, Indiana,
    // Iowa, Kansas, *, Kentucky, *, Louisiana, Maine, Maryland, Massachusetts,
    // Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, *, Nevada,
    // Mexico, Dakota, Oklahoma, *, Oregon, Pennsylvania, *, *, Tennessee,
    // Texas, Utah, Vermont, Virginia, Washington, Wisconsin, *, Wyoming.
    'Ala|Ariz|Ark|Cal|Calif|Col|Colo|Conn|Del|Fla|Ga|Ida|Id|Ill|Ind|' +
    'Ia|Kan|Kans|Ken|Ky|La|Me|Md|Mass|Mich|Minn|Miss|Mo|Mont|Neb|' +
    'Nebr|Nev|Mex|Dak|Okla|Ok|Ore|Penna|Penn|Pa|Tenn|Tex|Ut|Vt|Va|' +
    'Wash|Wis|Wisc|Wyo|' +
    // Canadian province abbreviations:
    // Alberta, Manitoba, Ontario, Quebec, *, Saskatchewan, Yukon Territory.
    'Alta|Man|Ont|Qu\u00E9|Que|Sask|Yuk|' +
    // English county abbreviations:
    // Bedfordshire, Berkshire, Buckinghamshire, Cambridgeshire, Cheshire,
    // Cornwall, Cumberland, Derbyshire, *, Devon, Dorset, Durham,
    // Gloucestershire, Hampshire, Herefordshire, *, Hertfordshire,
    // Huntingdonshire, Lancashire, Leicestershire, Lincolnshire, Middlesex,
    // *, *, Norfolk, Northamptonshire, Northumberland, *, Nottinghamshire,
    // Oxfordshire, Rutland, Shropshire, Somerset, Staffordshire, *, Suffolk,
    // Surrey, Sussex, *, Warwickshire, *, *, Westmorland, Wiltshire,
    // Worcestershire, Yorkshire.
    'Beds|Berks|Bucks|Cambs|Ches|Corn|Cumb|Derbys|Derbs|Dev|Dor|Dur|' +
    'Glos|Hants|Here|Heref|Herts|Hunts|Lancs|Leics|Lincs|Mx|Middx|Mddx|' +
    'Norf|Northants|Northumb|Northd|Notts|Oxon|Rut|Shrops|Salop|Som|' +
    'Staffs|Staf|Suff|Sy|Sx|Ssx|Warks|War|Warw|Westm|Wilts|Worcs|Yorks' +
    ')$'
)

// Match a blacklisted word which when followed by an apostrophe depicts
// elision.
var elisionPrefix = new RegExp(
  '^(' +
    // Includes: - o' > of; - ol' > old.
    'o|ol' +
    ')$'
)

// Match a blacklisted word which when preceded by an apostrophe depicts
// elision.
var elisionAffix = new RegExp(
  '^(' +
    // Includes: 'im > him; 'er > her; 'em > them. 'cause > because.
    'im|er|em|cause|' +
    // Includes: 'twas > it was; 'tis > it is; 'twere > it were.
    'twas|tis|twere|' +
    // Matches groups of year, optionally followed by an `s`.
    '\\d\\ds?' +
    ')$'
)

// Match one apostrophe.
var apostrophe = /^['\u2019]$/

// Merge a sentence into its next sentence, when the sentence ends with a
// certain word.
function mergeEnglishPrefixExceptions(sentence, index, paragraph) {
  var children = sentence.children
  var period = children[children.length - 1]
  var word = children[children.length - 2]
  var value
  var next

  if (period && toString(period) === '.' && word && word.type === 'WordNode') {
    value = toString(word)

    if (
      abbreviations.test(lower(value)) ||
      abbreviationsSensitive.test(value)
    ) {
      // Merge period into abbreviation.
      word.children.push(period)
      children.pop()

      if (period.position && word.position) {
        word.position.end = period.position.end
      }

      // Merge sentences.
      next = paragraph.children[index + 1]

      if (next) {
        sentence.children = children.concat(next.children)

        paragraph.children.splice(index + 1, 1)

        // Update position.
        if (next.position && sentence.position) {
          sentence.position.end = next.position.end
        }

        // Next, iterate over the current node again.
        return index - 1
      }
    }
  }
}

// Merge an apostrophe depicting elision into its surrounding word.
function mergeEnglishElisionExceptions(child, index, sentence) {
  var siblings
  var sibling
  var other
  var length
  var value

  if (child.type !== 'PunctuationNode' && child.type !== 'SymbolNode') {
    return
  }

  siblings = sentence.children
  length = siblings.length
  value = toString(child)

  // Match abbreviation of `with`, `w/`
  if (value === '/') {
    sibling = siblings[index - 1]

    if (sibling && lower(toString(sibling)) === 'w') {
      // Remove the slash from the sentence.
      siblings.splice(index, 1)

      // Append the slash into the children of the previous node.
      sibling.children.push(child)

      // Update position.
      if (sibling.position && child.position) {
        sibling.position.end = child.position.end
      }
    }
  } else if (apostrophe.test(value)) {
    // If two preceding (the first white space and the second a word), and one
    // following (white space) nodes exist...
    sibling = siblings[index - 1]

    if (
      index > 2 &&
      index < length - 1 &&
      sibling.type === 'WordNode' &&
      siblings[index - 2].type === 'WhiteSpaceNode' &&
      siblings[index + 1].type === 'WhiteSpaceNode' &&
      elisionPrefix.test(lower(toString(sibling)))
    ) {
      // Remove the apostrophe from the sentence.
      siblings.splice(index, 1)

      // Append the apostrophe into the children of node.
      sibling.children.push(child)

      // Update position.
      if (sibling.position && child.position) {
        sibling.position.end = child.position.end
      }

      return
    }

    // If a following word exists, and the preceding node is not a word...
    if (
      index !== length - 1 &&
      siblings[index + 1].type === 'WordNode' &&
      (index === 0 || siblings[index - 1].type !== 'WordNode')
    ) {
      sibling = siblings[index + 1]
      value = lower(toString(sibling))

      if (elisionAffix.test(value)) {
        // Remove the apostrophe from the sentence.
        siblings.splice(index, 1)

        // Prepend the apostrophe into the children of node.
        sibling.children = [child].concat(sibling.children)

        // Update position.
        if (sibling.position && child.position) {
          sibling.position.start = child.position.start
        }
        // If both preceded and followed by an apostrophe, and the word is
        // `n`...
      } else if (
        value === 'n' &&
        index < length - 2 &&
        apostrophe.test(toString(siblings[index + 2]))
      ) {
        other = siblings[index + 2]

        // Remove the apostrophe from the sentence.
        siblings.splice(index, 1)
        siblings.splice(index + 1, 1)

        // Prepend the preceding apostrophe and append the into the following
        // apostrophe into the children of node.
        sibling.children = [child].concat(sibling.children, other)

        // Update position.
        if (sibling.position) {
          /* istanbul ignore else */
          if (child.position) {
            sibling.position.start = child.position.start
          }

          /* istanbul ignore else */
          if (other.position) {
            sibling.position.end = other.position.end
          }
        }
      }
    }
  }
}

function lower(value) {
  return value.toLowerCase()
}


/***/ }),

/***/ 1852:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = __nccwpck_require__(7573)


/***/ }),

/***/ 9441:
/***/ ((module) => {

"use strict";
// This module is generated by `script/build-expressions.js`.


module.exports = {
  affixSymbol: /^([!"').?\u0F3B\u0F3D\u169C\u2019\u201D\u2026\u203A\u203D\u2046\u207E\u208E\u2309\u230B\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3E\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63\xBB\]}])\1*$/,
  newLine: /^[ \t]*((\r?\n|\r)[\t ]*)+$/,
  newLineMulti: /^[ \t]*((\r?\n|\r)[\t ]*){2,}$/,
  terminalMarker: /^([!.?\u2026\u203D]+)$/,
  wordSymbolInner: /^([&'\-.:=?@\xAD\xB7\u2010\u2011\u2019\u2027]|_+)$/,
  numerical: /^(?:[\d\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D58-\u0D5E\u0D66-\u0D78\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]|\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE48\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDCFA-\uDCFF\uDD30-\uDD39\uDE60-\uDE7E\uDF1D-\uDF26\uDF51-\uDF54\uDFC5-\uDFCB]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDDE1-\uDDF4\uDEF0-\uDEF9]|\uD805[\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF3B]|\uD806[\uDCE0-\uDCF2\uDD50-\uDD59]|\uD807[\uDC50-\uDC6C\uDD50-\uDD59\uDDA0-\uDDA9\uDFC0-\uDFD4]|\uD809[\uDC00-\uDC6E]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59\uDF5B-\uDF61]|\uD81B[\uDE80-\uDE96]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDFCE-\uDFFF]|\uD838[\uDD40-\uDD49\uDEF0-\uDEF9]|\uD83A[\uDCC7-\uDCCF\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9])+$/,
  digitStart: /^\d/,
  lowerInitial: /^(?:[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7BB\uA7BD\uA7BF\uA7C3\uA7C8\uA7CA\uA7F6\uA7FA\uAB30-\uAB5A\uAB60-\uAB68\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43])/,
  surrogates: /[\uD800-\uDFFF]/,
  punctuation: /[!"'-),-/:;?[-\]_{}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u201F\u2022-\u2027\u2032-\u203A\u203C-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDFFF]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/,
  word: /[\dA-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u08D3-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09F4-\u09F9\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BF2\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7E\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D63\u0D66-\u0D78\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u17F0-\u17F9\u180B-\u180D\u1810-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1AC0\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA827\uA82C\uA830-\uA835\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE6\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD27\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC52-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF3B]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]|\uDB40[\uDD00-\uDDEF]/,
  whiteSpace: /[\t-\r \x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/
}


/***/ }),

/***/ 7573:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var createParser = __nccwpck_require__(4824)
var expressions = __nccwpck_require__(9441)

module.exports = ParseLatin

// PARSE LATIN

// Transform Latin-script natural language into an NLCST-tree.
function ParseLatin(doc, file) {
  var value = file || doc

  if (!(this instanceof ParseLatin)) {
    return new ParseLatin(doc, file)
  }

  this.doc = value ? String(value) : null
}

// Quick access to the prototype.
var proto = ParseLatin.prototype

// Default position.
proto.position = true

// Create text nodes.
proto.tokenizeSymbol = createTextFactory('Symbol')
proto.tokenizeWhiteSpace = createTextFactory('WhiteSpace')
proto.tokenizePunctuation = createTextFactory('Punctuation')
proto.tokenizeSource = createTextFactory('Source')
proto.tokenizeText = createTextFactory('Text')

// Expose `run`.
proto.run = run

// Inject `plugins` to modifiy the result of the method at `key` on the operated
// on context.
proto.use = useFactory(function (context, key, plugins) {
  context[key] = context[key].concat(plugins)
})

// Inject `plugins` to modifiy the result of the method at `key` on the operated
// on context, before any other.
proto.useFirst = useFactory(function (context, key, plugins) {
  context[key] = plugins.concat(context[key])
})

// Easy access to the document parser. This additionally supports retext-style
// invocation: where an instance is created for each file, and the file is given
// on construction.
proto.parse = function (value) {
  return this.tokenizeRoot(value || this.doc)
}

// Transform a `value` into a list of `NLCSTNode`s.
proto.tokenize = function (value) {
  return tokenize(this, value)
}

// PARENT NODES
//
// All these nodes are `pluggable`: they come with a `use` method which accepts
// a plugin (`function(NLCSTNode)`).
// Every time one of these methods are called, the plugin is invoked with the
// node, allowing for easy modification.
//
// In fact, the internal transformation from `tokenize` (a list of words, white
// space, punctuation, and symbols) to `tokenizeRoot` (an NLCST tree), is also
// implemented through this mechanism.

// Create a `WordNode` with its children set to a single `TextNode`, its value
// set to the given `value`.
pluggable(ParseLatin, 'tokenizeWord', function (value, eat) {
  var add = (eat || noopEat)('')
  var parent = {type: 'WordNode', children: []}

  this.tokenizeText(value, eat, parent)

  return add(parent)
})

// Create a `SentenceNode` with its children set to `Node`s, their values set
// to the tokenized given `value`.
//
// Unless plugins add new nodes, the sentence is populated by `WordNode`s,
// `SymbolNode`s, `PunctuationNode`s, and `WhiteSpaceNode`s.
pluggable(
  ParseLatin,
  'tokenizeSentence',
  createParser({
    type: 'SentenceNode',
    tokenizer: 'tokenize'
  })
)

// Create a `ParagraphNode` with its children set to `Node`s, their values set
// to the tokenized given `value`.
//
// Unless plugins add new nodes, the paragraph is populated by `SentenceNode`s
// and `WhiteSpaceNode`s.
pluggable(
  ParseLatin,
  'tokenizeParagraph',
  createParser({
    type: 'ParagraphNode',
    delimiter: expressions.terminalMarker,
    delimiterType: 'PunctuationNode',
    tokenizer: 'tokenizeSentence'
  })
)

// Create a `RootNode` with its children set to `Node`s, their values set to the
// tokenized given `value`.
pluggable(
  ParseLatin,
  'tokenizeRoot',
  createParser({
    type: 'RootNode',
    delimiter: expressions.newLine,
    delimiterType: 'WhiteSpaceNode',
    tokenizer: 'tokenizeParagraph'
  })
)

// PLUGINS

proto.use('tokenizeSentence', [
  __nccwpck_require__(1854),
  __nccwpck_require__(9196),
  __nccwpck_require__(3816),
  __nccwpck_require__(4445),
  __nccwpck_require__(5765),
  __nccwpck_require__(523),
  __nccwpck_require__(557)
])

proto.use('tokenizeParagraph', [
  __nccwpck_require__(6201),
  __nccwpck_require__(2278),
  __nccwpck_require__(1468),
  __nccwpck_require__(8591),
  __nccwpck_require__(7644),
  __nccwpck_require__(5892),
  __nccwpck_require__(8582),
  __nccwpck_require__(6031),
  __nccwpck_require__(7890),
  __nccwpck_require__(7788),
  __nccwpck_require__(1425),
  __nccwpck_require__(557)
])

proto.use('tokenizeRoot', [
  __nccwpck_require__(6031),
  __nccwpck_require__(7890),
  __nccwpck_require__(1425),
  __nccwpck_require__(557)
])

// TEXT NODES

// Factory to create a `Text`.
function createTextFactory(type) {
  type += 'Node'

  return createText

  // Construct a `Text` from a bound `type`
  function createText(value, eat, parent) {
    if (value === null || value === undefined) {
      value = ''
    }

    return (eat || noopEat)(value)(
      {
        type: type,
        value: String(value)
      },
      parent
    )
  }
}

// Run transform plug-ins for `key` on `nodes`.
function run(key, nodes) {
  var wareKey = key + 'Plugins'
  var plugins = this[wareKey]
  var index = -1

  if (plugins) {
    while (plugins[++index]) {
      plugins[index](nodes)
    }
  }

  return nodes
}

// Make a method “pluggable”.
function pluggable(Constructor, key, callback) {
  // Set a pluggable version of `callback` on `Constructor`.
  Constructor.prototype[key] = function () {
    return this.run(key, callback.apply(this, arguments))
  }
}

// Factory to inject `plugins`. Takes `callback` for the actual inserting.
function useFactory(callback) {
  return use

  // Validate if `plugins` can be inserted.
  // Invokes the bound `callback` to do the actual inserting.
  function use(key, plugins) {
    var self = this
    var wareKey

    // Throw if the method is not pluggable.
    if (!(key in self)) {
      throw new Error(
        'Illegal Invocation: Unsupported `key` for ' +
          '`use(key, plugins)`. Make sure `key` is a ' +
          'supported function'
      )
    }

    // Fail silently when no plugins are given.
    if (!plugins) {
      return
    }

    wareKey = key + 'Plugins'

    // Make sure `plugins` is a list.
    if (typeof plugins === 'function') {
      plugins = [plugins]
    } else {
      plugins = plugins.concat()
    }

    // Make sure `wareKey` exists.
    if (!self[wareKey]) {
      self[wareKey] = []
    }

    // Invoke callback with the ware key and plugins.
    callback(self, wareKey, plugins)
  }
}

// CLASSIFY

// Match a word character.
var wordRe = expressions.word

// Match a surrogate character.
var surrogatesRe = expressions.surrogates

// Match a punctuation character.
var punctuationRe = expressions.punctuation

// Match a white space character.
var whiteSpaceRe = expressions.whiteSpace

// Transform a `value` into a list of `NLCSTNode`s.
function tokenize(parser, value) {
  var tokens
  var offset
  var line
  var column
  var index
  var length
  var character
  var queue
  var previous
  var left
  var right
  var eater

  if (value === null || value === undefined) {
    value = ''
  } else if (value instanceof String) {
    value = value.toString()
  }

  if (typeof value !== 'string') {
    // Return the given nodes if this is either an empty array, or an array with
    // a node as a first child.
    if ('length' in value && (!value[0] || value[0].type)) {
      return value
    }

    throw new Error(
      "Illegal invocation: '" +
        value +
        "' is not a valid argument for 'ParseLatin'"
    )
  }

  tokens = []

  if (!value) {
    return tokens
  }

  index = 0
  offset = 0
  line = 1
  column = 1

  // Eat mechanism to use.
  eater = parser.position ? eat : noPositionEat

  length = value.length
  previous = ''
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (whiteSpaceRe.test(character)) {
      right = 'WhiteSpace'
    } else if (punctuationRe.test(character)) {
      right = 'Punctuation'
    } else if (wordRe.test(character)) {
      right = 'Word'
    } else {
      right = 'Symbol'
    }

    tick()

    previous = character
    character = ''
    left = right
    right = null

    index++
  }

  tick()

  return tokens

  // Check one character.
  function tick() {
    if (
      left === right &&
      (left === 'Word' ||
        left === 'WhiteSpace' ||
        character === previous ||
        surrogatesRe.test(character))
    ) {
      queue += character
    } else {
      // Flush the previous queue.
      if (queue) {
        parser['tokenize' + left](queue, eater)
      }

      queue = character
    }
  }

  // Remove `subvalue` from `value`.
  // Expects `subvalue` to be at the start from `value`, and applies no
  // validation.
  function eat(subvalue) {
    var pos = position()

    update(subvalue)

    return apply

    // Add the given arguments, add `position` to the returned node, and return
    // the node.
    function apply() {
      return pos(add.apply(null, arguments))
    }
  }

  // Remove `subvalue` from `value`.
  // Does not patch positional information.
  function noPositionEat() {
    return apply

    // Add the given arguments and return the node.
    function apply() {
      return add.apply(null, arguments)
    }
  }

  // Add mechanism.
  function add(node, parent) {
    if (parent) {
      parent.children.push(node)
    } else {
      tokens.push(node)
    }

    return node
  }

  // Mark position and patch `node.position`.
  function position() {
    var before = now()

    // Add the position to a node.
    function patch(node) {
      node.position = new Position(before)

      return node
    }

    return patch
  }

  // Update line and column based on `value`.
  function update(subvalue) {
    var subvalueLength = subvalue.length
    var character = -1
    var lastIndex = -1

    offset += subvalueLength

    while (++character < subvalueLength) {
      if (subvalue.charAt(character) === '\n') {
        lastIndex = character
        line++
      }
    }

    if (lastIndex === -1) {
      column += subvalueLength
    } else {
      column = subvalueLength - lastIndex
    }
  }

  // Store position information for a node.
  function Position(start) {
    this.start = start
    this.end = now()
  }

  // Get the current position.
  function now() {
    return {
      line: line,
      column: column,
      offset: offset
    }
  }
}

// Add mechanism used when text-tokenisers are called directly outside of the
// `tokenize` function.
function noopAdd(node, parent) {
  if (parent) {
    parent.children.push(node)
  }

  return node
}

// Eat and add mechanism without adding positional information, used when
// text-tokenisers are called directly outside of the `tokenize` function.
function noopEat() {
  return noopAdd
}


/***/ }),

/***/ 4824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var tokenizer = __nccwpck_require__(9631)

module.exports = parserFactory

// Construct a parser based on `options`.
function parserFactory(options) {
  var type = options.type
  var tokenizerProperty = options.tokenizer
  var delimiter = options.delimiter
  var tokenize = delimiter && tokenizer(options.delimiterType, delimiter)

  return parser

  function parser(value) {
    var children = this[tokenizerProperty](value)

    return {
      type: type,
      children: tokenize ? tokenize(children) : children
    }
  }
}


/***/ }),

/***/ 7788:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)
var expressions = __nccwpck_require__(9441)

module.exports = modifyChildren(breakImplicitSentences)

// Two or more new line characters.
var multiNewLine = expressions.newLineMulti

// Break a sentence if a white space with more than one new-line is found.
function breakImplicitSentences(child, index, parent) {
  var children
  var position
  var length
  var tail
  var head
  var end
  var insertion
  var node

  if (child.type !== 'SentenceNode') {
    return
  }

  children = child.children

  // Ignore first and last child.
  length = children.length - 1
  position = 0

  while (++position < length) {
    node = children[position]

    if (node.type !== 'WhiteSpaceNode' || !multiNewLine.test(toString(node))) {
      continue
    }

    child.children = children.slice(0, position)

    insertion = {
      type: 'SentenceNode',
      children: children.slice(position + 1)
    }

    tail = children[position - 1]
    head = children[position + 1]

    parent.children.splice(index + 1, 0, node, insertion)

    if (child.position && tail.position && head.position) {
      end = child.position.end

      child.position.end = tail.position.end

      insertion.position = {
        start: head.position.start,
        end: end
      }
    }

    return index + 1
  }
}


/***/ }),

/***/ 7890:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(makeFinalWhiteSpaceSiblings)

// Move white space ending a paragraph up, so they are the siblings of
// paragraphs.
function makeFinalWhiteSpaceSiblings(child, index, parent) {
  var children = child.children
  var previous

  if (
    children &&
    children.length !== 0 &&
    children[children.length - 1].type === 'WhiteSpaceNode'
  ) {
    parent.children.splice(index + 1, 0, child.children.pop())
    previous = children[children.length - 1]

    if (previous && previous.position && child.position) {
      child.position.end = previous.position.end
    }

    // Next, iterate over the current node again.
    return index
  }
}


/***/ }),

/***/ 6031:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visitChildren = __nccwpck_require__(5113)

module.exports = visitChildren(makeInitialWhiteSpaceSiblings)

// Move white space starting a sentence up, so they are the siblings of
// sentences.
function makeInitialWhiteSpaceSiblings(child, index, parent) {
  var children = child.children
  var next

  if (
    children &&
    children.length !== 0 &&
    children[0].type === 'WhiteSpaceNode'
  ) {
    parent.children.splice(index, 0, children.shift())
    next = children[0]

    if (next && next.position && child.position) {
      child.position.start = next.position.start
    }
  }
}


/***/ }),

/***/ 5892:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergeAffixExceptions)

// Merge a sentence into its previous sentence, when the sentence starts with a
// comma.
function mergeAffixExceptions(child, index, parent) {
  var children = child.children
  var node
  var position
  var value
  var previousChild

  if (!children || children.length === 0 || index === 0) {
    return
  }

  position = -1

  while (children[++position]) {
    node = children[position]

    if (node.type === 'WordNode') {
      return
    }

    if (node.type === 'SymbolNode' || node.type === 'PunctuationNode') {
      value = toString(node)

      if (value !== ',' && value !== ';') {
        return
      }

      previousChild = parent.children[index - 1]

      previousChild.children = previousChild.children.concat(children)

      // Update position.
      if (previousChild.position && child.position) {
        previousChild.position.end = child.position.end
      }

      parent.children.splice(index, 1)

      // Next, iterate over the node *now* at the current position.
      return index
    }
  }
}


/***/ }),

/***/ 2278:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)
var expressions = __nccwpck_require__(9441)

module.exports = modifyChildren(mergeAffixSymbol)

// Closing or final punctuation, or terminal markers that should still be
// included in the previous sentence, even though they follow the sentence’s
// terminal marker.
var affixSymbol = expressions.affixSymbol

// Move certain punctuation following a terminal marker (thus in the next
// sentence) to the previous sentence.
function mergeAffixSymbol(child, index, parent) {
  var children = child.children
  var first
  var second
  var previous

  if (children && children.length !== 0 && index !== 0) {
    first = children[0]
    second = children[1]
    previous = parent.children[index - 1]

    if (
      (first.type === 'SymbolNode' || first.type === 'PunctuationNode') &&
      affixSymbol.test(toString(first))
    ) {
      previous.children.push(children.shift())

      // Update position.
      if (first.position && previous.position) {
        previous.position.end = first.position.end
      }

      if (second && second.position && child.position) {
        child.position.start = second.position.start
      }

      // Next, iterate over the previous node again.
      return index - 1
    }
  }
}


/***/ }),

/***/ 9196:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergeFinalWordSymbol)

// Merge certain punctuation marks into their preceding words.
function mergeFinalWordSymbol(child, index, parent) {
  var children
  var previous
  var next

  if (
    index !== 0 &&
    (child.type === 'SymbolNode' || child.type === 'PunctuationNode') &&
    toString(child) === '-'
  ) {
    children = parent.children

    previous = children[index - 1]
    next = children[index + 1]

    if (
      (!next || next.type !== 'WordNode') &&
      previous &&
      previous.type === 'WordNode'
    ) {
      // Remove `child` from parent.
      children.splice(index, 1)

      // Add the punctuation mark at the end of the previous node.
      previous.children.push(child)

      // Update position.
      if (previous.position && child.position) {
        previous.position.end = child.position.end
      }

      // Next, iterate over the node *now* at the current position (which was
      // the next node).
      return index
    }
  }
}


/***/ }),

/***/ 8591:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)
var expressions = __nccwpck_require__(9441)

module.exports = modifyChildren(mergeInitialDigitSentences)

// Initial lowercase letter.
var digit = expressions.digitStart

// Merge a sentence into its previous sentence, when the sentence starts with a
// lower case letter.
function mergeInitialDigitSentences(child, index, parent) {
  var children = child.children
  var siblings = parent.children
  var previous = siblings[index - 1]
  var head = children[0]

  if (
    previous &&
    head &&
    head.type === 'WordNode' &&
    digit.test(toString(head))
  ) {
    previous.children = previous.children.concat(children)
    siblings.splice(index, 1)

    // Update position.
    if (previous.position && child.position) {
      previous.position.end = child.position.end
    }

    // Next, iterate over the node *now* at the current position.
    return index
  }
}


/***/ }),

/***/ 1468:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)
var expressions = __nccwpck_require__(9441)

module.exports = modifyChildren(mergeInitialLowerCaseLetterSentences)

// Initial lowercase letter.
var lowerInitial = expressions.lowerInitial

// Merge a sentence into its previous sentence, when the sentence starts with a
// lower case letter.
function mergeInitialLowerCaseLetterSentences(child, index, parent) {
  var children = child.children
  var position
  var node
  var siblings
  var previous

  if (children && children.length !== 0 && index !== 0) {
    position = -1

    while (children[++position]) {
      node = children[position]

      if (node.type === 'WordNode') {
        if (!lowerInitial.test(toString(node))) {
          return
        }

        siblings = parent.children

        previous = siblings[index - 1]

        previous.children = previous.children.concat(children)

        siblings.splice(index, 1)

        // Update position.
        if (previous.position && child.position) {
          previous.position.end = child.position.end
        }

        // Next, iterate over the node *now* at the current position.
        return index
      }

      if (node.type === 'SymbolNode' || node.type === 'PunctuationNode') {
        return
      }
    }
  }
}


/***/ }),

/***/ 1854:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergeInitialWordSymbol)

// Merge certain punctuation marks into their following words.
function mergeInitialWordSymbol(child, index, parent) {
  var children
  var next

  if (
    (child.type !== 'SymbolNode' && child.type !== 'PunctuationNode') ||
    toString(child) !== '&'
  ) {
    return
  }

  children = parent.children

  next = children[index + 1]

  // If either a previous word, or no following word, exists, exit early.
  if (
    (index !== 0 && children[index - 1].type === 'WordNode') ||
    !(next && next.type === 'WordNode')
  ) {
    return
  }

  // Remove `child` from parent.
  children.splice(index, 1)

  // Add the punctuation mark at the start of the next node.
  next.children.unshift(child)

  // Update position.
  if (next.position && child.position) {
    next.position.start = child.position.start
  }

  // Next, iterate over the node at the previous position, as it's now adjacent
  // to a following word.
  return index - 1
}


/***/ }),

/***/ 5765:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)
var expressions = __nccwpck_require__(9441)

module.exports = modifyChildren(mergeInitialisms)

var numerical = expressions.numerical

// Merge initialisms.
function mergeInitialisms(child, index, parent) {
  var siblings
  var previous
  var children
  var length
  var position
  var otherChild
  var isAllDigits
  var value

  if (index !== 0 && toString(child) === '.') {
    siblings = parent.children

    previous = siblings[index - 1]
    children = previous.children

    length = children && children.length

    if (previous.type === 'WordNode' && length !== 1 && length % 2 !== 0) {
      position = length

      isAllDigits = true

      while (children[--position]) {
        otherChild = children[position]

        value = toString(otherChild)

        if (position % 2 === 0) {
          // Initialisms consist of one character values.
          if (value.length > 1) {
            return
          }

          if (!numerical.test(value)) {
            isAllDigits = false
          }
        } else if (value !== '.') {
          if (position < length - 2) {
            break
          } else {
            return
          }
        }
      }

      if (!isAllDigits) {
        // Remove `child` from parent.
        siblings.splice(index, 1)

        // Add child to the previous children.
        children.push(child)

        // Update position.
        if (previous.position && child.position) {
          previous.position.end = child.position.end
        }

        // Next, iterate over the node *now* at the current position.
        return index
      }
    }
  }
}


/***/ }),

/***/ 4445:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergeInnerWordSlash)

var slash = '/'

// Merge words joined by certain punctuation marks.
function mergeInnerWordSlash(child, index, parent) {
  var siblings = parent.children
  var previous
  var next
  var previousValue
  var nextValue
  var queue
  var tail
  var count

  previous = siblings[index - 1]
  next = siblings[index + 1]

  if (
    previous &&
    previous.type === 'WordNode' &&
    (child.type === 'SymbolNode' || child.type === 'PunctuationNode') &&
    toString(child) === slash
  ) {
    previousValue = toString(previous)
    tail = child
    queue = [child]
    count = 1

    if (next && next.type === 'WordNode') {
      nextValue = toString(next)
      tail = next
      queue = queue.concat(next.children)
      count++
    }

    if (previousValue.length < 3 && (!nextValue || nextValue.length < 3)) {
      // Add all found tokens to `prev`s children.
      previous.children = previous.children.concat(queue)

      siblings.splice(index, count)

      // Update position.
      if (previous.position && tail.position) {
        previous.position.end = tail.position.end
      }

      // Next, iterate over the node *now* at the current position.
      return index
    }
  }
}


/***/ }),

/***/ 3816:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)
var expressions = __nccwpck_require__(9441)

module.exports = modifyChildren(mergeInnerWordSymbol)

// Symbols part of surrounding words.
var wordSymbolInner = expressions.wordSymbolInner

// Merge words joined by certain punctuation marks.
function mergeInnerWordSymbol(child, index, parent) {
  var siblings
  var sibling
  var previous
  var last
  var position
  var tokens
  var queue

  if (
    index !== 0 &&
    (child.type === 'SymbolNode' || child.type === 'PunctuationNode')
  ) {
    siblings = parent.children
    previous = siblings[index - 1]

    if (previous && previous.type === 'WordNode') {
      position = index - 1

      tokens = []
      queue = []

      // -   If a token which is neither word nor inner word symbol is found,
      //     the loop is broken
      // -   If an inner word symbol is found,  it’s queued
      // -   If a word is found, it’s queued (and the queue stored and emptied)
      while (siblings[++position]) {
        sibling = siblings[position]

        if (sibling.type === 'WordNode') {
          tokens = tokens.concat(queue, sibling.children)

          queue = []
        } else if (
          (sibling.type === 'SymbolNode' ||
            sibling.type === 'PunctuationNode') &&
          wordSymbolInner.test(toString(sibling))
        ) {
          queue.push(sibling)
        } else {
          break
        }
      }

      if (tokens.length !== 0) {
        // If there is a queue, remove its length from `position`.
        if (queue.length !== 0) {
          position -= queue.length
        }

        // Remove every (one or more) inner-word punctuation marks and children
        // of words.
        siblings.splice(index, position - index)

        // Add all found tokens to `prev`s children.
        previous.children = previous.children.concat(tokens)

        last = tokens[tokens.length - 1]

        // Update position.
        if (previous.position && last.position) {
          previous.position.end = last.position.end
        }

        // Next, iterate over the node *now* at the current position.
        return index
      }
    }
  }
}


/***/ }),

/***/ 6201:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergeNonWordSentences)

// Merge a sentence into the following sentence, when the sentence does not
// contain word tokens.
function mergeNonWordSentences(child, index, parent) {
  var children = child.children
  var position = -1
  var previous
  var next

  while (children[++position]) {
    if (children[position].type === 'WordNode') {
      return
    }
  }

  previous = parent.children[index - 1]

  if (previous) {
    previous.children = previous.children.concat(children)

    // Remove the child.
    parent.children.splice(index, 1)

    // Patch position.
    if (previous.position && child.position) {
      previous.position.end = child.position.end
    }

    // Next, iterate over the node *now* at the current position (which was the
    // next node).
    return index
  }

  next = parent.children[index + 1]

  if (next) {
    next.children = children.concat(next.children)

    // Patch position.
    if (next.position && child.position) {
      next.position.start = child.position.start
    }

    // Remove the child.
    parent.children.splice(index, 1)
  }
}


/***/ }),

/***/ 7644:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergePrefixExceptions)

// Blacklist of full stop characters that should not be treated as terminal
// sentence markers: A case-insensitive abbreviation.
var abbreviationPrefix = new RegExp(
  '^(' +
    '[0-9]{1,3}|' +
    '[a-z]|' +
    // Common Latin Abbreviations:
    // Based on: <https://en.wikipedia.org/wiki/List_of_Latin_abbreviations>.
    // Where only the abbreviations written without joining full stops,
    // but with a final full stop, were extracted.
    //
    // circa, capitulus, confer, compare, centum weight, eadem, (et) alii,
    // et cetera, floruit, foliis, ibidem, idem, nemine && contradicente,
    // opere && citato, (per) cent, (per) procurationem, (pro) tempore,
    // sic erat scriptum, (et) sequentia, statim, videlicet. */
    'al|ca|cap|cca|cent|cf|cit|con|cp|cwt|ead|etc|ff|' +
    'fl|ibid|id|nem|op|pro|seq|sic|stat|tem|viz' +
    ')$'
)

// Merge a sentence into its next sentence, when the sentence ends with a
// certain word.
function mergePrefixExceptions(child, index, parent) {
  var children = child.children
  var period
  var node
  var next

  if (children && children.length > 1) {
    period = children[children.length - 1]

    if (period && toString(period) === '.') {
      node = children[children.length - 2]

      if (
        node &&
        node.type === 'WordNode' &&
        abbreviationPrefix.test(toString(node).toLowerCase())
      ) {
        // Merge period into abbreviation.
        node.children.push(period)
        children.pop()

        // Update position.
        if (period.position && node.position) {
          node.position.end = period.position.end
        }

        // Merge sentences.
        next = parent.children[index + 1]

        if (next) {
          child.children = children.concat(next.children)

          parent.children.splice(index + 1, 1)

          // Update position.
          if (next.position && child.position) {
            child.position.end = next.position.end
          }

          // Next, iterate over the current node again.
          return index - 1
        }
      }
    }
  }
}


/***/ }),

/***/ 8582:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)
var visitChildren = __nccwpck_require__(5113)
var expressions = __nccwpck_require__(9441)

module.exports = visitChildren(mergeRemainingFullStops)

// Blacklist of full stop characters that should not be treated as terminal
// sentence markers: A case-insensitive abbreviation.
var terminalMarker = expressions.terminalMarker

// Merge non-terminal-marker full stops into the previous word (if available),
// or the next word (if available).
function mergeRemainingFullStops(child) {
  var children = child.children
  var position = children.length
  var hasFoundDelimiter = false
  var grandchild
  var previous
  var next
  var nextNext

  while (children[--position]) {
    grandchild = children[position]

    if (
      grandchild.type !== 'SymbolNode' &&
      grandchild.type !== 'PunctuationNode'
    ) {
      // This is a sentence without terminal marker, so we 'fool' the code to
      // make it think we have found one.
      if (grandchild.type === 'WordNode') {
        hasFoundDelimiter = true
      }

      continue
    }

    // Exit when this token is not a terminal marker.
    if (!terminalMarker.test(toString(grandchild))) {
      continue
    }

    // Ignore the first terminal marker found (starting at the end), as it
    // should not be merged.
    if (!hasFoundDelimiter) {
      hasFoundDelimiter = true

      continue
    }

    // Only merge a single full stop.
    if (toString(grandchild) !== '.') {
      continue
    }

    previous = children[position - 1]
    next = children[position + 1]

    if (previous && previous.type === 'WordNode') {
      nextNext = children[position + 2]

      // Continue when the full stop is followed by a space and another full
      // stop, such as: `{.} .`
      if (
        next &&
        nextNext &&
        next.type === 'WhiteSpaceNode' &&
        toString(nextNext) === '.'
      ) {
        continue
      }

      // Remove `child` from parent.
      children.splice(position, 1)

      // Add the punctuation mark at the end of the previous node.
      previous.children.push(grandchild)

      // Update position.
      if (grandchild.position && previous.position) {
        previous.position.end = grandchild.position.end
      }

      position--
    } else if (next && next.type === 'WordNode') {
      // Remove `child` from parent.
      children.splice(position, 1)

      // Add the punctuation mark at the start of the next node.
      next.children.unshift(grandchild)

      if (grandchild.position && next.position) {
        next.position.start = grandchild.position.start
      }
    }
  }
}


/***/ }),

/***/ 523:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(mergeFinalWordSymbol)

// Merge multiple words. This merges the children of adjacent words, something
// which should not occur naturally by parse-latin, but might happen when custom
// tokens were passed in.
function mergeFinalWordSymbol(child, index, parent) {
  var siblings = parent.children
  var next

  if (child.type === 'WordNode') {
    next = siblings[index + 1]

    if (next && next.type === 'WordNode') {
      // Remove `next` from parent.
      siblings.splice(index + 1, 1)

      // Add the punctuation mark at the end of the previous node.
      child.children = child.children.concat(next.children)

      // Update position.
      if (next.position && child.position) {
        child.position.end = next.position.end
      }

      // Next, re-iterate the current node.
      return index
    }
  }
}


/***/ }),

/***/ 557:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visitChildren = __nccwpck_require__(5113)

module.exports = visitChildren(patchPosition)

// Patch the position on a parent node based on its first and last child.
function patchPosition(child, index, node) {
  var siblings = node.children

  if (!child.position) {
    return
  }

  if (
    index === 0 &&
    (!node.position || /* istanbul ignore next */ !node.position.start)
  ) {
    patch(node)
    node.position.start = child.position.start
  }

  if (index === siblings.length - 1 && (!node.position || !node.position.end)) {
    patch(node)
    node.position.end = child.position.end
  }
}

// Add a `position` object when it does not yet exist on `node`.
function patch(node) {
  if (!node.position) {
    node.position = {}
  }
}


/***/ }),

/***/ 1425:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var modifyChildren = __nccwpck_require__(6325)

module.exports = modifyChildren(removeEmptyNodes)

// Remove empty children.
function removeEmptyNodes(child, index, parent) {
  if ('children' in child && child.children.length === 0) {
    parent.children.splice(index, 1)

    // Next, iterate over the node *now* at the current position (which was the
    // next node).
    return index
  }
}


/***/ }),

/***/ 9631:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)

module.exports = tokenizerFactory

// Factory to create a tokenizer based on a given `expression`.
function tokenizerFactory(childType, expression) {
  return tokenizer

  // A function that splits.
  function tokenizer(node) {
    var children = []
    var tokens = node.children
    var type = node.type
    var length = tokens.length
    var index = -1
    var lastIndex = length - 1
    var start = 0
    var first
    var last
    var parent

    while (++index < length) {
      if (
        index === lastIndex ||
        (tokens[index].type === childType &&
          expression.test(toString(tokens[index])))
      ) {
        first = tokens[start]
        last = tokens[index]

        parent = {
          type: type,
          children: tokens.slice(start, index + 1)
        }

        if (first.position && last.position) {
          parent.position = {
            start: first.position.start,
            end: last.position.end
          }
        }

        children.push(parent)

        start = index + 1
      }
    }

    return children
  }
}


/***/ }),

/***/ 4053:
/***/ (function(module) {

/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (true) {
    // Node.
    module.exports = pluralize();
  } else {}
})(this, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) return token;

    // Lower cased words. E.g. "hello".
    if (word === word.toLowerCase()) return token.toLowerCase();

    // Upper cased words. E.g. "WHISKY".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  function replace (word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  function sanitizeWord (token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Check if a word is part of the map.
   */
  function checkWord (replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;

      return sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word      The word to pluralize
   * @param  {number}  count     How many of the word exist
   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */
  pluralize.isPlural = checkWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */
  pluralize.isSingular = checkWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['passerby', 'passersby']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'adulthood',
    'advice',
    'agenda',
    'aid',
    'aircraft',
    'alcohol',
    'ammo',
    'analytics',
    'anime',
    'athletics',
    'audio',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'cod',
    'commerce',
    'cooperation',
    'corps',
    'debris',
    'diabetes',
    'digestion',
    'elk',
    'energy',
    'equipment',
    'excretion',
    'expertise',
    'firmware',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'hardware',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'mud',
    'manga',
    'news',
    'only',
    'personnel',
    'pike',
    'plankton',
    'pliers',
    'police',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'software',
    'species',
    'staff',
    'swine',
    'tennis',
    'traffic',
    'transportation',
    'trout',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    /pok[eé]mon$/i,
    // Regexes.
    /[^aeiou]ese$/i, // "chinese", "japanese"
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /measles$/i,
    /o[iu]s$/i, // "carnivorous"
    /pox$/i, // "chickpox", "smallpox"
    /sheep$/i
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});


/***/ }),

/***/ 3673:
/***/ ((module) => {

"use strict";


module.exports = quotation

var C_DEFAULT = '"'

function quotation(value, open, close) {
  var result
  var index
  var length

  open = open || C_DEFAULT
  close = close || open

  if (typeof value === 'string') {
    return open + value + close
  }

  if (typeof value !== 'object' || !('length' in value)) {
    throw new Error('Expected string or array of strings')
  }

  result = []
  length = value.length
  index = -1

  while (++index < length) {
    result[index] = quotation(value[index], open, close)
  }

  return result
}


/***/ }),

/***/ 5616:
/***/ ((module) => {

"use strict";
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */



/**
 * Results cache
 */

var res = '';
var cache;

/**
 * Expose `repeat`
 */

module.exports = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}


/***/ }),

/***/ 4262:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visit = __nccwpck_require__(7731)
var toString = __nccwpck_require__(6915)
var literal = __nccwpck_require__(2421)
var rules = __nccwpck_require__(4689)

module.exports = contractions

// Rules.
var source = 'retext-contractions'
var missingStraightId = 'missing-straight-apostrophe'
var missingSmartId = 'missing-smart-apostrophe'
var straightId = 'smart-apostrophe'
var smartId = 'straight-apostrophe'

// Regex to match an elided decade.
var apostropheExpression = /['’]/g
var rightSingleQuotationMark = '’'

var own = {}.hasOwnProperty

var data = initialize()

// Check contractions use.
function contractions(options) {
  var ignore = options && options.allowLiterals
  var straight = options && options.straight

  return transformer

  function transformer(tree, file) {
    visit(tree, 'WordNode', visitor)

    function visitor(node, index, parent) {
      var actual = toString(node)
      var normal = drop(actual)
      var expected
      var message

      // Suggest if the straightened version is listed.
      if (own.call(data, normal)) {
        expected = data[normal]

        if (!straight) {
          expected = smarten(expected)
        }

        // Perfect.
        if (expected === actual) {
          return
        }

        // Ignore literal misspelt words: `like this: “hasnt”`.
        if (!ignore && literal(parent, index)) {
          return
        }

        if (normal === actual) {
          message = file.message(
            'Expected an apostrophe in `' +
              actual +
              '`, ' +
              'like this: `' +
              expected +
              '`',
            node,
            [source, straight ? missingStraightId : missingSmartId].join(':')
          )
        } else {
          message = file.message(
            'Expected the apostrophe in `' +
              actual +
              '` to be ' +
              'like this: `' +
              expected +
              '`',
            node,
            [source, straight ? straightId : smartId].join(':')
          )
        }

        message.actual = actual
        message.expected = [expected]
      }
    }
  }
}

function initialize() {
  var result = {}
  var key
  var value

  for (key in rules) {
    value = rules[key]
    result[key] = value

    // Add upper- and sentence case as well.
    if (key === lower(key)) {
      result[upper(key)] = upper(value)
      result[sentence(key)] = sentence(value)
    }
  }

  return result
}

function lower(value) {
  return value.toLowerCase()
}

function upper(value) {
  return value.toUpperCase()
}

function sentence(value) {
  return upper(value.charAt(0)) + value.slice(1)
}

function smarten(value) {
  return value.replace(/'/g, rightSingleQuotationMark)
}

function drop(value) {
  return value.replace(apostropheExpression, '')
}


/***/ }),

/***/ 7856:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 4542:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(6561)
var color = __nccwpck_require__(7856)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 7731:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(4542)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 6206:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var unherit = __nccwpck_require__(8432)
var English = __nccwpck_require__(9234)

module.exports = parse
parse.Parser = English

function parse() {
  this.Parser = unherit(English)
}


/***/ }),

/***/ 4634:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var factory = __nccwpck_require__(5686)
var patterns = __nccwpck_require__(6552)

module.exports = factory(patterns, 'en')


/***/ }),

/***/ 1901:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(4634)


/***/ }),

/***/ 5686:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = factory

var search = __nccwpck_require__(5027)
var visit = __nccwpck_require__(763)
var convert = __nccwpck_require__(6561)
var toString = __nccwpck_require__(6915)
var normalize = __nccwpck_require__(594)
var quotation = __nccwpck_require__(3673)

var pid = 'retext-equality'
var english = 'en'
var dash = '-'
var dashLetter = /-([a-z])/g

var word = convert('WordNode')
var whiteSpace = convert('WhiteSpaceNode')
var punctuation = convert('PunctuationNode')

function factory(patterns, lang) {
  /* istanbul ignore next - needed for other languages. */
  var source = pid + (lang === english ? '' : dash + lang)

  // Several pattern types can be handled.
  // Handlers are stored in this map by type.
  var handlers = {or: or, basic: basic}

  // Internal mapping.
  var byId = []
  var byIndex = []
  var apostrophes = []
  var list = []

  unpack()

  equality.displayName = [pid, lang].join(dash).replace(dashLetter, titleCase)

  return equality

  function equality(options) {
    var settings = options || {}
    var ignore = settings.ignore || []
    var noBinary = settings.noBinary
    var noNormalize = []
    var normalize = []
    var length = list.length
    var index = -1
    var item

    while (++index < length) {
      item = list[index]

      if (ignore.indexOf(item) !== -1) {
        continue
      }

      if (apostrophes.indexOf(item) === -1) {
        normalize.push(item)
      } else {
        noNormalize.push(item)
      }
    }

    return transformer

    function transformer(tree, file) {
      visit(tree, 'ParagraphNode', visitor)

      function visitor(node) {
        var matches = {}
        var key
        var type

        search(node, normalize, handle)
        search(node, noNormalize, handle, true)

        // Ignore or emit offending words based on their pattern.
        for (key in matches) {
          type = byId[key].type

          if (type === 'or' && noBinary) {
            type = 'basic'
          }

          handlers[type](matches[key], byId[key], file)
        }

        return visit.SKIP

        // Handle a match.
        function handle(match, position, parent, phrase) {
          var index = list.indexOf(phrase)
          var pattern = byIndex[index]
          var id = pattern.id

          if (phrase !== phrase.toLowerCase() && toString(match) !== phrase) {
            return
          }

          if (!(id in matches)) {
            matches[id] = []
          }

          matches[id].push({
            type: pattern.inconsiderate[phrase],
            parent: parent,
            nodes: match,
            start: position,
            end: position + match.length - 1
          })
        }
      }
    }
  }

  function unpack() {
    var index = -1
    var length = patterns.length
    var pattern
    var inconsiderate
    var phrase
    var id

    while (++index < length) {
      pattern = patterns[index]
      inconsiderate = pattern.inconsiderate
      id = pattern.id

      byId[id] = pattern

      for (phrase in inconsiderate) {
        list.push(phrase)
        byIndex.push(pattern)

        if (pattern.apostrophe) {
          apostrophes.push(phrase)
        }
      }
    }
  }

  // Handle matches for a `basic` pattern.
  // **Basic** patterns need no extra logic, every match is emitted as a
  // warning.
  function basic(matches, pattern, file) {
    var note = pattern.note
    var id = pattern.id
    var length = matches.length
    var index = -1
    var match
    var nodes

    while (++index < length) {
      match = matches[index]
      nodes = match.nodes

      warn(
        file,
        id,
        toString(nodes),
        pattern.considerate,
        nodes[0],
        note,
        pattern.condition
      )
    }
  }

  // Handle matches for an **or** pattern.
  // **Or** patterns emit a warning unless every category is present.
  //
  // For example, when `him` and `her` occur adjacent to each other, they are not
  // warned about.
  // But when they occur alone, they are.
  function or(matches, pattern, file) {
    var length = matches.length
    var note = pattern.note
    var id = pattern.id
    var index = -1
    var match
    var next
    var siblings
    var sibling
    var value
    var nodes
    var start
    var end

    while (++index < length) {
      match = matches[index]
      siblings = match.parent.children
      nodes = match.nodes
      value = toString(nodes)
      next = matches[index + 1]

      if (next && next.parent === match.parent && next.type !== match.type) {
        start = match.end
        end = next.start

        while (++start < end) {
          sibling = siblings[start]

          if (
            whiteSpace(sibling) ||
            (word(sibling) && /(and|or)/.test(normalize(sibling))) ||
            (punctuation(sibling) && normalize(sibling) === '/')
          ) {
            continue
          }

          break
        }

        // If we didn't break…
        if (start === end) {
          index++
          continue
        }
      }

      warn(
        file,
        id,
        value,
        pattern.considerate,
        nodes[0],
        note,
        pattern.condition
      )
    }
  }

  // Warn on `file` about `actual` (at `node`) with `suggestion`s.
  function warn(file, id, actual, suggestion, node, note, condition, joiner) {
    var expected = suggestion
    var message

    if (expected) {
      expected = Object.keys(expected)

      if (isCapitalized(actual)) {
        expected = capitalize(expected)
      }
    }

    message = file.message(
      reason(actual, expected, condition, joiner),
      node,
      [source, id].join(':')
    )

    message.actual = actual
    message.expected = expected

    if (note) {
      message.note = note
    }
  }
}

// Create a human readable warning message for `violation` and suggest
// `suggestion`.
function reason(violation, suggestion, condition, joiner) {
  var reason =
    join(quotation(violation, '`'), joiner) +
    ' may be insensitive' +
    (condition ? ', ' + condition : '') +
    ', '

  reason += suggestion
    ? 'use ' + join(quotation(suggestion, '`'), joiner) + ' instead'
    : 'try not to use it'

  return reason
}

// Join `value`, if joinable, with `joiner` or `', '`.
function join(value, joiner) {
  return typeof value === 'string' ? value : value.join(joiner || ', ')
}

// Check whether the first character of a given value is upper-case.
// Supports a string, or a list of strings.
// Defers to the standard library for what defines a “upper case” letter.
function isCapitalized(value) {
  var char = value.charAt(0)
  return char.toUpperCase() === char
}

// Capitalize a list of values.
function capitalize(value) {
  var result = []
  var index = -1
  var length = value.length

  while (++index < length) {
    result[index] = value[index].charAt(0).toUpperCase() + value[index].slice(1)
  }

  return result
}

function titleCase($0, $1) {
  return $1.charAt(0).toUpperCase()
}


/***/ }),

/***/ 5027:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visit = __nccwpck_require__(763)
var normalize = __nccwpck_require__(594)
var isLiteral = __nccwpck_require__(2421)

var own = {}.hasOwnProperty

module.exports = search

var word = 'WordNode'
var whiteSpace = 'WhiteSpaceNode'

function search(tree, phrases, handler, options) {
  var settings = options || {}
  var apos = settings.allowApostrophes || options
  var dashes = settings.allowDashes || false
  var literals = settings.allowLiterals
  var config = {allowApostrophes: apos, allowDashes: dashes}
  var byWord = {'*': []}
  var length
  var index
  var key

  if (!tree || !tree.type) {
    throw new Error('Expected node')
  }

  if (typeof phrases !== 'object') {
    throw new Error('Expected object for phrases')
  }

  length = phrases.length
  index = -1

  if ('length' in phrases) {
    while (++index < length) {
      handlePhrase(phrases[index])
    }
  } else {
    for (key in phrases) {
      handlePhrase(key)
    }
  }

  // Search the tree.
  visit(tree, word, visitor)

  // Test a phrase.
  function test(phrase, position, parent) {
    var siblings = parent.children
    var node = siblings[position]
    var count = siblings.length
    var queue = [node]
    var expressions = phrase.split(' ').slice(1)
    var length = expressions.length
    var index = -1
    var expression

    // Move one position forward.
    position++

    // Iterate over `expressions`.
    while (++index < length) {
      // Allow joining white-space.
      while (position < count) {
        node = siblings[position]

        if (node.type !== whiteSpace) {
          break
        }

        queue.push(node)
        position++
      }

      node = siblings[position]
      expression = expressions[index]

      // Exit if there are no nodes left, if the current node is not a word, or
      // if the current word does not match the search for value.
      if (
        !node ||
        node.type !== word ||
        (expression !== '*' &&
          normalize(expression, config) !== normalize(node, config))
      ) {
        return
      }

      queue.push(node)
      position++
    }

    return queue
  }

  // Visitor for `WordNode`s.
  function visitor(node, position, parent) {
    var word
    var phrases
    var length
    var index
    var result

    if (!literals && isLiteral(parent, position)) {
      return
    }

    word = normalize(node, config)
    phrases = byWord['*'].concat(own.call(byWord, word) ? byWord[word] : [])
    length = phrases.length
    index = -1

    while (++index < length) {
      result = test(phrases[index], position, parent)

      if (result) {
        handler(result, position, parent, phrases[index])
      }
    }
  }

  // Handle a phrase.
  function handlePhrase(phrase) {
    var firstWord = normalize(phrase.split(' ', 1)[0], config)

    if (own.call(byWord, firstWord)) {
      byWord[firstWord].push(phrase)
    } else {
      byWord[firstWord] = [phrase]
    }
  }
}


/***/ }),

/***/ 4786:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 3154:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(6561)
var color = __nccwpck_require__(4786)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 763:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(3154)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 8488:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = __nccwpck_require__(1008)


/***/ }),

/***/ 1008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var format = __nccwpck_require__(3026)
var visit = __nccwpck_require__(9800)
var convert = __nccwpck_require__(6561)
var toString = __nccwpck_require__(6915)
var toWords = __nccwpck_require__(495).toWords
var requiresA = __nccwpck_require__(2826)
var requiresAn = __nccwpck_require__(5459)

module.exports = indefiniteArticle

var ruleId = 'retext-indefinite-article:retext-indefinite-article'
var vowel = /[aeiou]/
var digits = /^\d+/
var join = /^(and|or|nor)$/i
var punctuationIgnore = /^[“”‘’'"()[\]]$/
var split = /['’ -]/

var word = convert('WordNode')
var whiteSpace = convert('WhiteSpaceNode')
var punctuation = convert('PunctuationNode')

var needsA = factory(requiresA)
var needsAn = factory(requiresAn)

function indefiniteArticle() {
  return transformer
}

function transformer(tree, file) {
  visit(tree, 'WordNode', visitor)

  function visitor(node, index, parent) {
    var value = toString(node)
    var normal = lower(value)
    var message
    var following
    var suggestion
    var an

    if (normal !== 'a' && normal !== 'an') {
      return
    }

    an = value.length !== 1
    following = after(parent, index)

    if (!following) {
      return
    }

    following = toString(following)

    // Exit if `A` and this isn’t sentence-start: `Station A equals`
    if (normal !== value && !an && !firstWord(parent, index)) {
      return
    }

    // Exit if `a` is used as a letter: `a and b`.
    if (normal === value && !an && join.test(following)) {
      return
    }

    suggestion = classify(following)

    if (!(suggestion === 'an' && !an) && !(suggestion === 'a' && an)) {
      return
    }

    if (normal !== value) {
      suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1)
    }

    message = file.message(
      format('Use `%s` before `%s`, not `%s`', suggestion, following, value),
      node,
      ruleId
    )

    message.actual = value
    message.expected = [suggestion]
  }
}

// Check if there’s no word before `index`.
function firstWord(parent, index) {
  var siblings = parent.children

  while (index--) {
    if (word(siblings[index])) {
      return false
    }
  }

  return true
}

// Get the next word.
function after(parent, index) {
  var siblings = parent.children
  var sibling = siblings[++index]
  var other

  if (whiteSpace(sibling)) {
    sibling = siblings[++index]

    if (punctuation(sibling) && punctuationIgnore.test(toString(sibling))) {
      sibling = siblings[++index]
    }

    if (word(sibling)) {
      other = sibling
    }
  }

  return other
}

// Classify a word.
function classify(value) {
  var head = value.replace(digits, toWordsAndBreak).split(split, 1)[0]
  var normal = lower(head)
  var type = null

  if (needsA(head)) {
    type = 'a'
  }

  if (needsAn(head)) {
    type = type === 'a' ? 'a-or-an' : 'an'
  }

  if (!type && normal === head) {
    type = vowel.test(normal.charAt(0)) ? 'an' : 'a'
  }

  return type
}

// Create a test based on a list of phrases.
function factory(list) {
  var expressions = []
  var sensitive = []
  var insensitive = []

  construct()

  return test

  function construct() {
    var length = list.length
    var index = -1
    var value
    var normal

    while (++index < length) {
      value = list[index]
      normal = value === lower(value)

      if (value.charAt(value.length - 1) === '*') {
        // Regexes are insensitive now, once we need them this should check for
        // `normal` as well.
        expressions.push(new RegExp('^' + value.slice(0, -1), 'i'))
      } else if (normal) {
        insensitive.push(value)
      } else {
        sensitive.push(value)
      }
    }
  }

  function test(value) {
    var normal = lower(value)
    var length
    var index

    if (sensitive.indexOf(value) !== -1 || insensitive.indexOf(normal) !== -1) {
      return true
    }

    length = expressions.length
    index = -1

    while (++index < length) {
      if (expressions[index].test(value)) {
        return true
      }
    }

    return false
  }
}

// Lower-case `value`.
function lower(value) {
  return value.toLowerCase()
}

function toWordsAndBreak(value) {
  return toWords(value) + ' '
}


/***/ }),

/***/ 4118:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 4490:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(6561)
var color = __nccwpck_require__(4118)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 9800:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(4490)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 3908:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var unherit = __nccwpck_require__(8432)
var Latin = __nccwpck_require__(1852)

module.exports = parse
parse.Parser = Latin

function parse() {
  this.Parser = unherit(Latin)
}


/***/ }),

/***/ 7746:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visit = __nccwpck_require__(5462)
var toString = __nccwpck_require__(6915)
var syllable = __nccwpck_require__(16)
var daleChall = __nccwpck_require__(6897)
var spache = __nccwpck_require__(2310)
var daleChallFormula = __nccwpck_require__(2641)
var ari = __nccwpck_require__(4879)
var colemanLiau = __nccwpck_require__(7592)
var flesch = __nccwpck_require__(5422)
var smog = __nccwpck_require__(2172)
var gunningFog = __nccwpck_require__(2766)
var spacheFormula = __nccwpck_require__(9901)

module.exports = readability

var origin = 'retext-readability:readability'
var defaultTargetAge = 16
var defaultWordynessThreshold = 5
var defaultThreshold = 4 / 7

var own = {}.hasOwnProperty
var floor = Math.floor
var round = Math.round
var ceil = Math.ceil
var sqrt = Math.sqrt

function readability(options) {
  var settings = options || {}
  var targetAge = settings.age || defaultTargetAge
  var threshold = settings.threshold || defaultThreshold
  var minWords = settings.minWords

  if (minWords === null || minWords === undefined) {
    minWords = defaultWordynessThreshold
  }

  return transformer

  function transformer(tree, file) {
    visit(tree, 'SentenceNode', gather)

    function gather(sentence) {
      var familiarWords = {}
      var easyWord = {}
      var complexPolysillabicWord = 0
      var familiarWordCount = 0
      var polysillabicWord = 0
      var totalSyllables = 0
      var easyWordCount = 0
      var wordCount = 0
      var letters = 0
      var counts
      var caseless

      visit(sentence, 'WordNode', visitor)

      if (wordCount >= minWords) {
        counts = {
          complexPolysillabicWord: complexPolysillabicWord,
          polysillabicWord: polysillabicWord,
          unfamiliarWord: wordCount - familiarWordCount,
          difficultWord: wordCount - easyWordCount,
          syllable: totalSyllables,
          sentence: 1,
          word: wordCount,
          character: letters,
          letter: letters
        }

        report(file, sentence, threshold, targetAge, [
          gradeToAge(daleChallFormula.gradeLevel(daleChallFormula(counts))[1]),
          gradeToAge(ari(counts)),
          gradeToAge(colemanLiau(counts)),
          fleschToAge(flesch(counts)),
          smogToAge(smog(counts)),
          gradeToAge(gunningFog(counts)),
          gradeToAge(spacheFormula(counts))
        ])
      }

      return visit.SKIP

      function visitor(node) {
        var value = toString(node)
        var syllables = syllable(value)

        wordCount++
        totalSyllables += syllables
        letters += value.length
        caseless = value.toLowerCase()

        // Count complex words for gunning-fog based on whether they have three
        // or more syllables and whether they aren’t proper nouns.  The last is
        // checked a little simple, so this index might be over-eager.
        if (syllables >= 3) {
          polysillabicWord++

          if (value.charCodeAt(0) === caseless.charCodeAt(0)) {
            complexPolysillabicWord++
          }
        }

        // Find unique unfamiliar words for spache.
        if (
          spache.indexOf(caseless) !== -1 &&
          !own.call(familiarWords, caseless)
        ) {
          familiarWords[caseless] = true
          familiarWordCount++
        }

        // Find unique difficult words for dale-chall.
        if (
          daleChall.indexOf(caseless) !== -1 &&
          !own.call(easyWord, caseless)
        ) {
          easyWord[caseless] = true
          easyWordCount++
        }
      }
    }
  }
}

// Calculate the typical starting age (on the higher-end) when someone joins
// `grade` grade, in the US.  See:
// https://en.wikipedia.org/wiki/Educational_stage#United_States
function gradeToAge(grade) {
  return round(grade + 5)
}

// Calculate the age relating to a Flesch result.
function fleschToAge(value) {
  return 20 - floor(value / 10)
}

// Calculate the age relating to a SMOG result.  See:
// http://www.readabilityformulas.com/smog-readability-formula.php
function smogToAge(value) {
  return ceil(sqrt(value) + 2.5)
}

// Report the `results` if they’re reliably too hard for the `target` age.
// eslint-disable-next-line max-params
function report(file, node, threshold, target, results) {
  var length = results.length
  var index = -1
  var failCount = 0
  var confidence
  var label
  var message

  while (++index < length) {
    if (results[index] > target) {
      failCount++
    }
  }

  confidence = failCount / length

  if (confidence >= threshold) {
    label = failCount + '/' + length

    message = file.message(
      'Hard to read sentence (confidence: ' + label + ')',
      node,
      origin
    )
    message.actual = toString(node)
    message.expected = []
    message.confidence = confidence
    message.confidenceLabel = label
  }
}


/***/ }),

/***/ 426:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 8213:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(6561)
var color = __nccwpck_require__(426)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 5462:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(8213)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 2346:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var visit = __nccwpck_require__(4105)
var convert = __nccwpck_require__(6561)
var toString = __nccwpck_require__(6915)

module.exports = repeatedWords

var source = 'retext-repeated-words'

var word = convert('WordNode')
var whiteSpace = convert('WhiteSpaceNode')

// List of words that can legally occur twice.
var list = [
  'had',
  'that',
  'can',
  'blah',
  'beep',
  'yadda',
  'sapiens',
  'tse',
  'mau'
]

// Check for for repeated words.
function repeatedWords() {
  return transformer
}

function transformer(tree, file) {
  visit(tree, 'SentenceNode', visitor)

  function visitor(parent) {
    var children = parent.children
    var length = children.length
    var index = -1
    var child
    var before
    var value
    var node
    var previous
    var message
    var position
    var start

    while (++index < length) {
      child = children[index]

      if (word(child)) {
        value = toString(child)
        node = child
        position = index
      } else if (whiteSpace(child)) {
        start = position
        before = value
        previous = node
        value = node = position = null
      } else {
        before = value = previous = node = position = start = null
      }

      if (before && before === value && !ignore(value)) {
        message = file.message(
          'Expected `' + value + '` once, not twice',
          {
            start: previous.position.start,
            end: node.position.end
          },
          [source, value.toLowerCase().replace(/\W+/g, '-')].join(':')
        )

        message.actual = toString(children.slice(start, position + 1))
        message.expected = [toString(previous)]
      }
    }

    return visit.SKIP
  }
}

// Check if `value`, a word which occurs twice, should be ignored.
function ignore(value) {
  var head
  var tail

  // …the most heartening exhibition they had had since…
  if (list.indexOf(lower(value)) !== -1) {
    return true
  }

  head = value.charAt(0)

  if (head === head.toUpperCase()) {
    // D. D. will pop up with...
    if (value.length === 2 && value.charAt(1) === '.') {
      return true
    }

    tail = value.slice(1)

    // Duran Duran... Bella Bella...
    if (tail === lower(tail)) {
      return true
    }
  }

  return false
}

function lower(value) {
  return value.toLowerCase()
}


/***/ }),

/***/ 521:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 1636:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(6561)
var color = __nccwpck_require__(521)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 4105:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(1636)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 8755:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var nspell = __nccwpck_require__(873)
var visit = __nccwpck_require__(6895)
var toString = __nccwpck_require__(6915)
var isLiteral = __nccwpck_require__(2421)
var quote = __nccwpck_require__(3673)

module.exports = spell

var own = {}.hasOwnProperty

var source = 'retext-spell'
var digitsOnly = /^\d+$/
var smart = /’/g
var straight = "'"
var max = 30

function spell(options) {
  var queue = []
  var settings = options || {}
  var load = options && (options.dictionary || options)
  var literal = settings.ignoreLiteral
  var digits = settings.ignoreDigits
  var apos = settings.normalizeApostrophes
  var personal = settings.personal
  var config
  var loadError

  if (typeof load !== 'function') {
    throw new Error('Expected `Object`, got `' + load + '`')
  }

  config = {
    ignoreLiteral: literal === null || literal === undefined ? true : literal,
    ignoreDigits: digits === null || digits === undefined ? true : digits,
    normalizeApostrophes: apos === null || apos === undefined ? true : apos,
    ignore: settings.ignore || [],
    max: settings.max || max,
    count: 0,
    cache: {},
    checker: null
  }

  load(construct)

  return transformer

  // Transformer which either immediately invokes `all` when everything has
  // finished loading or queues the arguments.
  function transformer(tree, file, next) {
    if (loadError) {
      next(loadError)
    } else if (config.checker) {
      all(tree, file, config)
      next()
    } else {
      queue.push([tree, file, config, next])
    }
  }

  // Callback invoked when a `dictionary` is loaded (possibly erroneous) or
  // when `load`ing failed.
  // Flushes the queue when available, and sets the results on the parent scope.
  function construct(error, dictionary) {
    var length = queue.length
    var index = -1

    loadError = error

    if (dictionary) {
      config.checker = nspell(dictionary)

      if (personal) {
        config.checker.personal(personal)
      }
    }

    while (++index < length) {
      if (!error) {
        all.apply(null, queue[index])
      }

      queue[index][3](error)
    }

    queue = []
  }
}

// Check a file for spelling mistakes.
function all(tree, file, config) {
  var ignore = config.ignore
  var ignoreLiteral = config.ignoreLiteral
  var ignoreDigits = config.ignoreDigits
  var apos = config.normalizeApostrophes
  var checker = config.checker
  var cache = config.cache

  visit(tree, 'WordNode', checkWord)

  // Check one word.
  function checkWord(node, position, parent) {
    var children = node.children
    var word = toString(node)
    var correct
    var length
    var index
    var child
    var reason
    var message
    var suggestions

    if (ignoreLiteral && isLiteral(parent, position)) {
      return
    }

    if (apos) {
      word = word.replace(smart, straight)
    }

    if (irrelevant(word)) {
      return
    }

    // Check the whole word.
    correct = checker.correct(word)

    // If the whole word is not correct, check all its parts.
    // This makes sure that, if `alpha` and `bravo` are correct, `alpha-bravo`
    // is also seen as correct.
    if (!correct && children.length > 1) {
      correct = true
      length = children.length
      index = -1

      while (++index < length) {
        child = children[index]

        if (child.type !== 'TextNode' || irrelevant(child.value)) {
          continue
        }

        if (!checker.correct(child.value)) {
          correct = false
        }
      }
    }

    if (!correct) {
      reason = quote(word, '`') + ' is misspelt'

      // Suggestions are very slow, so cache them (spelling mistakes other than
      // typos often occur multiple times).
      if (own.call(cache, word)) {
        suggestions = cache[word]
        reason = concatPrefixToSuggestions(reason, suggestions)
      } else {
        if (config.count === config.max) {
          file.message(
            'Too many misspellings; no further spell suggestions are given',
            node,
            [source, 'overflow'].join(':')
          )
        }

        config.count++

        if (config.count < config.max) {
          suggestions = checker.suggest(word)

          if (suggestions.length !== 0) {
            reason = concatPrefixToSuggestions(reason, suggestions)
          }
        }

        cache[word] = suggestions || []
      }

      message = file.message(
        reason,
        node,
        [source, word.toLowerCase().replace(/\W+/, '-')].join(':')
      )
      message.actual = word
      message.expected = suggestions || []
    }
  }

  // Concatenate the formatted suggestions to a given prefix
  function concatPrefixToSuggestions(prefix, suggestions) {
    return prefix + '; did you mean ' + quote(suggestions, '`').join(', ') + '?'
  }

  // Check if a word is irrelevant.
  function irrelevant(word) {
    return (
      ignore.indexOf(word) !== -1 || (ignoreDigits && digitsOnly.test(word))
    )
  }
}


/***/ }),

/***/ 9174:
/***/ ((module) => {

module.exports = color
function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}


/***/ }),

/***/ 6158:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visitParents

var convert = __nccwpck_require__(6561)
var color = __nccwpck_require__(9174)

var CONTINUE = true
var SKIP = 'skip'
var EXIT = false

visitParents.CONTINUE = CONTINUE
visitParents.SKIP = SKIP
visitParents.EXIT = EXIT

function visitParents(tree, test, visitor, reverse) {
  var step
  var is

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  is = convert(test)
  step = reverse ? -1 : 1

  factory(tree, null, [])()

  function factory(node, index, parents) {
    var value = typeof node === 'object' && node !== null ? node : {}
    var name

    if (typeof value.type === 'string') {
      name =
        typeof value.tagName === 'string'
          ? value.tagName
          : typeof value.name === 'string'
          ? value.name
          : undefined

      visit.displayName =
        'node (' + color(value.type + (name ? '<' + name + '>' : '')) + ')'
    }

    return visit

    function visit() {
      var grandparents = parents.concat(node)
      var result = []
      var subresult
      var offset

      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents))

        if (result[0] === EXIT) {
          return result
        }
      }

      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step

        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)()

          if (subresult[0] === EXIT) {
            return subresult
          }

          offset =
            typeof subresult[1] === 'number' ? subresult[1] : offset + step
        }
      }

      return result
    }
  }
}

function toResult(value) {
  if (value !== null && typeof value === 'object' && 'length' in value) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return [value]
}


/***/ }),

/***/ 6895:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = visit

var visitParents = __nccwpck_require__(6158)

var CONTINUE = visitParents.CONTINUE
var SKIP = visitParents.SKIP
var EXIT = visitParents.EXIT

visit.CONTINUE = CONTINUE
visit.SKIP = SKIP
visit.EXIT = EXIT

function visit(tree, test, visitor, reverse) {
  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor
    visitor = test
    test = null
  }

  visitParents(tree, test, overload, reverse)

  function overload(node, parents) {
    var parent = parents[parents.length - 1]
    var index = parent ? parent.children.indexOf(node) : null
    return visitor(node, index, parent)
  }
}


/***/ }),

/***/ 7715:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var toString = __nccwpck_require__(6915)

module.exports = stringify

function stringify() {
  this.Compiler = compiler
}

function compiler(tree) {
  return toString(tree)
}


/***/ }),

/***/ 6959:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var unified = __nccwpck_require__(3726)
var latin = __nccwpck_require__(3908)
var stringify = __nccwpck_require__(7715)

module.exports = unified()
  .use(latin)
  .use(stringify)
  .freeze()


/***/ }),

/***/ 2172:
/***/ ((module) => {

"use strict";


module.exports = smog

var sentenceSize = 30
var weight = 1.043
var base = 3.1291

// Get the grade level of a given value according to the SMOG formula.
// More information is available at WikiPedia:
// <https://en.wikipedia.org/wiki/SMOG>
function smog(counts) {
  if (!counts || !counts.sentence) {
    return NaN
  }

  return (
    base +
    weight *
      Math.sqrt(
        (counts.polysillabicWord || 0) * (sentenceSize / counts.sentence)
      )
  )
}


/***/ }),

/***/ 9901:
/***/ ((module) => {

"use strict";


module.exports = spache

var sentenceWeight = 0.121
var wordWeight = 0.082
var percentage = 100
var base = 0.659

// Get the grade level of a given value according to the Spache Readability
// Formula.
// More information is available at WikiPedia:
// <https://en.wikipedia.org/wiki/Spache_Readability_Formula>
function spache(counts) {
  if (!counts || !counts.sentence || !counts.word) {
    return NaN
  }

  return (
    base +
    (sentenceWeight * counts.word) / counts.sentence +
    ((wordWeight * (counts.unfamiliarWord || 0)) / counts.word) * percentage
  )
}


/***/ }),

/***/ 8598:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stripAnsi = __nccwpck_require__(9726);
const isFullwidthCodePoint = __nccwpck_require__(2228);
const emojiRegex = __nccwpck_require__(4660);

const stringWidth = string => {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	string = string.replace(emojiRegex(), '  ');

	let width = 0;

	for (let i = 0; i < string.length; i++) {
		const code = string.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

module.exports = stringWidth;
// TODO: remove this in the next major version
module.exports.default = stringWidth;


/***/ }),

/***/ 9726:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const ansiRegex = __nccwpck_require__(732);

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ 4479:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const hasFlag = __nccwpck_require__(4766);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}
if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === true || env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === false || env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ 16:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var pluralize = __nccwpck_require__(4053)
var normalize = __nccwpck_require__(4291)
var problematic = __nccwpck_require__(7483)

module.exports = syllables

var own = {}.hasOwnProperty

// Two expressions of occurrences which normally would be counted as two
// syllables, but should be counted as one.
var EXPRESSION_MONOSYLLABIC_ONE = new RegExp(
  [
    'awe($|d|so)',
    'cia(?:l|$)',
    'tia',
    'cius',
    'cious',
    '[^aeiou]giu',
    '[aeiouy][^aeiouy]ion',
    'iou',
    'sia$',
    'eous$',
    '[oa]gue$',
    '.[^aeiuoycgltdb]{2,}ed$',
    '.ely$',
    '^jua',
    'uai',
    'eau',
    '^busi$',
    '(?:[aeiouy](?:' +
      [
        '[bcfgklmnprsvwxyz]',
        'ch',
        'dg',
        'g[hn]',
        'lch',
        'l[lv]',
        'mm',
        'nch',
        'n[cgn]',
        'r[bcnsv]',
        'squ',
        's[chkls]',
        'th'
      ].join('|') +
      ')ed$)',
    '(?:[aeiouy](?:' +
      [
        '[bdfklmnprstvy]',
        'ch',
        'g[hn]',
        'lch',
        'l[lv]',
        'mm',
        'nch',
        'nn',
        'r[nsv]',
        'squ',
        's[cklst]',
        'th'
      ].join('|') +
      ')es$)'
  ].join('|'),
  'g'
)

var EXPRESSION_MONOSYLLABIC_TWO = new RegExp(
  '[aeiouy](?:' +
    [
      '[bcdfgklmnprstvyz]',
      'ch',
      'dg',
      'g[hn]',
      'l[lv]',
      'mm',
      'n[cgns]',
      'r[cnsv]',
      'squ',
      's[cklst]',
      'th'
    ].join('|') +
    ')e$',
  'g'
)

// Four expression of occurrences which normally would be counted as one
// syllable, but should be counted as two.
var EXPRESSION_DOUBLE_SYLLABIC_ONE = new RegExp(
  '(?:' +
    [
      '([^aeiouy])\\1l',
      '[^aeiouy]ie(?:r|s?t)',
      '[aeiouym]bl',
      'eo',
      'ism',
      'asm',
      'thm',
      'dnt',
      'snt',
      'uity',
      'dea',
      'gean',
      'oa',
      'ua',
      'react?',
      'orbed', // Cancel `'.[^aeiuoycgltdb]{2,}ed$',`
      'shred', // Cancel `'.[^aeiuoycgltdb]{2,}ed$',`
      'eings?',
      '[aeiouy]sh?e[rs]'
    ].join('|') +
    ')$',
  'g'
)

var EXPRESSION_DOUBLE_SYLLABIC_TWO = new RegExp(
  [
    'creat(?!u)',
    '[^gq]ua[^auieo]',
    '[aeiou]{3}',
    '^(?:ia|mc|coa[dglx].)',
    '^re(app|es|im|us)',
    '(th|d)eist'
  ].join('|'),
  'g'
)

var EXPRESSION_DOUBLE_SYLLABIC_THREE = new RegExp(
  [
    '[^aeiou]y[ae]',
    '[^l]lien',
    'riet',
    'dien',
    'iu',
    'io',
    'ii',
    'uen',
    '[aeilotu]real',
    'real[aeilotu]',
    'iell',
    'eo[^aeiou]',
    '[aeiou]y[aeiou]'
  ].join('|'),
  'g'
)

var EXPRESSION_DOUBLE_SYLLABIC_FOUR = /[^s]ia/

// Expression to match single syllable pre- and suffixes.
var EXPRESSION_SINGLE = new RegExp(
  [
    '^(?:' +
      [
        'un',
        'fore',
        'ware',
        'none?',
        'out',
        'post',
        'sub',
        'pre',
        'pro',
        'dis',
        'side',
        'some'
      ].join('|') +
      ')',
    '(?:' +
      [
        'ly',
        'less',
        'some',
        'ful',
        'ers?',
        'ness',
        'cians?',
        'ments?',
        'ettes?',
        'villes?',
        'ships?',
        'sides?',
        'ports?',
        'shires?',
        '[gnst]ion(?:ed|s)?'
      ].join('|') +
      ')$'
  ].join('|'),
  'g'
)

// Expression to match double syllable pre- and suffixes.
var EXPRESSION_DOUBLE = new RegExp(
  [
    '^' +
      '(?:' +
      [
        'above',
        'anti',
        'ante',
        'counter',
        'hyper',
        'afore',
        'agri',
        'infra',
        'intra',
        'inter',
        'over',
        'semi',
        'ultra',
        'under',
        'extra',
        'dia',
        'micro',
        'mega',
        'kilo',
        'pico',
        'nano',
        'macro',
        'somer'
      ].join('|') +
      ')',
    '(?:fully|berry|woman|women|edly|union|((?:[bcdfghjklmnpqrstvwxz])|[aeiou])ye?ing)$'
  ].join('|'),
  'g'
)

// Expression to match triple syllable suffixes.
var EXPRESSION_TRIPLE = /(creations?|ology|ologist|onomy|onomist)$/g

// Expression to split on word boundaries.
var SPLIT = /\b/g

// Expression to merge elision.
var APOSTROPHE = /['’]/g

// Expression to remove non-alphabetic characters from a given value.
var EXPRESSION_NONALPHABETIC = /[^a-z]/g

// Wrapper to support multiple word-parts (GH-11).
function syllables(value) {
  var values = normalize(String(value))
    .toLowerCase()
    .replace(APOSTROPHE, '')
    .split(SPLIT)
  var length = values.length
  var index = -1
  var total = 0

  while (++index < length) {
    total += syllable(values[index].replace(EXPRESSION_NONALPHABETIC, ''))
  }

  return total
}

// Get syllables in a given value.
function syllable(value) {
  var count = 0
  var index
  var length
  var singular
  var parts
  var addOne
  var subtractOne

  if (value.length === 0) {
    return count
  }

  // Return early when possible.
  if (value.length < 3) {
    return 1
  }

  // If `value` is a hard to count, it might be in `problematic`.
  if (own.call(problematic, value)) {
    return problematic[value]
  }

  // Additionally, the singular word might be in `problematic`.
  singular = pluralize(value, 1)

  if (own.call(problematic, singular)) {
    return problematic[singular]
  }

  addOne = returnFactory(1)
  subtractOne = returnFactory(-1)

  // Count some prefixes and suffixes, and remove their matched ranges.
  value = value
    .replace(EXPRESSION_TRIPLE, countFactory(3))
    .replace(EXPRESSION_DOUBLE, countFactory(2))
    .replace(EXPRESSION_SINGLE, countFactory(1))

  // Count multiple consonants.
  parts = value.split(/[^aeiouy]+/)
  index = -1
  length = parts.length

  while (++index < length) {
    if (parts[index] !== '') {
      count++
    }
  }

  // Subtract one for occurrences which should be counted as one (but are
  // counted as two).
  value
    .replace(EXPRESSION_MONOSYLLABIC_ONE, subtractOne)
    .replace(EXPRESSION_MONOSYLLABIC_TWO, subtractOne)

  // Add one for occurrences which should be counted as two (but are counted as
  // one).
  value
    .replace(EXPRESSION_DOUBLE_SYLLABIC_ONE, addOne)
    .replace(EXPRESSION_DOUBLE_SYLLABIC_TWO, addOne)
    .replace(EXPRESSION_DOUBLE_SYLLABIC_THREE, addOne)
    .replace(EXPRESSION_DOUBLE_SYLLABIC_FOUR, addOne)

  // Make sure at least on is returned.
  return count || 1

  // Define scoped counters, to be used in `String#replace()` calls.
  // The scoped counter removes the matched value from the input.
  function countFactory(addition) {
    return counter
    function counter() {
      count += addition
      return ''
    }
  }

  // Define scoped counters, to be used in `String#replace()` calls.
  // The scoped counter does not remove the matched value from the input.
  function returnFactory(addition) {
    return returner
    function returner($0) {
      count += addition
      return $0
    }
  }
}


/***/ }),

/***/ 1232:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var wrap = __nccwpck_require__(5241)

module.exports = trough

trough.wrap = wrap

var slice = [].slice

// Create new middleware.
function trough() {
  var fns = []
  var middleware = {}

  middleware.run = run
  middleware.use = use

  return middleware

  // Run `fns`.  Last argument must be a completion handler.
  function run() {
    var index = -1
    var input = slice.call(arguments, 0, -1)
    var done = arguments[arguments.length - 1]

    if (typeof done !== 'function') {
      throw new Error('Expected function as last argument, not ' + done)
    }

    next.apply(null, [null].concat(input))

    // Run the next `fn`, if any.
    function next(err) {
      var fn = fns[++index]
      var params = slice.call(arguments, 0)
      var values = params.slice(1)
      var length = input.length
      var pos = -1

      if (err) {
        done(err)
        return
      }

      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos]
        }
      }

      input = values

      // Next or done.
      if (fn) {
        wrap(fn, next).apply(null, input)
      } else {
        done.apply(null, [null].concat(input))
      }
    }
  }

  // Add `fn` to the list.
  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn)
    }

    fns.push(fn)

    return middleware
  }
}


/***/ }),

/***/ 5241:
/***/ ((module) => {

"use strict";


var slice = [].slice

module.exports = wrap

// Wrap `fn`.
// Can be sync or async; return a promise, receive a completion handler, return
// new values and errors.
function wrap(fn, callback) {
  var invoked

  return wrapped

  function wrapped() {
    var params = slice.call(arguments, 0)
    var callback = fn.length > params.length
    var result

    if (callback) {
      params.push(done)
    }

    try {
      result = fn.apply(null, params)
    } catch (error) {
      // Well, this is quite the pickle.
      // `fn` received a callback and invoked it (thus continuing the pipeline),
      // but later also threw an error.
      // We’re not about to restart the pipeline again, so the only thing left
      // to do is to throw the thing instead.
      if (callback && invoked) {
        throw error
      }

      return done(error)
    }

    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done)
      } else if (result instanceof Error) {
        done(result)
      } else {
        then(result)
      }
    }
  }

  // Invoke `next`, only once.
  function done() {
    if (!invoked) {
      invoked = true

      callback.apply(null, arguments)
    }
  }

  // Invoke `done` with one value.
  // Tracks if an error is passed, too.
  function then(value) {
    done(null, value)
  }
}


/***/ }),

/***/ 5964:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(1215);


/***/ }),

/***/ 1215:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 8432:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var xtend = __nccwpck_require__(8085)
var inherits = __nccwpck_require__(5588)

module.exports = unherit

// Create a custom constructor which can be modified without affecting the
// original class.
function unherit(Super) {
  var result
  var key
  var value

  inherits(Of, Super)
  inherits(From, Of)

  // Clone values.
  result = Of.prototype

  for (key in result) {
    value = result[key]

    if (value && typeof value === 'object') {
      result[key] = 'concat' in value ? value.concat() : xtend(value)
    }
  }

  return Of

  // Constructor accepting a single argument, which itself is an `arguments`
  // object.
  function From(parameters) {
    return Super.apply(this, parameters)
  }

  // Constructor accepting variadic arguments.
  function Of() {
    if (!(this instanceof Of)) {
      return new From(arguments)
    }

    return Super.apply(this, arguments)
  }
}


/***/ }),

/***/ 3726:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var extend = __nccwpck_require__(8845)
var bail = __nccwpck_require__(5617)
var vfile = __nccwpck_require__(9082)
var trough = __nccwpck_require__(1232)
var plain = __nccwpck_require__(2212)

// Expose a frozen processor.
module.exports = unified().freeze()

var slice = [].slice
var own = {}.hasOwnProperty

// Process pipeline.
var pipeline = trough()
  .use(pipelineParse)
  .use(pipelineRun)
  .use(pipelineStringify)

function pipelineParse(p, ctx) {
  ctx.tree = p.parse(ctx.file)
}

function pipelineRun(p, ctx, next) {
  p.run(ctx.tree, ctx.file, done)

  function done(err, tree, file) {
    if (err) {
      next(err)
    } else {
      ctx.tree = tree
      ctx.file = file
      next()
    }
  }
}

function pipelineStringify(p, ctx) {
  ctx.file.contents = p.stringify(ctx.tree, ctx.file)
}

// Function to create the first processor.
function unified() {
  var attachers = []
  var transformers = trough()
  var namespace = {}
  var frozen = false
  var freezeIndex = -1

  // Data management.
  processor.data = data

  // Lock.
  processor.freeze = freeze

  // Plugins.
  processor.attachers = attachers
  processor.use = use

  // API.
  processor.parse = parse
  processor.stringify = stringify
  processor.run = run
  processor.runSync = runSync
  processor.process = process
  processor.processSync = processSync

  // Expose.
  return processor

  // Create a new processor based on the processor in the current scope.
  function processor() {
    var destination = unified()
    var length = attachers.length
    var index = -1

    while (++index < length) {
      destination.use.apply(null, attachers[index])
    }

    destination.data(extend(true, {}, namespace))

    return destination
  }

  // Freeze: used to signal a processor that has finished configuration.
  //
  // For example, take unified itself: it’s frozen.
  // Plugins should not be added to it.
  // Rather, it should be extended, by invoking it, before modifying it.
  //
  // In essence, always invoke this when exporting a processor.
  function freeze() {
    var values
    var plugin
    var options
    var transformer

    if (frozen) {
      return processor
    }

    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex]
      plugin = values[0]
      options = values[1]
      transformer = null

      if (options === false) {
        continue
      }

      if (options === true) {
        values[1] = undefined
      }

      transformer = plugin.apply(processor, values.slice(1))

      if (typeof transformer === 'function') {
        transformers.use(transformer)
      }
    }

    frozen = true
    freezeIndex = Infinity

    return processor
  }

  // Data management.
  // Getter / setter for processor-specific informtion.
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        assertUnfrozen('data', frozen)

        namespace[key] = value

        return processor
      }

      // Get `key`.
      return (own.call(namespace, key) && namespace[key]) || null
    }

    // Set space.
    if (key) {
      assertUnfrozen('data', frozen)
      namespace = key
      return processor
    }

    // Get space.
    return namespace
  }

  // Plugin management.
  //
  // Pass it:
  // *   an attacher and options,
  // *   a preset,
  // *   a list of presets, attachers, and arguments (list of attachers and
  //     options).
  function use(value) {
    var settings

    assertUnfrozen('use', frozen)

    if (value === null || value === undefined) {
      // Empty.
    } else if (typeof value === 'function') {
      addPlugin.apply(null, arguments)
    } else if (typeof value === 'object') {
      if ('length' in value) {
        addList(value)
      } else {
        addPreset(value)
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`')
    }

    if (settings) {
      namespace.settings = extend(namespace.settings || {}, settings)
    }

    return processor

    function addPreset(result) {
      addList(result.plugins)

      if (result.settings) {
        settings = extend(settings || {}, result.settings)
      }
    }

    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value)
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addPlugin.apply(null, value)
        } else {
          addPreset(value)
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`')
      }
    }

    function addList(plugins) {
      var length
      var index

      if (plugins === null || plugins === undefined) {
        // Empty.
      } else if (typeof plugins === 'object' && 'length' in plugins) {
        length = plugins.length
        index = -1

        while (++index < length) {
          add(plugins[index])
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`')
      }
    }

    function addPlugin(plugin, value) {
      var entry = find(plugin)

      if (entry) {
        if (plain(entry[1]) && plain(value)) {
          value = extend(entry[1], value)
        }

        entry[1] = value
      } else {
        attachers.push(slice.call(arguments))
      }
    }
  }

  function find(plugin) {
    var length = attachers.length
    var index = -1
    var entry

    while (++index < length) {
      entry = attachers[index]

      if (entry[0] === plugin) {
        return entry
      }
    }
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc) {
    var file = vfile(doc)
    var Parser

    freeze()
    Parser = processor.Parser
    assertParser('parse', Parser)

    if (newable(Parser, 'parse')) {
      return new Parser(String(file), file).parse()
    }

    return Parser(String(file), file) // eslint-disable-line new-cap
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), async.
  function run(node, file, cb) {
    assertNode(node)
    freeze()

    if (!cb && typeof file === 'function') {
      cb = file
      file = null
    }

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve, reject) {
      transformers.run(node, vfile(file), done)

      function done(err, tree, file) {
        tree = tree || node
        if (err) {
          reject(err)
        } else if (resolve) {
          resolve(tree)
        } else {
          cb(null, tree, file)
        }
      }
    }
  }

  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), sync.
  function runSync(node, file) {
    var complete = false
    var result

    run(node, file, done)

    assertDone('runSync', 'run', complete)

    return result

    function done(err, tree) {
      complete = true
      bail(err)
      result = tree
    }
  }

  // Stringify a unist node representation of a file (in string or vfile
  // representation) into a string using the `Compiler` on the processor.
  function stringify(node, doc) {
    var file = vfile(doc)
    var Compiler

    freeze()
    Compiler = processor.Compiler
    assertCompiler('stringify', Compiler)
    assertNode(node)

    if (newable(Compiler, 'compile')) {
      return new Compiler(node, file).compile()
    }

    return Compiler(node, file) // eslint-disable-line new-cap
  }

  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor, then run transforms on that node, and
  // compile the resulting node using the `Compiler` on the processor, and
  // store that result on the vfile.
  function process(doc, cb) {
    freeze()
    assertParser('process', processor.Parser)
    assertCompiler('process', processor.Compiler)

    if (!cb) {
      return new Promise(executor)
    }

    executor(null, cb)

    function executor(resolve, reject) {
      var file = vfile(doc)

      pipeline.run(processor, {file: file}, done)

      function done(err) {
        if (err) {
          reject(err)
        } else if (resolve) {
          resolve(file)
        } else {
          cb(null, file)
        }
      }
    }
  }

  // Process the given document (in string or vfile representation), sync.
  function processSync(doc) {
    var complete = false
    var file

    freeze()
    assertParser('processSync', processor.Parser)
    assertCompiler('processSync', processor.Compiler)
    file = vfile(doc)

    process(file, done)

    assertDone('processSync', 'process', complete)

    return file

    function done(err) {
      complete = true
      bail(err)
    }
  }
}

// Check if `value` is a constructor.
function newable(value, name) {
  return (
    typeof value === 'function' &&
    value.prototype &&
    // A function with keys in its prototype is probably a constructor.
    // Classes’ prototype methods are not enumerable, so we check if some value
    // exists in the prototype.
    (keys(value.prototype) || name in value.prototype)
  )
}

// Check if `value` is an object with keys.
function keys(value) {
  var key
  for (key in value) {
    return true
  }

  return false
}

// Assert a parser is available.
function assertParser(name, Parser) {
  if (typeof Parser !== 'function') {
    throw new Error('Cannot `' + name + '` without `Parser`')
  }
}

// Assert a compiler is available.
function assertCompiler(name, Compiler) {
  if (typeof Compiler !== 'function') {
    throw new Error('Cannot `' + name + '` without `Compiler`')
  }
}

// Assert the processor is not frozen.
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' +
        name +
        '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.'
    )
  }
}

// Assert `node` is a unist node.
function assertNode(node) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('Expected node, got `' + node + '`')
  }
}

// Assert that `complete` is `true`.
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      '`' + name + '` finished async. Use `' + asyncName + '` instead'
    )
  }
}


/***/ }),

/***/ 6561:
/***/ ((module) => {

"use strict";


module.exports = convert

function convert(test) {
  if (test == null) {
    return ok
  }

  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : allFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function allFactory(test) {
  return all

  function all(node) {
    var key

    for (key in test) {
      if (node[key] !== test[key]) return false
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = []
  var index = -1

  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }

  return any

  function any() {
    var index = -1

    while (++index < checks.length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok() {
  return true
}


/***/ }),

/***/ 6325:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var iterate = __nccwpck_require__(7968)

module.exports = modifierFactory

// Turn `callback` into a child-modifier accepting a parent.  See
// `array-iterate` for more info.
function modifierFactory(callback) {
  return iteratorFactory(wrapperFactory(callback))
}

// Turn `callback` into a `iterator' accepting a parent.
function iteratorFactory(callback) {
  return iterator

  function iterator(parent) {
    var children = parent && parent.children

    if (!children) {
      throw new Error('Missing children in `parent` for `modifier`')
    }

    iterate(children, callback, parent)
  }
}

// Pass the context as the third argument to `callback`.
function wrapperFactory(callback) {
  return wrapper

  function wrapper(value, index) {
    return callback(value, index, this)
  }
}


/***/ }),

/***/ 3391:
/***/ ((module) => {

"use strict";


var own = {}.hasOwnProperty

module.exports = stringify

function stringify(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return ''
  }

  // Node.
  if (own.call(value, 'position') || own.call(value, 'type')) {
    return position(value.position)
  }

  // Position.
  if (own.call(value, 'start') || own.call(value, 'end')) {
    return position(value)
  }

  // Point.
  if (own.call(value, 'line') || own.call(value, 'column')) {
    return point(value)
  }

  // ?
  return ''
}

function point(point) {
  if (!point || typeof point !== 'object') {
    point = {}
  }

  return index(point.line) + ':' + index(point.column)
}

function position(pos) {
  if (!pos || typeof pos !== 'object') {
    pos = {}
  }

  return point(pos.start) + '-' + point(pos.end)
}

function index(value) {
  return value && typeof value === 'number' ? value : 1
}


/***/ }),

/***/ 5113:
/***/ ((module) => {

"use strict";


module.exports = visitChildren

function visitChildren(callback) {
  return visitor

  // Visit `parent`, invoking `callback` for each child.
  function visitor(parent) {
    var index = -1
    var children = parent && parent.children

    if (!children) {
      throw new Error('Missing children in `parent` for `visitor`')
    }

    while (++index in children) {
      callback(children[index], index, parent)
    }
  }
}


/***/ }),

/***/ 3443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9513:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var stringify = __nccwpck_require__(3391)

module.exports = VMessage

// Inherit from `Error#`.
function VMessagePrototype() {}
VMessagePrototype.prototype = Error.prototype
VMessage.prototype = new VMessagePrototype()

// Message properties.
var proto = VMessage.prototype

proto.file = ''
proto.name = ''
proto.reason = ''
proto.message = ''
proto.stack = ''
proto.fatal = null
proto.column = null
proto.line = null

// Construct a new VMessage.
//
// Note: We cannot invoke `Error` on the created context, as that adds readonly
// `line` and `column` attributes on Safari 9, thus throwing and failing the
// data.
function VMessage(reason, position, origin) {
  var parts
  var range
  var location

  if (typeof position === 'string') {
    origin = position
    position = null
  }

  parts = parseOrigin(origin)
  range = stringify(position) || '1:1'

  location = {
    start: {line: null, column: null},
    end: {line: null, column: null}
  }

  // Node.
  if (position && position.position) {
    position = position.position
  }

  if (position) {
    // Position.
    if (position.start) {
      location = position
      position = position.start
    } else {
      // Point.
      location.start = position
    }
  }

  if (reason.stack) {
    this.stack = reason.stack
    reason = reason.message
  }

  this.message = reason
  this.name = range
  this.reason = reason
  this.line = position ? position.line : null
  this.column = position ? position.column : null
  this.location = location
  this.source = parts[0]
  this.ruleId = parts[1]
}

function parseOrigin(origin) {
  var result = [null, null]
  var index

  if (typeof origin === 'string') {
    index = origin.indexOf(':')

    if (index === -1) {
      result[1] = origin
    } else {
      result[0] = origin.slice(0, index)
      result[1] = origin.slice(index + 1)
    }
  }

  return result
}


/***/ }),

/***/ 8366:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var supported = __nccwpck_require__(4479).stderr.hasBasic
var width = __nccwpck_require__(8598)
var stringify = __nccwpck_require__(3391)
var repeat = __nccwpck_require__(5616)
var statistics = __nccwpck_require__(788)
var sort = __nccwpck_require__(5611)

module.exports = reporter

var push = [].push

// `log-symbols` without chalk:
/* istanbul ignore next - Windows. */
var chars =
  process.platform === 'win32'
    ? {error: '×', warning: '‼'}
    : {error: '✖', warning: '⚠'}

var labels = {
  true: 'error',
  false: 'warning',
  null: 'info',
  undefined: 'info'
}

// Report a file’s messages.
function reporter(files, options) {
  var settings = options || {}
  var one

  if (!files) {
    return ''
  }

  // Error.
  if ('name' in files && 'message' in files) {
    return String(files.stack || files)
  }

  // One file.
  if (!('length' in files)) {
    one = true
    files = [files]
  }

  return format(transform(files, settings), one, settings)
}

function transform(files, options) {
  var index = -1
  var rows = []
  var all = []
  var sizes = {}
  var messages
  var offset
  var message
  var messageRows
  var row
  var key

  while (++index < files.length) {
    messages = sort({messages: files[index].messages.concat()}).messages
    messageRows = []
    offset = -1

    while (++offset < messages.length) {
      message = messages[offset]

      if (!options.silent || message.fatal) {
        all.push(message)

        row = {
          location: stringify(
            message.location.end.line && message.location.end.column
              ? message.location
              : message.location.start
          ),
          label: labels[message.fatal],
          reason:
            (message.stack || message.message) +
            (options.verbose && message.note ? '\n' + message.note : ''),
          ruleId: message.ruleId || '',
          source: message.source || ''
        }

        for (key in row) {
          sizes[key] = Math.max(size(row[key]), sizes[key] || 0)
        }

        messageRows.push(row)
      }
    }

    if ((!options.quiet && !options.silent) || messageRows.length) {
      rows.push({type: 'file', file: files[index], stats: statistics(messages)})
      push.apply(rows, messageRows)
    }
  }

  return {rows: rows, stats: statistics(all), sizes: sizes}
}

function format(map, one, options) {
  var enabled = options.color == null ? supported : options.color
  var lines = []
  var index = -1
  var stats
  var row
  var line
  var reason
  var rest
  var match

  while (++index < map.rows.length) {
    row = map.rows[index]

    if (row.type === 'file') {
      stats = row.stats
      line = row.file.history[0] || options.defaultName || '<stdin>'

      line =
        one && !options.defaultName && !row.file.history[0]
          ? ''
          : (enabled
              ? '\x1b[4m' /* Underline. */ +
                (stats.fatal
                  ? '\x1b[31m' /* Red. */
                  : stats.total
                  ? '\x1b[33m' /* Yellow. */
                  : '\x1b[32m') /* Green. */ +
                line +
                '\x1b[39m\x1b[24m'
              : line) +
            (row.file.stored && row.file.path !== row.file.history[0]
              ? ' > ' + row.file.path
              : '')

      if (!stats.total) {
        line =
          (line ? line + ': ' : '') +
          (row.file.stored
            ? enabled
              ? '\x1b[33mwritten\x1b[39m' /* Yellow. */
              : 'written'
            : 'no issues found')
      }

      if (line) {
        if (index && map.rows[index - 1].type !== 'file') {
          lines.push('')
        }

        lines.push(line)
      }
    } else {
      reason = row.reason
      match = /\r?\n|\r/.exec(reason)

      if (match) {
        rest = reason.slice(match.index)
        reason = reason.slice(0, match.index)
      } else {
        rest = ''
      }

      lines.push(
        (
          '  ' +
          repeat(' ', map.sizes.location - size(row.location)) +
          row.location +
          '  ' +
          (enabled
            ? (row.label === 'error'
                ? '\x1b[31m' /* Red. */
                : '\x1b[33m') /* Yellow. */ +
              row.label +
              '\x1b[39m'
            : row.label) +
          repeat(' ', map.sizes.label - size(row.label)) +
          '  ' +
          reason +
          repeat(' ', map.sizes.reason - size(reason)) +
          '  ' +
          row.ruleId +
          repeat(' ', map.sizes.ruleId - size(row.ruleId)) +
          '  ' +
          (row.source || '')
        ).replace(/ +$/, '') + rest
      )
    }
  }

  stats = map.stats

  if (stats.fatal || stats.warn) {
    line = ''

    if (stats.fatal) {
      line =
        (enabled
          ? '\x1b[31m' /* Red. */ + chars.error + '\x1b[39m'
          : chars.error) +
        ' ' +
        stats.fatal +
        ' ' +
        (labels.true + (stats.fatal === 1 ? '' : 's'))
    }

    if (stats.warn) {
      line =
        (line ? line + ', ' : '') +
        (enabled
          ? '\x1b[33m' /* Yellow. */ + chars.warning + '\x1b[39m'
          : chars.warning) +
        ' ' +
        stats.warn +
        ' ' +
        (labels.false + (stats.warn === 1 ? '' : 's'))
    }

    if (stats.total !== stats.fatal && stats.total !== stats.warn) {
      line = stats.total + ' messages (' + line + ')'
    }

    lines.push('', line)
  }

  return lines.join('\n')
}

// Get the length of `value`, ignoring ANSI sequences.
function size(value) {
  var match = /\r?\n|\r/.exec(value)
  return width(match ? value.slice(0, match.index) : value)
}


/***/ }),

/***/ 5611:
/***/ ((module) => {

"use strict";


module.exports = sort

var severities = {
  true: 2,
  false: 1,
  null: 0,
  undefined: 0
}

function sort(file) {
  file.messages.sort(comparator)
  return file
}

function comparator(a, b) {
  return (
    check(a, b, 'line') ||
    check(a, b, 'column') ||
    severities[b.fatal] - severities[a.fatal] ||
    compare(a, b, 'source') ||
    compare(a, b, 'ruleId') ||
    compare(a, b, 'reason') ||
    0
  )
}

function check(a, b, property) {
  return (a[property] || 0) - (b[property] || 0)
}

function compare(a, b, property) {
  return (a[property] || '').localeCompare(b[property] || '')
}


/***/ }),

/***/ 788:
/***/ ((module) => {

"use strict";


module.exports = statistics

// Get stats for a file, list of files, or list of messages.
function statistics(files) {
  var result = {true: 0, false: 0, null: 0}

  count(files)

  return {
    fatal: result.true,
    nonfatal: result.false + result.null,
    warn: result.false,
    info: result.null,
    total: result.true + result.false + result.null
  }

  function count(value) {
    if (value) {
      if (value[0] && value[0].messages) {
        // Multiple vfiles
        countInAll(value)
      } else {
        // One vfile / messages
        countAll(value.messages || value)
      }
    }
  }

  function countInAll(files) {
    var length = files.length
    var index = -1

    while (++index < length) {
      count(files[index].messages)
    }
  }

  function countAll(messages) {
    var length = messages.length
    var index = -1
    var fatal

    while (++index < length) {
      fatal = messages[index].fatal
      result[fatal === null || fatal === undefined ? null : Boolean(fatal)]++
    }
  }
}


/***/ }),

/***/ 9082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(6)


/***/ }),

/***/ 8178:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var p = __nccwpck_require__(1062)
var proc = __nccwpck_require__(3267)
var buffer = __nccwpck_require__(3670)

module.exports = VFile

var own = {}.hasOwnProperty

// Order of setting (least specific to most), we need this because otherwise
// `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
// stem can be set.
var order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname']

VFile.prototype.toString = toString

// Access full path (`~/index.min.js`).
Object.defineProperty(VFile.prototype, 'path', {get: getPath, set: setPath})

// Access parent path (`~`).
Object.defineProperty(VFile.prototype, 'dirname', {
  get: getDirname,
  set: setDirname
})

// Access basename (`index.min.js`).
Object.defineProperty(VFile.prototype, 'basename', {
  get: getBasename,
  set: setBasename
})

// Access extname (`.js`).
Object.defineProperty(VFile.prototype, 'extname', {
  get: getExtname,
  set: setExtname
})

// Access stem (`index.min`).
Object.defineProperty(VFile.prototype, 'stem', {get: getStem, set: setStem})

// Construct a new file.
function VFile(options) {
  var prop
  var index

  if (!options) {
    options = {}
  } else if (typeof options === 'string' || buffer(options)) {
    options = {contents: options}
  } else if ('message' in options && 'messages' in options) {
    return options
  }

  if (!(this instanceof VFile)) {
    return new VFile(options)
  }

  this.data = {}
  this.messages = []
  this.history = []
  this.cwd = proc.cwd()

  // Set path related properties in the correct order.
  index = -1

  while (++index < order.length) {
    prop = order[index]

    if (own.call(options, prop)) {
      this[prop] = options[prop]
    }
  }

  // Set non-path related properties.
  for (prop in options) {
    if (order.indexOf(prop) < 0) {
      this[prop] = options[prop]
    }
  }
}

function getPath() {
  return this.history[this.history.length - 1]
}

function setPath(path) {
  assertNonEmpty(path, 'path')

  if (this.path !== path) {
    this.history.push(path)
  }
}

function getDirname() {
  return typeof this.path === 'string' ? p.dirname(this.path) : undefined
}

function setDirname(dirname) {
  assertPath(this.path, 'dirname')
  this.path = p.join(dirname || '', this.basename)
}

function getBasename() {
  return typeof this.path === 'string' ? p.basename(this.path) : undefined
}

function setBasename(basename) {
  assertNonEmpty(basename, 'basename')
  assertPart(basename, 'basename')
  this.path = p.join(this.dirname || '', basename)
}

function getExtname() {
  return typeof this.path === 'string' ? p.extname(this.path) : undefined
}

function setExtname(extname) {
  assertPart(extname, 'extname')
  assertPath(this.path, 'extname')

  if (extname) {
    if (extname.charCodeAt(0) !== 46 /* `.` */) {
      throw new Error('`extname` must start with `.`')
    }

    if (extname.indexOf('.', 1) > -1) {
      throw new Error('`extname` cannot contain multiple dots')
    }
  }

  this.path = p.join(this.dirname, this.stem + (extname || ''))
}

function getStem() {
  return typeof this.path === 'string'
    ? p.basename(this.path, this.extname)
    : undefined
}

function setStem(stem) {
  assertNonEmpty(stem, 'stem')
  assertPart(stem, 'stem')
  this.path = p.join(this.dirname || '', stem + (this.extname || ''))
}

// Get the value of the file.
function toString(encoding) {
  return (this.contents || '').toString(encoding)
}

// Assert that `part` is not a path (i.e., does not contain `p.sep`).
function assertPart(part, name) {
  if (part && part.indexOf(p.sep) > -1) {
    throw new Error(
      '`' + name + '` cannot be a path: did not expect `' + p.sep + '`'
    )
  }
}

// Assert that `part` is not empty.
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

// Assert `path` exists.
function assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}


/***/ }),

/***/ 6:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var VMessage = __nccwpck_require__(9513)
var VFile = __nccwpck_require__(8178)

module.exports = VFile

VFile.prototype.message = message
VFile.prototype.info = info
VFile.prototype.fail = fail

// Create a message with `reason` at `position`.
// When an error is passed in as `reason`, copies the stack.
function message(reason, position, origin) {
  var message = new VMessage(reason, position, origin)

  if (this.path) {
    message.name = this.path + ':' + message.name
    message.file = this.path
  }

  message.fatal = false

  this.messages.push(message)

  return message
}

// Fail: creates a vmessage, associates it with the file, and throws it.
function fail() {
  var message = this.message.apply(this, arguments)

  message.fatal = true

  throw message
}

// Info: creates a vmessage, associates it with the file, and marks the fatality
// as null.
function info() {
  var message = this.message.apply(this, arguments)

  message.fatal = null

  return message
}


/***/ }),

/***/ 1062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(5622)


/***/ }),

/***/ 3267:
/***/ ((module) => {

"use strict";


module.exports = process


/***/ }),

/***/ 7320:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 8085:
/***/ ((module) => {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ 3632:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 6897:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('["a","able","aboard","about","above","absent","accept","accident","account","ache","aching","acorn","acre","across","act","acts","add","address","admire","adventure","afar","afraid","after","afternoon","afterward","afterwards","again","against","age","aged","ago","agree","ah","ahead","aid","aim","air","airfield","airplane","airport","airship","airy","alarm","alike","alive","all","alley","alligator","allow","almost","alone","along","aloud","already","also","always","am","america","american","among","amount","an","and","angel","anger","angry","animal","another","answer","ant","any","anybody","anyhow","anyone","anything","anyway","anywhere","apart","apartment","ape","apiece","appear","apple","april","apron","are","aren\'t","arise","arithmetic","arm","armful","army","arose","around","arrange","arrive","arrived","arrow","art","artist","as","ash","ashes","aside","ask","asleep","at","ate","attack","attend","attention","august","aunt","author","auto","automobile","autumn","avenue","awake","awaken","away","awful","awfully","awhile","ax","axe","baa","babe","babies","back","background","backward","backwards","bacon","bad","badge","badly","bag","bake","baker","bakery","baking","ball","balloon","banana","band","bandage","bang","banjo","bank","banker","bar","barber","bare","barefoot","barely","bark","barn","barrel","base","baseball","basement","basket","bat","batch","bath","bathe","bathing","bathroom","bathtub","battle","battleship","bay","be","beach","bead","beam","bean","bear","beard","beast","beat","beating","beautiful","beautify","beauty","became","because","become","becoming","bed","bedbug","bedroom","bedspread","bedtime","bee","beech","beef","beefsteak","beehive","been","beer","beet","before","beg","began","beggar","begged","begin","beginning","begun","behave","behind","being","believe","bell","belong","below","belt","bench","bend","beneath","bent","berries","berry","beside","besides","best","bet","better","between","bib","bible","bicycle","bid","big","bigger","bill","billboard","bin","bind","bird","birth","birthday","biscuit","bit","bite","biting","bitter","black","blackberry","blackbird","blackboard","blackness","blacksmith","blame","blank","blanket","blast","blaze","bleed","bless","blessing","blew","blind","blindfold","blinds","block","blood","bloom","blossom","blot","blow","blue","blueberry","bluebird","blush","board","boast","boat","bob","bobwhite","bodies","body","boil","boiler","bold","bone","bonnet","boo","book","bookcase","bookkeeper","boom","boot","born","borrow","boss","both","bother","bottle","bottom","bought","bounce","bow","bow-wow","bowl","box","boxcar","boxer","boxes","boy","boyhood","bracelet","brain","brake","bran","branch","brass","brave","bread","break","breakfast","breast","breath","breathe","breeze","brick","bride","bridge","bright","brightness","bring","broad","broadcast","broke","broken","brook","broom","brother","brought","brown","brush","bubble","bucket","buckle","bud","buffalo","bug","buggy","build","building","built","bulb","bull","bullet","bum","bumblebee","bump","bun","bunch","bundle","bunny","burn","burst","bury","bus","bush","bushel","business","busy","but","butcher","butt","butter","buttercup","butterfly","buttermilk","butterscotch","button","buttonhole","buy","buzz","by","bye","cab","cabbage","cabin","cabinet","cackle","cage","cake","calendar","calf","call","caller","calling","came","camel","camp","campfire","can","can\'t","canal","canary","candle","candlestick","candy","cane","cannon","cannot","canoe","canyon","cap","cape","capital","captain","car","card","cardboard","care","careful","careless","carelessness","carload","carpenter","carpet","carriage","carrot","carry","cart","carve","case","cash","cashier","castle","cat","catbird","catch","catcher","caterpillar","catfish","catsup","cattle","caught","cause","cave","ceiling","cell","cellar","cent","center","cereal","certain","certainly","chain","chair","chalk","champion","chance","change","chap","charge","charm","chart","chase","chatter","cheap","cheat","check","checkers","cheek","cheer","cheese","cherry","chest","chew","chick","chicken","chief","child","childhood","children","chill","chilly","chimney","chin","china","chip","chipmunk","chocolate","choice","choose","chop","chorus","chose","chosen","christen","christmas","church","churn","cigarette","circle","circus","citizen","city","clang","clap","class","classmate","classroom","claw","clay","clean","cleaner","clear","clerk","clever","click","cliff","climb","clip","cloak","clock","close","closet","cloth","clothes","clothing","cloud","cloudy","clover","clown","club","cluck","clump","coach","coal","coast","coat","cob","cobbler","cocoa","coconut","cocoon","cod","codfish","coffee","coffeepot","coin","cold","collar","college","color","colored","colt","column","comb","come","comfort","comic","coming","company","compare","conductor","cone","connect","coo","cook","cooked","cookie","cookies","cooking","cool","cooler","coop","copper","copy","cord","cork","corn","corner","correct","cost","cot","cottage","cotton","couch","cough","could","couldn\'t","count","counter","country","county","course","court","cousin","cover","cow","coward","cowardly","cowboy","cozy","crab","crack","cracker","cradle","cramps","cranberry","crank","cranky","crash","crawl","crazy","cream","creamy","creek","creep","crept","cried","cries","croak","crook","crooked","crop","cross","cross-eyed","crossing","crow","crowd","crowded","crown","cruel","crumb","crumble","crush","crust","cry","cub","cuff","cup","cupboard","cupful","cure","curl","curly","curtain","curve","cushion","custard","customer","cut","cute","cutting","dab","dad","daddy","daily","dairy","daisy","dam","damage","dame","damp","dance","dancer","dancing","dandy","danger","dangerous","dare","dark","darkness","darling","darn","dart","dash","date","daughter","dawn","day","daybreak","daytime","dead","deaf","deal","dear","death","december","decide","deck","deed","deep","deer","defeat","defend","defense","delight","den","dentist","depend","deposit","describe","desert","deserve","desire","desk","destroy","devil","dew","diamond","did","didn\'t","die","died","dies","difference","different","dig","dim","dime","dine","ding-dong","dinner","dip","direct","direction","dirt","dirty","discover","dish","dislike","dismiss","ditch","dive","diver","divide","do","dock","doctor","does","doesn\'t","dog","doll","dollar","dolly","don\'t","done","donkey","door","doorbell","doorknob","doorstep","dope","dot","double","dough","dove","down","downstairs","downtown","dozen","drag","drain","drank","draw","drawer","drawing","dream","dress","dresser","dressmaker","drew","dried","drift","drill","drink","drip","drive","driven","driver","drop","drove","drown","drowsy","drub","drum","drunk","dry","duck","due","dug","dull","dumb","dump","during","dust","dusty","duty","dwarf","dwell","dwelt","dying","each","eager","eagle","ear","early","earn","earth","east","eastern","easy","eat","eaten","edge","egg","eh","eight","eighteen","eighth","eighty","either","elbow","elder","eldest","electric","electricity","elephant","eleven","elf","elm","else","elsewhere","empty","end","ending","enemy","engine","engineer","english","enjoy","enough","enter","envelope","equal","erase","eraser","errand","escape","eve","even","evening","ever","every","everybody","everyday","everyone","everything","everywhere","evil","exact","except","exchange","excited","exciting","excuse","exit","expect","explain","extra","eye","eyebrow","fable","face","facing","fact","factory","fail","faint","fair","fairy","faith","fake","fall","false","family","fan","fancy","far","far-off","faraway","fare","farm","farmer","farming","farther","fashion","fast","fasten","fat","father","fault","favor","favorite","fear","feast","feather","february","fed","feed","feel","feet","fell","fellow","felt","fence","fever","few","fib","fiddle","field","fife","fifteen","fifth","fifty","fig","fight","figure","file","fill","film","finally","find","fine","finger","finish","fire","firearm","firecracker","fireplace","fireworks","firing","first","fish","fisherman","fist","fit","fits","five","fix","flag","flake","flame","flap","flash","flashlight","flat","flea","flesh","flew","flies","flight","flip","flip-flop","float","flock","flood","floor","flop","flour","flow","flower","flowery","flutter","fly","foam","fog","foggy","fold","folks","follow","following","fond","food","fool","foolish","foot","football","footprint","for","forehead","forest","forget","forgive","forgot","forgotten","fork","form","fort","forth","fortune","forty","forward","fought","found","fountain","four","fourteen","fourth","fox","frame","free","freedom","freeze","freight","french","fresh","fret","friday","fried","friend","friendly","friendship","frighten","frog","from","front","frost","frown","froze","fruit","fry","fudge","fuel","full","fully","fun","funny","fur","furniture","further","fuzzy","gain","gallon","gallop","game","gang","garage","garbage","garden","gas","gasoline","gate","gather","gave","gay","gear","geese","general","gentle","gentleman","gentlemen","geography","get","getting","giant","gift","gingerbread","girl","give","given","giving","glad","gladly","glance","glass","glasses","gleam","glide","glory","glove","glow","glue","go","goal","goat","gobble","god","godmother","goes","going","gold","golden","goldfish","golf","gone","good","good-by","good-bye","good-looking","goodbye","goodness","goods","goody","goose","gooseberry","got","govern","government","gown","grab","gracious","grade","grain","grand","grandchild","grandchildren","granddaughter","grandfather","grandma","grandmother","grandpa","grandson","grandstand","grape","grapefruit","grapes","grass","grasshopper","grateful","grave","gravel","graveyard","gravy","gray","graze","grease","great","green","greet","grew","grind","groan","grocery","ground","group","grove","grow","guard","guess","guest","guide","gulf","gum","gun","gunpowder","guy","ha","habit","had","hadn\'t","hail","hair","haircut","hairpin","half","hall","halt","ham","hammer","hand","handful","handkerchief","handle","handwriting","hang","happen","happily","happiness","happy","harbor","hard","hardly","hardship","hardware","hare","hark","harm","harness","harp","harvest","has","hasn\'t","haste","hasten","hasty","hat","hatch","hatchet","hate","haul","have","haven\'t","having","hawk","hay","hayfield","haystack","he","he\'d","he\'ll","he\'s","head","headache","heal","health","healthy","heap","hear","heard","hearing","heart","heat","heater","heaven","heavy","heel","height","held","hell","hello","helmet","help","helper","helpful","hem","hen","henhouse","her","herd","here","here\'s","hero","hers","herself","hey","hickory","hid","hidden","hide","high","highway","hill","hillside","hilltop","hilly","him","himself","hind","hint","hip","hire","his","hiss","history","hit","hitch","hive","ho","hoe","hog","hold","holder","hole","holiday","hollow","holy","home","homely","homesick","honest","honey","honeybee","honeymoon","honk","honor","hood","hoof","hook","hoop","hop","hope","hopeful","hopeless","horn","horse","horseback","horseshoe","hose","hospital","host","hot","hotel","hound","hour","house","housetop","housewife","housework","how","however","howl","hug","huge","hum","humble","hump","hundred","hung","hunger","hungry","hunk","hunt","hunter","hurrah","hurried","hurry","hurt","husband","hush","hut","hymn","i","i\'d","i\'ll","i\'m","i\'ve","ice","icy","idea","ideal","if","ill","important","impossible","improve","in","inch","inches","income","indeed","indian","indoors","ink","inn","insect","inside","instant","instead","insult","intend","interested","interesting","into","invite","iron","is","island","isn\'t","it","it\'s","its","itself","ivory","ivy","jacket","jacks","jail","jam","january","jar","jaw","jay","jelly","jellyfish","jerk","jig","job","jockey","join","joke","joking","jolly","journey","joy","joyful","joyous","judge","jug","juice","juicy","july","jump","june","junior","junk","just","keen","keep","kept","kettle","key","kick","kid","kill","killed","kind","kindly","kindness","king","kingdom","kiss","kitchen","kite","kitten","kitty","knee","kneel","knew","knife","knit","knives","knob","knock","knot","know","known","lace","lad","ladder","ladies","lady","laid","lake","lamb","lame","lamp","land","lane","language","lantern","lap","lard","large","lash","lass","last","late","laugh","laundry","law","lawn","lawyer","lay","lazy","lead","leader","leaf","leak","lean","leap","learn","learned","least","leather","leave","leaving","led","left","leg","lemon","lemonade","lend","length","less","lesson","let","let\'s","letter","letting","lettuce","level","liberty","library","lice","lick","lid","lie","life","lift","light","lightness","lightning","like","likely","liking","lily","limb","lime","limp","line","linen","lion","lip","list","listen","lit","little","live","lively","liver","lives","living","lizard","load","loaf","loan","loaves","lock","locomotive","log","lone","lonely","lonesome","long","look","lookout","loop","loose","lord","lose","loser","loss","lost","lot","loud","love","lovely","lover","low","luck","lucky","lumber","lump","lunch","lying","ma","machine","machinery","mad","made","magazine","magic","maid","mail","mailbox","mailman","major","make","making","male","mama","mamma","man","manager","mane","manger","many","map","maple","marble","march","mare","mark","market","marriage","married","marry","mask","mast","master","mat","match","matter","mattress","may","maybe","mayor","maypole","me","meadow","meal","mean","means","meant","measure","meat","medicine","meet","meeting","melt","member","men","mend","meow","merry","mess","message","met","metal","mew","mice","middle","midnight","might","mighty","mile","miler","milk","milkman","mill","million","mind","mine","miner","mint","minute","mirror","mischief","miss","misspell","mistake","misty","mitt","mitten","mix","moment","monday","money","monkey","month","moo","moon","moonlight","moose","mop","more","morning","morrow","moss","most","mostly","mother","motor","mount","mountain","mouse","mouth","move","movie","movies","moving","mow","mr.","mrs.","much","mud","muddy","mug","mule","multiply","murder","music","must","my","myself","nail","name","nap","napkin","narrow","nasty","naughty","navy","near","nearby","nearly","neat","neck","necktie","need","needle","needn\'t","negro","neighbor","neighborhood","neither","nerve","nest","net","never","nevermore","new","news","newspaper","next","nibble","nice","nickel","night","nightgown","nine","nineteen","ninety","no","nobody","nod","noise","noisy","none","noon","nor","north","northern","nose","not","note","nothing","notice","november","now","nowhere","number","nurse","nut","o\'clock","oak","oar","oatmeal","oats","obey","ocean","october","odd","of","off","offer","office","officer","often","oh","oil","old","old-fashioned","on","once","one","onion","only","onward","open","or","orange","orchard","order","ore","organ","other","otherwise","ouch","ought","our","ours","ourselves","out","outdoors","outfit","outlaw","outline","outside","outward","oven","over","overalls","overcoat","overeat","overhead","overhear","overnight","overturn","owe","owing","owl","own","owner","ox","pa","pace","pack","package","pad","page","paid","pail","pain","painful","paint","painter","painting","pair","pal","palace","pale","pan","pancake","pane","pansy","pants","papa","paper","parade","pardon","parent","park","part","partly","partner","party","pass","passenger","past","paste","pasture","pat","patch","path","patter","pave","pavement","paw","pay","payment","pea","peace","peaceful","peach","peaches","peak","peanut","pear","pearl","peas","peck","peek","peel","peep","peg","pen","pencil","penny","people","pepper","peppermint","perfume","perhaps","person","pet","phone","piano","pick","pickle","picnic","picture","pie","piece","pig","pigeon","piggy","pile","pill","pillow","pin","pine","pineapple","pink","pint","pipe","pistol","pit","pitch","pitcher","pity","place","plain","plan","plane","plant","plate","platform","platter","play","player","playground","playhouse","playmate","plaything","pleasant","please","pleasure","plenty","plow","plug","plum","pocket","pocketbook","poem","point","poison","poke","pole","police","policeman","polish","polite","pond","ponies","pony","pool","poor","pop","popcorn","popped","porch","pork","possible","post","postage","postman","pot","potato","potatoes","pound","pour","powder","power","powerful","praise","pray","prayer","prepare","present","pretty","price","prick","prince","princess","print","prison","prize","promise","proper","protect","proud","prove","prune","public","puddle","puff","pull","pump","pumpkin","punch","punish","pup","pupil","puppy","pure","purple","purse","push","puss","pussy","pussycat","put","putting","puzzle","quack","quart","quarter","queen","queer","question","quick","quickly","quiet","quilt","quit","quite","rabbit","race","rack","radio","radish","rag","rail","railroad","railway","rain","rainbow","rainy","raise","raisin","rake","ram","ran","ranch","rang","rap","rapidly","rat","rate","rather","rattle","raw","ray","reach","read","reader","reading","ready","real","really","reap","rear","reason","rebuild","receive","recess","record","red","redbird","redbreast","refuse","reindeer","rejoice","remain","remember","remind","remove","rent","repair","repay","repeat","report","rest","return","review","reward","rib","ribbon","rice","rich","rid","riddle","ride","rider","riding","right","rim","ring","rip","ripe","rise","rising","river","road","roadside","roar","roast","rob","robber","robe","robin","rock","rocket","rocky","rode","roll","roller","roof","room","rooster","root","rope","rose","rosebud","rot","rotten","rough","round","route","row","rowboat","royal","rub","rubbed","rubber","rubbish","rug","rule","ruler","rumble","run","rung","runner","running","rush","rust","rusty","rye","sack","sad","saddle","sadness","safe","safety","said","sail","sailboat","sailor","saint","salad","sale","salt","same","sand","sandwich","sandy","sang","sank","sap","sash","sat","satin","satisfactory","saturday","sausage","savage","save","savings","saw","say","scab","scales","scare","scarf","school","schoolboy","schoolhouse","schoolmaster","schoolroom","scorch","score","scrap","scrape","scratch","scream","screen","screw","scrub","sea","seal","seam","search","season","seat","second","secret","see","seed","seeing","seek","seem","seen","seesaw","select","self","selfish","sell","send","sense","sent","sentence","separate","september","servant","serve","service","set","setting","settle","settlement","seven","seventeen","seventh","seventy","several","sew","shade","shadow","shady","shake","shaker","shaking","shall","shame","shan\'t","shape","share","sharp","shave","she","she\'d","she\'ll","she\'s","shear","shears","shed","sheep","sheet","shelf","shell","shepherd","shine","shining","shiny","ship","shirt","shock","shoe","shoemaker","shone","shook","shoot","shop","shopping","shore","short","shot","should","shoulder","shouldn\'t","shout","shovel","show","shower","shut","shy","sick","sickness","side","sidewalk","sideways","sigh","sight","sign","silence","silent","silk","sill","silly","silver","simple","sin","since","sing","singer","single","sink","sip","sir","sis","sissy","sister","sit","sitting","six","sixteen","sixth","sixty","size","skate","skater","ski","skin","skip","skirt","sky","slam","slap","slate","slave","sled","sleep","sleepy","sleeve","sleigh","slept","slice","slid","slide","sling","slip","slipped","slipper","slippery","slit","slow","slowly","sly","smack","small","smart","smell","smile","smoke","smooth","snail","snake","snap","snapping","sneeze","snow","snowball","snowflake","snowy","snuff","snug","so","soak","soap","sob","socks","sod","soda","sofa","soft","soil","sold","soldier","sole","some","somebody","somehow","someone","something","sometime","sometimes","somewhere","son","song","soon","sore","sorrow","sorry","sort","soul","sound","soup","sour","south","southern","space","spade","spank","sparrow","speak","speaker","spear","speech","speed","spell","spelling","spend","spent","spider","spike","spill","spin","spinach","spirit","spit","splash","spoil","spoke","spook","spoon","sport","spot","spread","spring","springtime","sprinkle","square","squash","squeak","squeeze","squirrel","stable","stack","stage","stair","stall","stamp","stand","star","stare","start","starve","state","states","station","stay","steak","steal","steam","steamboat","steamer","steel","steep","steeple","steer","stem","step","stepping","stick","sticky","stiff","still","stillness","sting","stir","stitch","stock","stocking","stole","stone","stood","stool","stoop","stop","stopped","stopping","store","stories","stork","storm","stormy","story","stove","straight","strange","stranger","strap","straw","strawberry","stream","street","stretch","string","strip","stripes","strong","stuck","study","stuff","stump","stung","subject","such","suck","sudden","suffer","sugar","suit","sum","summer","sun","sunday","sunflower","sung","sunk","sunlight","sunny","sunrise","sunset","sunshine","supper","suppose","sure","surely","surface","surprise","swallow","swam","swamp","swan","swat","swear","sweat","sweater","sweep","sweet","sweetheart","sweetness","swell","swept","swift","swim","swimming","swing","switch","sword","swore","table","tablecloth","tablespoon","tablet","tack","tag","tail","tailor","take","taken","taking","tale","talk","talker","tall","tame","tan","tank","tap","tape","tar","tardy","task","taste","taught","tax","tea","teach","teacher","team","tear","tease","teaspoon","teeth","telephone","tell","temper","ten","tennis","tent","term","terrible","test","than","thank","thankful","thanks","thanksgiving","that","that\'s","the","theater","thee","their","them","then","there","these","they","they\'d","they\'ll","they\'re","they\'ve","thick","thief","thimble","thin","thing","think","third","thirsty","thirteen","thirty","this","thorn","those","though","thought","thousand","thread","three","threw","throat","throne","through","throw","thrown","thumb","thunder","thursday","thy","tick","ticket","tickle","tie","tiger","tight","till","time","tin","tinkle","tiny","tip","tiptoe","tire","tired","title","to","toad","toadstool","toast","tobacco","today","toe","together","toilet","told","tomato","tomorrow","ton","tone","tongue","tonight","too","took","tool","toot","tooth","toothbrush","toothpick","top","tore","torn","toss","touch","tow","toward","towards","towel","tower","town","toy","trace","track","trade","train","tramp","trap","tray","treasure","treat","tree","trick","tricycle","tried","trim","trip","trolley","trouble","truck","true","truly","trunk","trust","truth","try","tub","tuesday","tug","tulip","tumble","tune","tunnel","turkey","turn","turtle","twelve","twenty","twice","twig","twin","two","ugly","umbrella","uncle","under","understand","underwear","undress","unfair","unfinished","unfold","unfriendly","unhappy","unhurt","uniform","united","unkind","unknown","unless","unpleasant","until","unwilling","up","upon","upper","upset","upside","upstairs","uptown","upward","us","use","used","useful","valentine","valley","valuable","value","vase","vegetable","velvet","very","vessel","victory","view","village","vine","violet","visit","visitor","voice","vote","wag","wagon","waist","wait","wake","waken","walk","wall","walnut","want","war","warm","warn","was","wash","washer","washtub","wasn\'t","waste","watch","watchman","water","watermelon","waterproof","wave","wax","way","wayside","we","we\'d","we\'ll","we\'re","we\'ve","weak","weaken","weakness","wealth","weapon","wear","weary","weather","weave","web","wedding","wednesday","wee","weed","week","weep","weigh","welcome","well","went","were","west","western","wet","whale","what","what\'s","wheat","wheel","when","whenever","where","which","while","whip","whipped","whirl","whiskey","whisky","whisper","whistle","white","who","who\'d","who\'ll","who\'s","whole","whom","whose","why","wicked","wide","wife","wiggle","wild","wildcat","will","willing","willow","win","wind","windmill","window","windy","wine","wing","wink","winner","winter","wipe","wire","wise","wish","wit","witch","with","without","woke","wolf","woman","women","won","won\'t","wonder","wonderful","wood","wooden","woodpecker","woods","wool","woolen","word","wore","work","worker","workman","world","worm","worn","worry","worse","worst","worth","would","wouldn\'t","wound","wove","wrap","wrapped","wreck","wren","wring","write","writing","written","wrong","wrote","wrung","yard","yarn","year","yell","yellow","yes","yesterday","yet","yolk","yonder","you","you\'d","you\'ll","you\'re","you\'ve","young","youngster","your","yours","yourself","yourselves","youth"]');

/***/ }),

/***/ 8354:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"105":"i","192":"A","193":"A","194":"A","195":"A","196":"A","197":"A","199":"C","200":"E","201":"E","202":"E","203":"E","204":"I","205":"I","206":"I","207":"I","209":"N","210":"O","211":"O","212":"O","213":"O","214":"O","216":"O","217":"U","218":"U","219":"U","220":"U","221":"Y","224":"a","225":"a","226":"a","227":"a","228":"a","229":"a","231":"c","232":"e","233":"e","234":"e","235":"e","236":"i","237":"i","238":"i","239":"i","241":"n","242":"o","243":"o","244":"o","245":"o","246":"o","248":"o","249":"u","250":"u","251":"u","252":"u","253":"y","255":"y","256":"A","257":"a","258":"A","259":"a","260":"A","261":"a","262":"C","263":"c","264":"C","265":"c","266":"C","267":"c","268":"C","269":"c","270":"D","271":"d","272":"D","273":"d","274":"E","275":"e","276":"E","277":"e","278":"E","279":"e","280":"E","281":"e","282":"E","283":"e","284":"G","285":"g","286":"G","287":"g","288":"G","289":"g","290":"G","291":"g","292":"H","293":"h","294":"H","295":"h","296":"I","297":"i","298":"I","299":"i","300":"I","301":"i","302":"I","303":"i","304":"I","308":"J","309":"j","310":"K","311":"k","313":"L","314":"l","315":"L","316":"l","317":"L","318":"l","319":"L","320":"l","321":"L","322":"l","323":"N","324":"n","325":"N","326":"n","327":"N","328":"n","332":"O","333":"o","334":"O","335":"o","336":"O","337":"o","338":"O","339":"o","340":"R","341":"r","342":"R","343":"r","344":"R","345":"r","346":"S","347":"s","348":"S","349":"s","350":"S","351":"s","352":"S","353":"s","354":"T","355":"t","356":"T","357":"t","358":"T","359":"t","360":"U","361":"u","362":"U","363":"u","364":"U","365":"u","366":"U","367":"u","368":"U","369":"u","370":"U","371":"u","372":"W","373":"w","374":"Y","375":"y","376":"Y","377":"Z","378":"z","379":"Z","380":"z","381":"Z","382":"z","384":"b","385":"B","386":"B","387":"b","390":"O","391":"C","392":"c","393":"D","394":"D","395":"D","396":"d","398":"E","400":"E","401":"F","402":"f","403":"G","407":"I","408":"K","409":"k","410":"l","412":"M","413":"N","414":"n","415":"O","416":"O","417":"o","420":"P","421":"p","422":"R","427":"t","428":"T","429":"t","430":"T","431":"U","432":"u","434":"V","435":"Y","436":"y","437":"Z","438":"z","461":"A","462":"a","463":"I","464":"i","465":"O","466":"o","467":"U","468":"u","477":"e","484":"G","485":"g","486":"G","487":"g","488":"K","489":"k","490":"O","491":"o","500":"G","501":"g","504":"N","505":"n","512":"A","513":"a","514":"A","515":"a","516":"E","517":"e","518":"E","519":"e","520":"I","521":"i","522":"I","523":"i","524":"O","525":"o","526":"O","527":"o","528":"R","529":"r","530":"R","531":"r","532":"U","533":"u","534":"U","535":"u","536":"S","537":"s","538":"T","539":"t","542":"H","543":"h","544":"N","545":"d","548":"Z","549":"z","550":"A","551":"a","552":"E","553":"e","558":"O","559":"o","562":"Y","563":"y","564":"l","565":"n","566":"t","567":"j","570":"A","571":"C","572":"c","573":"L","574":"T","575":"s","576":"z","579":"B","580":"U","581":"V","582":"E","583":"e","584":"J","585":"j","586":"Q","587":"q","588":"R","589":"r","590":"Y","591":"y","592":"a","593":"a","595":"b","596":"o","597":"c","598":"d","599":"d","600":"e","603":"e","604":"e","605":"e","606":"e","607":"j","608":"g","609":"g","610":"g","613":"h","614":"h","616":"i","618":"i","619":"l","620":"l","621":"l","623":"m","624":"m","625":"m","626":"n","627":"n","628":"n","629":"o","633":"r","634":"r","635":"r","636":"r","637":"r","638":"r","639":"r","640":"r","641":"r","642":"s","647":"t","648":"t","649":"u","651":"v","652":"v","653":"w","654":"y","655":"y","656":"z","657":"z","663":"c","665":"b","666":"e","667":"g","668":"h","669":"j","670":"k","671":"l","672":"q","686":"h","688":"h","690":"j","691":"r","692":"r","694":"r","695":"w","696":"y","737":"l","738":"s","739":"x","780":"v","829":"x","851":"x","867":"a","868":"e","869":"i","870":"o","871":"u","872":"c","873":"d","874":"h","875":"m","876":"r","877":"t","878":"v","879":"x","7424":"a","7427":"b","7428":"c","7429":"d","7431":"e","7432":"e","7433":"i","7434":"j","7435":"k","7436":"l","7437":"m","7438":"n","7439":"o","7440":"o","7441":"o","7442":"o","7443":"o","7446":"o","7447":"o","7448":"p","7449":"r","7450":"r","7451":"t","7452":"u","7453":"u","7454":"u","7455":"m","7456":"v","7457":"w","7458":"z","7522":"i","7523":"r","7524":"u","7525":"v","7680":"A","7681":"a","7682":"B","7683":"b","7684":"B","7685":"b","7686":"B","7687":"b","7690":"D","7691":"d","7692":"D","7693":"d","7694":"D","7695":"d","7696":"D","7697":"d","7698":"D","7699":"d","7704":"E","7705":"e","7706":"E","7707":"e","7710":"F","7711":"f","7712":"G","7713":"g","7714":"H","7715":"h","7716":"H","7717":"h","7718":"H","7719":"h","7720":"H","7721":"h","7722":"H","7723":"h","7724":"I","7725":"i","7728":"K","7729":"k","7730":"K","7731":"k","7732":"K","7733":"k","7734":"L","7735":"l","7738":"L","7739":"l","7740":"L","7741":"l","7742":"M","7743":"m","7744":"M","7745":"m","7746":"M","7747":"m","7748":"N","7749":"n","7750":"N","7751":"n","7752":"N","7753":"n","7754":"N","7755":"n","7764":"P","7765":"p","7766":"P","7767":"p","7768":"R","7769":"r","7770":"R","7771":"r","7774":"R","7775":"r","7776":"S","7777":"s","7778":"S","7779":"s","7786":"T","7787":"t","7788":"T","7789":"t","7790":"T","7791":"t","7792":"T","7793":"t","7794":"U","7795":"u","7796":"U","7797":"u","7798":"U","7799":"u","7804":"V","7805":"v","7806":"V","7807":"v","7808":"W","7809":"w","7810":"W","7811":"w","7812":"W","7813":"w","7814":"W","7815":"w","7816":"W","7817":"w","7818":"X","7819":"x","7820":"X","7821":"x","7822":"Y","7823":"y","7824":"Z","7825":"z","7826":"Z","7827":"z","7828":"Z","7829":"z","7835":"s","7840":"A","7841":"a","7842":"A","7843":"a","7864":"E","7865":"e","7866":"E","7867":"e","7868":"E","7869":"e","7880":"I","7881":"i","7882":"I","7883":"i","7884":"O","7885":"o","7886":"O","7887":"o","7908":"U","7909":"u","7910":"U","7911":"u","7922":"Y","7923":"y","7924":"Y","7925":"y","7926":"Y","7927":"y","7928":"Y","7929":"y","8305":"i","8341":"h","8342":"k","8343":"l","8344":"m","8345":"n","8346":"p","8347":"s","8348":"t","8450":"c","8458":"g","8459":"h","8460":"h","8461":"h","8464":"i","8465":"i","8466":"l","8467":"l","8468":"l","8469":"n","8472":"p","8473":"p","8474":"q","8475":"r","8476":"r","8477":"r","8484":"z","8488":"z","8492":"b","8493":"c","8495":"e","8496":"e","8497":"f","8498":"F","8499":"m","8500":"o","8506":"q","8513":"g","8514":"l","8515":"l","8516":"y","8517":"d","8518":"d","8519":"e","8520":"i","8521":"j","8526":"f","8579":"C","8580":"c","8765":"s","8766":"s","8959":"z","8999":"x","9746":"x","9776":"i","9866":"i","10005":"x","10006":"x","10007":"x","10008":"x","10625":"z","10626":"z","11362":"L","11364":"R","11365":"a","11366":"t","11373":"A","11374":"M","11375":"A","11390":"S","11391":"Z","19904":"i","42893":"H","42922":"H","42923":"E","42924":"G","42925":"L","42928":"K","42929":"T","62937":"x"}');

/***/ }),

/***/ 4689:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"aint":"ain\'t","arent":"aren\'t","couldnt":"couldn\'t","didnt":"didn\'t","doesnt":"doesn\'t","dont":"don\'t","hadnt":"hadn\'t","hasnt":"hasn\'t","havent":"haven\'t","hed":"he\'d","hes":"he\'s","howd":"how\'d","hows":"how\'s","howll":"how\'ll","Id":"I\'d","Im":"I\'m","Ive":"I\'ve","isnt":"isn\'t","mightnt":"mightn\'t","mustve":"must\'ve","mustnt":"mustn\'t","neednt":"needn\'t","oclock":"o\'clock","shant":"shan\'t","shes":"she\'s","shouldve":"should\'ve","shouldnt":"shouldn\'t","thatd":"that\'d","thats":"that\'s","thered":"there\'d","theres":"there\'s","therere":"there\'re","theyd":"they\'d","theyll":"they\'ll","theyre":"they\'re","theyve":"they\'ve","tis":"\'tis","twas":"\'twas","twere":"\'twere","wasnt":"wasn\'t","weve":"we\'ve","werent":"weren\'t","whatll":"what\'ll","whatre":"what\'re","whats":"what\'s","whatve":"what\'ve","whens":"when\'s","wheres":"where\'s","whereve":"where\'ve","whod":"who\'d","wholl":"who\'ll","whos":"who\'s","whove":"who\'ve","whys":"why\'s","wouldve":"would\'ve","wouldnt":"wouldn\'t","yall":"y\'all","youd":"you\'d","youll":"you\'ll","youre":"you\'re","youve":"you\'ve"}');

/***/ }),

/***/ 6552:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[{"id":"learning-disabled","type":"basic","categories":["a"],"considerate":{"person with learning disabilities":"a"},"inconsiderate":{"learning disabled":"a"},"note":"Refer to the person, rather than the disability, first."},{"id":"invalid","type":"basic","categories":["a"],"considerate":{"turned off":"a","has a disability":"a","person with a disability":"a","people with disabilities":"a"},"inconsiderate":{"disabled":"a","invalid":"a"},"note":"Refer to the person, rather than the disability, first."},{"id":"birth-defect","type":"basic","categories":["a"],"considerate":{"has a disability":"a","person with a disability":"a","people with disabilities":"a"},"inconsiderate":{"birth defect":"a"},"note":"Assumes/implies that a person with a disability is deficient or inferior to others. When possible, specify the functional ability or its restriction. (source: https://ncdj.org/style-guide/)"},{"id":"suffers-from-disabilities","type":"basic","categories":["a"],"considerate":{"has a disability":"a","person with a disability":"a","people with disabilities":"a"},"inconsiderate":{"suffers from disabilities":"a","suffering from disabilities":"a","suffering from a disability":"a","afflicted with disabilities":"a","afflicted with a disability":"a"},"note":"Assumes that a person with a disability has a reduced quality of life. (source: https://ncdj.org/style-guide/)"},{"id":"intellectually-disabled-people","type":"basic","categories":["a"],"considerate":{"people with intellectual disabilities":"a"},"inconsiderate":{"intellectually disabled people":"a"},"note":"Refer to the person, rather than the disability, first. (source: https://ncdj.org/style-guide/)"},{"id":"intellectually-disabled","type":"basic","categories":["a"],"considerate":{"person with an intellectual disability":"a"},"inconsiderate":{"intellectually disabled":"a","has intellectual issues":"a","suffers from intellectual disabilities":"a","suffering from intellectual disabilities":"a","suffering from an intellectual disability":"a","afflicted with intellectual disabilities":"a","afflicted with a intellectual disability":"a"},"note":"Assumes that a person with an intellectual disability has a reduced quality of life. (source: https://ncdj.org/style-guide/)"},{"id":"nuts","type":"basic","categories":["a"],"considerate":{"rude":"a","malicious":"a","mean":"a","disgusting":"a","vile":"a","person with symptoms of mental illness":"a","person with mental illness":"a","person with symptoms of a mental disorder":"a","person with a mental disorder":"a"},"inconsiderate":{"batshit":"a","psycho":"a","crazy":"a","delirious":"a","insane":"a","insanity":"a","loony":"a","lunacy":"a","lunatic":"a","mentally ill":"a","psychopathology":"a","mental defective":"a","moron":"a","moronic":"a","nuts":"a","mental case":"a","mental":"a"},"note":"Describe the behavior or illness without derogatory words. (source: https://ncdj.org/style-guide/)"},{"id":"sane","type":"basic","categories":["a"],"considerate":{"correct":"a","adequate":"a","sufficient":"a","consistent":"a","valid":"a","coherent":"a","sensible":"a","reasonable":"a"},"inconsiderate":{"sane":"a"},"note":"When describing a mathematical or programmatic value, using the word “sane” needlessly invokes the topic of mental health.  Consider using a domain-specific or neutral term instead."},{"id":"sanity-check","type":"basic","categories":["a"],"considerate":{"check":"a","assertion":"a","validation":"a","smoke test":"a"},"inconsiderate":{"sanity check":"a"},"note":"When describing a mathematical or programmatic value, using the phrase “sanity check” needlessly invokes the topic of mental health.  Consider using simply “check”, or a domain-specific or neutral term, instead."},{"id":"bipolar","type":"basic","categories":["a"],"considerate":{"fluctuating":"a","person with bipolar disorder":"a"},"inconsiderate":{"bipolar":"a"},"note":"Only use terms describing mental illness when referring to a professionally diagnosed medical condition. (source: https://ncdj.org/style-guide/)"},{"id":"schizo","type":"basic","categories":["a"],"considerate":{"person with schizophrenia":"a"},"inconsiderate":{"schizophrenic":"a","schizo":"a"},"note":"Only use terms describing mental illness when referring to a professionally diagnosed medical condition. (source: https://ncdj.org/style-guide/)"},{"id":"manic","type":"basic","categories":["a"],"considerate":{"person with schizophrenia":"a"},"inconsiderate":{"suffers from schizophrenia":"a","suffering from schizophrenia":"a","afflicted with schizophrenia":"a","manic":"a"},"note":"Assumes a person with schizophrenia experiences a reduced quality of life. (source: https://ncdj.org/style-guide/)"},{"id":"handicapped-parking","type":"basic","categories":["a"],"considerate":{"accessible parking":"a"},"inconsiderate":{"handicapped parking":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"handicapped","type":"basic","categories":["a"],"considerate":{"person with a handicap":"a","accessible":"a"},"inconsiderate":{"handicapped":"a"},"note":"Refer to the person, rather than the disability, first. (source: https://ncdj.org/style-guide/)"},{"id":"amputee","type":"basic","categories":["a"],"considerate":{"person with an amputation":"a"},"inconsiderate":{"amputee":"a"},"note":"Refer to the person, rather than the condition, first. (source: https://ncdj.org/style-guide/)"},{"id":"gimp","type":"basic","categories":["a"],"considerate":{"person with a limp":"a"},"inconsiderate":{"cripple":"a","crippled":"a","gimp":"a"},"note":"Refer to the specific disability."},{"id":"mongoloid","type":"basic","categories":["a"],"considerate":{"person with Down Syndrome":"a"},"inconsiderate":{"mongoloid":"a"}},{"id":"stroke-victim","type":"basic","categories":["a"],"considerate":{"individual who has had a stroke":"a"},"inconsiderate":{"stroke victim":"a","suffering from a stroke":"a","victim of a stroke":"a"},"note":"Refer to the person, rather than the condition, first."},{"id":"multiple-sclerosis-victim","type":"basic","categories":["a"],"considerate":{"person who has multiple sclerosis":"a"},"inconsiderate":{"suffers from multiple sclerosis":"a","suffering from multiple sclerosis":"a","victim of multiple sclerosis":"a","multiple sclerosis victim":"a","afflicted with multiple sclerosis":"a"}},{"id":"suffers-from-md","type":"basic","categories":["a"],"considerate":{"person who has muscular dystrophy":"a"},"inconsiderate":{"suffers from muscular dystrophy":"a","afflicted with muscular dystrophy":"a","suffers from MD":"a","afflicted with MD":"a"},"note":"Refer to a person\'s condition as a state, not as an affliction. (source: https://ncdj.org/style-guide)"},{"id":"family-burden","type":"basic","categories":["a"],"considerate":{"with family support needs":"a"},"inconsiderate":{"family burden":"a"}},{"id":"asylum","type":"basic","categories":["a"],"considerate":{"psychiatric hospital":"a","mental health hospital":"a"},"inconsiderate":{"asylum":"a"}},{"id":"bedlam","type":"basic","categories":["a"],"considerate":{"chaos":"a","hectic":"a","pandemonium":"a"},"inconsiderate":{"bedlam":"a","madhouse":"a","loony bin":"a"}},{"id":"downs-syndrome","type":"basic","categories":["a"],"considerate":{"Down Syndrome":"a"},"inconsiderate":{"downs syndrome":"a"},"note":"Source: https://media.specialolympics.org/soi/files/press-kit/2014_FactSheet_Final.pdf"},{"id":"retard","type":"basic","categories":["a"],"considerate":{"silly":"a","dullard":"a","person with Down Syndrome":"a","person with developmental disabilities":"a","delay":"a","hold back":"a"},"inconsiderate":{"retard":"a","retarded":"a","short bus":"a"}},{"id":"retards","type":"basic","categories":["a"],"considerate":{"sillies":"a","dullards":"a","people with developmental disabilities":"a","people with Down’s Syndrome":"a","delays":"a","holds back":"a"},"inconsiderate":{"retards":"a"}},{"id":"psychotic","type":"basic","categories":["a"],"considerate":{"person with a psychotic condition":"a","person with psychosis":"a"},"inconsiderate":{"psychotic":"a","suffers from psychosis":"a","suffering from psychosis":"a","afflicted with psychosis":"a","victim of psychosis":"a"},"note":"Only use terms describing mental illness when referring to a professionally diagnosed medical condition."},{"id":"lame","type":"basic","categories":["a"],"considerate":{"boring":"a","dull":"a"},"inconsiderate":{"lame":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"aids-victim","type":"basic","categories":["a"],"considerate":{"person with AIDS":"a"},"inconsiderate":{"suffering from aids":"a","suffer from aids":"a","suffers from aids":"a","afflicted with aids":"a","victim of aids":"a","aids victim":"a"}},{"id":"wheelchair-bound","type":"basic","categories":["a"],"considerate":{"uses a wheelchair":"a"},"inconsiderate":{"confined to a wheelchair":"a","bound to a wheelchair":"a","restricted to a wheelchair":"a","wheelchair bound":"a"}},{"id":"special-olympians","type":"basic","categories":["a"],"considerate":{"athletes":"a","Special Olympics athletes":"a"},"inconsiderate":{"special olympians":"a","special olympic athletes":"a"},"note":"When possible, use the exact discipline of sport. (source: https://media.specialolympics.org/soi/files/press-kit/2014_FactSheet_Final.pdf)"},{"id":"ablebodied","type":"basic","categories":["a"],"considerate":{"non-disabled":"a"},"inconsiderate":{"ablebodied":"a"},"note":"Can imply that people with disabilities lack the ability to use their bodies well. Sometimes `typical` can be used. (source: https://ncdj.org/style-guide/)"},{"id":"addict","type":"basic","categories":["a"],"considerate":{"person with a drug addiction":"a","person recovering from a drug addiction":"a"},"inconsiderate":{"addict":"a","junkie":"a"},"note":"Addiction is a neurobiological disease. (source: https://ncdj.org/style-guide/)"},{"id":"addicts","type":"basic","categories":["a"],"considerate":{"people with a drug addiction":"a","people recovering from a drug addiction":"a"},"inconsiderate":{"addicts":"a","junkies":"a"},"note":"Addiction is a neurobiological disease. (source: https://ncdj.org/style-guide/)"},{"id":"alcoholic","type":"basic","categories":["a"],"considerate":{"someone with an alcohol problem":"a"},"inconsiderate":{"alcoholic":"a","alcohol abuser":"a"},"note":"Alcoholism is a neurobiological disease. (source: https://ncdj.org/style-guide/)"},{"id":"deafmute","type":"basic","categories":["a"],"considerate":{"deaf":"a"},"inconsiderate":{"deaf and dumb":"a","deafmute":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"senile","type":"basic","categories":["a"],"considerate":{"person with dementia":"a"},"inconsiderate":{"demented":"a","senile":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"depressed","type":"basic","categories":["a"],"considerate":{"sad":"a","blue":"a","bummed out":"a","person with seasonal affective disorder":"a","person with psychotic depression":"a","person with postpartum depression":"a"},"inconsiderate":{"depressed":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"dwarf","type":"basic","categories":["a"],"considerate":{"person with dwarfism":"a","little person":"a","little people":"a","LP":"a","person of short stature":"a"},"inconsiderate":{"vertically challenged":"a","midget":"a","small person":"a","dwarf":"a"},"note":"Source: https://ncdj.org/style-guide/,https://www.lpaonline.org/faq-#Midget"},{"id":"dyslexic","type":"basic","categories":["a"],"considerate":{"person with dyslexia":"a"},"inconsiderate":{"dyslexic":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"epileptic","type":"basic","categories":["a"],"considerate":{"person with epilepsy":"a"},"inconsiderate":{"epileptic":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"hearing-impaired","type":"basic","categories":["a"],"considerate":{"hard of hearing":"a","partially deaf":"a","partial hearing loss":"a","deaf":"a"},"inconsiderate":{"hearing impaired":"a","hearing impairment":"a"},"note":"When possible, ask the person what they prefer. (source: https://ncdj.org/style-guide/)"},{"id":"victim-of-polio","type":"basic","categories":["a"],"considerate":{"polio":"a","person who had polio":"a"},"inconsiderate":{"infantile paralysis":"a","suffers from polio":"a","suffering from polio":"a","suffering from a polio":"a","afflicted with polio":"a","afflicted with a polio":"a","victim of polio":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"victim-of-an-injury","type":"basic","categories":["a"],"considerate":{"sustain an injury":"a","receive an injury":"a"},"inconsiderate":{"suffer from an injury":"a","suffers from an injury":"a","suffering from an injury":"a","afflicted with an injury":"a","victim of an injury":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"victim-of-injuries","type":"basic","categories":["a"],"considerate":{"sustain injuries":"a","receive injuries":"a"},"inconsiderate":{"suffer from injuries":"a","suffers from injuries":"a","suffering from injuries":"a","afflicted with injuries":"a","victim of injuries":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"paraplegic","type":"basic","categories":["a"],"considerate":{"person with paraplegia":"a"},"inconsiderate":{"paraplegic":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"quadriplegic","type":"basic","categories":["a"],"considerate":{"person with quadriplegia":"a"},"inconsiderate":{"quadriplegic":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"spaz","type":"basic","categories":["a"],"considerate":{"person with cerebral palsy":"a","twitch":"a","flinch":"a","hectic":"a"},"inconsiderate":{"spaz":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"spastic","type":"basic","categories":["a"],"considerate":{"person with cerebral palsy":"a","twitch":"a","flinch":"a"},"inconsiderate":{"spastic":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"stammering","type":"basic","categories":["a"],"considerate":{"stuttering":"a","disfluency of speech":"a"},"inconsiderate":{"stammering":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"stutterer","type":"basic","categories":["a"],"considerate":{"person who stutters":"a"},"inconsiderate":{"stutterer":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"tourettes-syndrome","type":"basic","categories":["a"],"considerate":{"Tourette syndrome":"a"},"inconsiderate":{"tourettes syndrome":"a","tourettes disorder":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"rehab-center","type":"basic","categories":["a"],"considerate":{"treatment center":"a"},"inconsiderate":{"rehab center":"a","detox center":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"rehab","type":"basic","categories":["a"],"considerate":{"treatment":"a"},"inconsiderate":{"rehab":"a","detox":"a"},"note":"Source: https://ncdj.org/style-guide/"},{"id":"sociopath","type":"basic","categories":["a"],"considerate":{"person with a personality disorder":"a","person with psychopathic personality":"a"},"inconsiderate":{"sociopath":"a"},"note":"Only use terms describing mental illness when referring to a professionally diagnosed medical condition. (source: https://ncdj.org/style-guide/)"},{"id":"sociopaths","type":"basic","categories":["a"],"considerate":{"people with psychopathic personalities":"a","people with a personality disorder":"a"},"inconsiderate":{"sociopaths":"a"},"note":"Only use terms describing mental illness when referring to a professionally diagnosed medical condition. (source: https://ncdj.org/style-guide/)"},{"id":"dumb","type":"basic","categories":["a"],"considerate":{"foolish":"a","ludicrous":"a","speechless":"a","silent":"a"},"inconsiderate":{"dumb":"a"},"note":"Dumb here is used in 2 different contexts , the inability to talk or as a curse word. (source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html)"},{"id":"wacko","type":"basic","categories":["a"],"considerate":{"foolish":"a","ludicrous":"a","unintelligent":"a"},"inconsiderate":{"simpleton":"a","stupid":"a","wacko":"a","whacko":"a","low iq":"a"},"note":"Source: http://www.mmonjejr.com/2014/02/deconstructing-stupid.html"},{"id":"panic-attack","type":"basic","categories":["a"],"considerate":{"fit of terror":"a","scare":"a"},"inconsiderate":{"panic attack":"a"}},{"id":"bony","type":"basic","categories":["a"],"considerate":{"thin":"a","slim":"a"},"inconsiderate":{"anorexic":"a","bony":"a"}},{"id":"ocd","type":"basic","categories":["a"],"considerate":{"has an anxiety disorder":"a","obsessive":"a","pedantic":"a","niggly":"a","picky":"a"},"inconsiderate":{"neurotic":"a","ocd":"a","o.c.d":"a","o.c.d.":"a"},"note":"Only use terms describing mental illness when referring to a professionally diagnosed medical condition. (source: https://english.stackexchange.com/questions/247550/)"},{"id":"insomnia","type":"basic","categories":["a"],"considerate":{"restlessness":"a","sleeplessness":"a"},"inconsiderate":{"insomnia":"a"}},{"id":"insomniac","type":"basic","categories":["a"],"considerate":{"person who has insomnia":"a"},"inconsiderate":{"insomniac":"a"}},{"id":"insomniacs","type":"basic","categories":["a"],"considerate":{"people who have insomnia":"a"},"inconsiderate":{"insomniacs":"a"}},{"id":"barren","type":"basic","categories":["a"],"considerate":{"empty":"a","sterile":"a","infertile":"a"},"inconsiderate":{"barren":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"deaf-to","type":"basic","categories":["a"],"considerate":{"careless":"a","heartless":"a","indifferent":"a","insensitive":"a"},"inconsiderate":{"blind to":"a","blind eye to":"a","blinded by":"a","deaf to":"a","deaf ear to":"a","deafened by":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"cretin","type":"basic","categories":["a"],"considerate":{"creep":"a","fool":"a"},"inconsiderate":{"cretin":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"daft","type":"basic","categories":["a"],"considerate":{"absurd":"a","foolish":"a"},"inconsiderate":{"daft":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"idiot","type":"basic","categories":["a"],"considerate":{"foolish":"a","ludicrous":"a","silly":"a"},"inconsiderate":{"feebleminded":"a","feeble minded":"a","idiot":"a","imbecile":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"harelipped","type":"basic","categories":["a"],"considerate":{"person with a cleft-lip and palate":"a"},"inconsiderate":{"harelipped":"a","cleftlipped":"a"},"note":"Sometimes it\'s cleft lip or palate, not both. Specify when possible. (source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html)"},{"id":"harelip","type":"basic","categories":["a"],"considerate":{"cleft-lip and palate":"a"},"inconsiderate":{"harelip":"a","hare lip":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"maniac","type":"basic","categories":["a"],"considerate":{"fanatic":"a","zealot":"a","enthusiast":"a"},"inconsiderate":{"maniac":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"buckteeth","type":"basic","categories":["a"],"considerate":{"person with prominent teeth":"a","prominent teeth":"a"},"inconsiderate":{"bucktoothed":"a","buckteeth":"a"}},{"id":"special","type":"basic","categories":["a"],"considerate":{"has a disability":"a","person with a disability":"a","people with disabilities":"a"},"inconsiderate":{"challenged":"a","diffability":"a","differently abled":"a","handicapable":"a","special":"a","special needs":"a","specially abled":"a"},"note":"Euphemisms for disabilities can be infantilizing. (source: http://cdrnys.org/blog/disability-dialogue/the-disability-dialogue-4-disability-euphemisms-that-need-to-bite-the-dust/,https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html)"},{"id":"libtard","type":"basic","categories":["a"],"considerate":{"disagreeable":"a","uneducated":"a","ignorant":"a","naive":"a","inconsiderate":"a"},"inconsiderate":{"fucktard":"a","libtard":"a","contard":"a"},"note":"Source: https://www.autistichoya.com/p/ableist-words-and-terms-to-avoid.html"},{"id":"add","type":"basic","categories":["a"],"considerate":{"disorganized":"a","distracted":"a","energetic":"a","hyperactive":"a","impetuous":"a","impulsive":"a","inattentive":"a","restless":"a","unfocused":"a"},"inconsiderate":{"ADD":"a","adhd":"a","a.d.d.":"a","a.d.h.d.":"a"}},{"id":"dummy","type":"basic","categories":["a"],"considerate":{"test double":"a","placeholder":"a","fake":"a","stub":"a"},"inconsiderate":{"dummyvariable":"a","dummyvalue":"a","dummyobject":"a","dummy":"a"},"note":"Dummy can refer to the inability to talk or be used as a derogatory word meaning stupid. In computer programming it is used where a value or behavior is unimportant. There are better alternatives for other use cases also."},{"id":"obvious","type":"basic","categories":["a"],"inconsiderate":{"obvious":"a","obviously":"a"},"note":"Not everything is as obvious as you might think. And if it isn’t obvious to the reader, it can hurt. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"just","type":"basic","categories":["a"],"inconsiderate":{"just":"a"},"note":"Not everything is as easy as you might think. And if it isn’t easy for the reader, it can hurt. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"basically","type":"basic","categories":["a"],"inconsiderate":{"basically":"a"},"note":"It’s probably not that basic. If you’re going to explain a confusing previous sentence with a clearer next sentence, why not drop the former and only use the latter? (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"simple","type":"basic","categories":["a"],"inconsiderate":{"simple":"a","simply":"a"},"note":"It’s probably not that simple. Even if it is, you probably don’t need to specifically say it. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"easy","type":"basic","categories":["a"],"inconsiderate":{"easy":"a","easily":"a"},"note":"It’s probably not that easy. Even if it is, you probably don’t need to specifically say it. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"of-course","type":"basic","categories":["a"],"inconsiderate":{"of course":"a"},"note":"If it’s self-evident then maybe you don’t need to describe it. If it isn’t, don’t say it. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"clearly","type":"basic","categories":["a"],"inconsiderate":{"clearly":"a"},"note":"If it’s self-evident then maybe you don’t need to describe it. If it isn’t, don’t say it. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"everyone-knows","type":"basic","categories":["a"],"inconsiderate":{"everyone knows":"a"},"note":"If it’s self-evident then maybe you don’t need to describe it. If it isn’t, don’t say it. (source: https://css-tricks.com/words-avoid-educational-writing/)"},{"id":"her-him","type":"or","categories":["female","male"],"considerate":{"their":"a","theirs":"a","them":"a"},"inconsiderate":{"her":"female","hers":"female","him":"male","his":"male"},"condition":"when referring to a person"},{"id":"he-she","type":"or","apostrophe":true,"categories":["female","male"],"considerate":{"they":"a","it":"a"},"inconsiderate":{"she":"female","he":"male","she\'d":"female","he\'d":"male","she\'ll":"female","he\'ll":"male","she\'s":"female","he\'s":"male"}},{"id":"herself-himself","type":"or","categories":["female","male"],"considerate":{"themselves":"a","theirself":"a","self":"a"},"inconsiderate":{"herself":"female","himself":"male"}},{"id":"boy-girl","type":"or","categories":["female","male"],"considerate":{"kid":"a","child":"a","youth":"a"},"inconsiderate":{"girl":"female","boy":"male"},"condition":"when referring to a person"},{"id":"gals-man","type":"or","categories":["female","male"],"considerate":{"people":"a","persons":"a","folks":"a"},"inconsiderate":{"women":"female","girls":"female","gals":"female","ladies":"female","man":"male","men":"male","guys":"male","dudes":"male","gents":"male","gentlemen":"male"}},{"id":"gal-guy","type":"or","categories":["female","male"],"considerate":{"person":"a","friend":"a","pal":"a","folk":"a","individual":"a"},"inconsiderate":{"woman":"female","gal":"female","lady":"female","babe":"female","bimbo":"female","chick":"female","guy":"male","lad":"male","fellow":"male","dude":"male","bro":"male","gentleman":"male"}},{"id":"fatherland-motherland","type":"or","categories":["female","male"],"considerate":{"native land":"a","homeland":"a"},"inconsiderate":{"motherland":"female","fatherland":"male"}},{"id":"father-tongue-mother-tongue","type":"or","categories":["female","male"],"considerate":{"native tongue":"a","native language":"a"},"inconsiderate":{"mother tongue":"female","father tongue":"male"}},{"id":"freshmen-freshwomen","type":"or","categories":["female","male"],"considerate":{"first-year students":"a","freshers":"a"},"inconsiderate":{"freshwomen":"female","freshmen":"male"}},{"id":"garbageman-garbagewoman","type":"or","categories":["female","male"],"considerate":{"garbage collector":"a","waste collector":"a","trash collector":"a"},"inconsiderate":{"garbagewoman":"female","garbageman":"male"}},{"id":"garbagemen-garbagewomen","type":"or","categories":["female","male"],"considerate":{"garbage collectors":"a","waste collectors":"a","trash collectors":"a"},"inconsiderate":{"garbagewomen":"female","garbagemen":"male"}},{"id":"chairman-chairwoman","type":"or","categories":["female","male"],"considerate":{"chair":"a","head":"a","chairperson":"a","coordinator":"a","committee head":"a","moderator":"a","presiding officer":"a"},"inconsiderate":{"chairwoman":"female","chairman":"male"}},{"id":"committee-man-committee-woman","type":"or","categories":["female","male"],"considerate":{"committee member":"a"},"inconsiderate":{"committee woman":"female","committee man":"male"}},{"id":"cowboy-cowgirl","type":"or","categories":["female","male"],"considerate":{"cowhand":"a"},"inconsiderate":{"cowgirl":"female","cowboy":"male"}},{"id":"cowboys-cowgirls","type":"or","categories":["female","male"],"considerate":{"cowhands":"a"},"inconsiderate":{"cowgirls":"female","cowboys":"male"}},{"id":"cattleman-cattlewoman","type":"or","categories":["female","male"],"considerate":{"cattle rancher":"a"},"inconsiderate":{"cattlewoman":"female","cattleman":"male"}},{"id":"cattlemen-cattlewomen","type":"or","categories":["female","male"],"considerate":{"cattle ranchers":"a"},"inconsiderate":{"cattlewomen":"female","cattlemen":"male"}},{"id":"chairmen-chairwomen","type":"or","categories":["female","male"],"considerate":{"chairs":"a","chairpersons":"a","coordinators":"a"},"inconsiderate":{"chairwomen":"female","chairmen":"male"}},{"id":"postman-postwoman","type":"or","categories":["female","male"],"considerate":{"mail carrier":"a","letter carrier":"a","postal worker":"a"},"inconsiderate":{"postwoman":"female","mailwoman":"female","postman":"male","mailman":"male"}},{"id":"postmen-postwomen","type":"or","categories":["female","male"],"considerate":{"mail carriers":"a","letter carriers":"a","postal workers":"a"},"inconsiderate":{"postwomen":"female","mailwomen":"female","postmen":"male","mailmen":"male"}},{"id":"chick-cop-policeman","type":"or","categories":["female","male"],"considerate":{"officer":"a","police officer":"a"},"inconsiderate":{"policewoman":"female","policeman":"male","chick cop":"female"}},{"id":"policemen-policewomen","type":"or","categories":["female","male"],"considerate":{"officers":"a","police officers":"a"},"inconsiderate":{"policewomen":"female","policemen":"male"}},{"id":"steward-stewardess","type":"or","categories":["female","male"],"considerate":{"flight attendant":"a"},"inconsiderate":{"stewardess":"female","steward":"male"}},{"id":"stewardesses-stewards","type":"or","categories":["female","male"],"considerate":{"flight attendants":"a"},"inconsiderate":{"stewardesses":"female","stewards":"male"}},{"id":"congressman-congresswoman","type":"or","categories":["female","male"],"considerate":{"member of congress":"a","congress person":"a","legislator":"a","representative":"a"},"inconsiderate":{"congresswoman":"female","congressman":"male"}},{"id":"congressmen-congresswomen","type":"or","categories":["female","male"],"considerate":{"members of congress":"a","congress persons":"a","legislators":"a","representatives":"a"},"inconsiderate":{"congresswomen":"female","congressmen":"male"}},{"id":"fireman-firewoman","type":"or","categories":["female","male"],"considerate":{"fire fighter":"a","fire officer":"a"},"inconsiderate":{"firewoman":"female","fireman":"male"}},{"id":"firemen-firewomen","type":"or","categories":["female","male"],"considerate":{"fire fighters":"a"},"inconsiderate":{"firewomen":"female","firemen":"male"}},{"id":"fisherman-fisherwoman","type":"or","categories":["female","male"],"considerate":{"fisher":"a","crew member":"a","fisherfolk":"a","angler":"a"},"inconsiderate":{"fisherwoman":"female","fisherman":"male"}},{"id":"fishermen-fisherwomen","type":"or","categories":["female","male"],"considerate":{"fishers":"a"},"inconsiderate":{"fisherwomen":"female","fishermen":"male"}},{"id":"brotherhood-sisterhood","type":"or","categories":["female","male"],"considerate":{"kinship":"a","community":"a"},"inconsiderate":{"sisterhood":"female","brotherhood":"male"}},{"id":"common-girl-common-man","type":"or","categories":["female","male"],"considerate":{"common person":"a","average person":"a"},"inconsiderate":{"common girl":"female","common man":"male"}},{"id":"salaryman-salarywoman","type":"or","categories":["female","male"],"considerate":{"business executive":"a","entrepreneur":"a","business person":"a","professional":"a"},"inconsiderate":{"businesswoman":"female","salarywoman":"female","businessman":"male","salaryman":"male"}},{"id":"salarymen-salarywomen","type":"or","categories":["female","male"],"considerate":{"business executives":"a","entrepreneurs":"a"},"inconsiderate":{"businesswomen":"female","salarywomen":"female","career girl":"female","career woman":"female","businessmen":"male","salarymen":"male"}},{"id":"janitor-janitress","type":"or","categories":["female","male"],"considerate":{"cleaner":"a"},"inconsiderate":{"cleaning lady":"female","cleaning girl":"female","cleaning woman":"female","janitress":"female","cleaning man":"male","cleaning boy":"male","janitor":"male"}},{"id":"janitors-janitresses","type":"or","categories":["female","male"],"considerate":{"cleaners":"a","housekeeping":"a"},"inconsiderate":{"cleaning ladies":"female","cleaning girls":"female","janitresses":"female","cleaning men":"male","janitors":"male"}},{"id":"delivery-boy-delivery-girl","type":"or","categories":["female","male"],"considerate":{"courier":"a","messenger":"a"},"inconsiderate":{"delivery girl":"female","delivery boy":"male"}},{"id":"foreman-forewoman","type":"or","categories":["female","male"],"considerate":{"supervisor":"a","shift boss":"a"},"inconsiderate":{"forewoman":"female","foreman":"male"}},{"id":"frontman,-front-man-frontwoman,-front-woman","type":"or","categories":["female","male"],"considerate":{"lead":"a","front":"a","figurehead":"a"},"inconsiderate":{"frontwoman, front woman":"female","frontman, front man":"male"}},{"id":"front-men,-frontmen-front-women,-frontwomen","type":"or","categories":["female","male"],"considerate":{"figureheads":"a"},"inconsiderate":{"front women, frontwomen":"female","front men, frontmen":"male"}},{"id":"foremen-forewomen","type":"or","categories":["female","male"],"considerate":{"supervisors":"a","shift bosses":"a"},"inconsiderate":{"forewomen":"female","foremen":"male"}},{"id":"insurance-man-insurance-woman","type":"or","categories":["female","male"],"considerate":{"insurance agent":"a"},"inconsiderate":{"insurance woman":"female","insurance man":"male"}},{"id":"insurance-men-insurance-women","type":"or","categories":["female","male"],"considerate":{"insurance agents":"a"},"inconsiderate":{"insurance women":"female","insurance men":"male"}},{"id":"landlady-landlord","type":"or","categories":["female","male"],"considerate":{"proprietor":"a","building manager":"a"},"inconsiderate":{"landlady":"female","landlord":"male"}},{"id":"landladies-landlords","type":"or","categories":["female","male"],"considerate":{"proprietors":"a","building managers":"a"},"inconsiderate":{"landladies":"female","landlords":"male"}},{"id":"alumna-alumnus","type":"or","categories":["female","male"],"considerate":{"graduate":"a"},"inconsiderate":{"alumna":"female","alumnus":"male"}},{"id":"alumnae-alumni","type":"or","categories":["female","male"],"considerate":{"graduates":"a"},"inconsiderate":{"alumnae":"female","alumni":"male"}},{"id":"newsman-newswoman","type":"or","categories":["female","male"],"considerate":{"anchor":"a","journalist":"a"},"inconsiderate":{"newswoman":"female","newspaperwoman":"female","anchorwoman":"female","newsman":"male","newspaperman":"male","anchorman":"male"}},{"id":"newsmen-newswomen","type":"or","categories":["female","male"],"considerate":{"anchors":"a","journalists":"a"},"inconsiderate":{"newswomen":"female","newspaperwomen":"female","anchorwomen":"female","newsmen":"male","newspapermen":"male","anchormen":"male"}},{"id":"repairman-repairwoman","type":"or","categories":["female","male"],"considerate":{"repairer":"a","technician":"a"},"inconsiderate":{"repairwoman":"female","repairman":"male"}},{"id":"repairmen-repairwomen","type":"or","categories":["female","male"],"considerate":{"technicians":"a"},"inconsiderate":{"repairwomen":"female","repairmen":"male"}},{"id":"saleslady-salesman","type":"or","categories":["female","male"],"considerate":{"salesperson":"a","sales clerk":"a","sales rep":"a","sales agent":"a","sales attendant":"a","seller":"a","shop assistant":"a"},"inconsiderate":{"saleswoman":"female","sales woman":"female","saleslady":"female","salesman":"male","sales man":"male"}},{"id":"salesmen-saleswomen","type":"or","categories":["female","male"],"considerate":{"sales clerks":"a","sales reps":"a","sales agents":"a","sellers":"a"},"inconsiderate":{"saleswomen":"female","sales women":"female","salesladies":"female","salesmen":"male","sales men":"male"}},{"id":"serviceman-servicewoman","type":"or","categories":["female","male"],"considerate":{"soldier":"a","service representative":"a"},"inconsiderate":{"servicewoman":"female","serviceman":"male"}},{"id":"servicemen-servicewomen","type":"or","categories":["female","male"],"considerate":{"soldiers":"a","service representatives":"a"},"inconsiderate":{"servicewomen":"female","servicemen":"male"}},{"id":"waiter-waitress","type":"or","categories":["female","male"],"considerate":{"server":"a"},"inconsiderate":{"waitress":"female","waiter":"male"}},{"id":"waiters-waitresses","type":"or","categories":["female","male"],"considerate":{"servers":"a"},"inconsiderate":{"waitresses":"female","waiters":"male"}},{"id":"workman-workwoman","type":"or","categories":["female","male"],"considerate":{"worker":"a","wage earner":"a","taxpayer":"a"},"inconsiderate":{"workwoman":"female","working woman":"female","workman":"male","working man":"male"}},{"id":"workmen-workwomen","type":"or","categories":["female","male"],"considerate":{"workers":"a"},"inconsiderate":{"workwomen":"female","workmen":"male"}},{"id":"actor-actress","type":"or","categories":["female","male"],"considerate":{"performer":"a","star":"a","artist":"a","entertainer":"a"},"inconsiderate":{"actress":"female","actor":"male"}},{"id":"actors-actresses","type":"or","categories":["female","male"],"considerate":{"performers":"a","stars":"a","artists":"a","entertainers":"a"},"inconsiderate":{"actresses":"female","actors":"male"}},{"id":"aircrewwoman-airman","type":"or","categories":["female","male"],"considerate":{"pilot":"a","aviator":"a","airstaff":"a"},"inconsiderate":{"aircrewwoman":"female","aircrew woman":"female","aircrewman":"male","airman":"male"}},{"id":"aircrewwomen-airmen","type":"or","categories":["female","male"],"considerate":{"pilots":"a","aviators":"a","airstaff":"a"},"inconsiderate":{"aircrewwomen":"female","aircrew women":"female","aircrewmen":"male","airmen":"male"}},{"id":"alderman-alderwoman","type":"or","categories":["female","male"],"considerate":{"cabinet member":"a"},"inconsiderate":{"alderwoman":"female","alderman":"male"}},{"id":"aldermen-alderwomen","type":"or","categories":["female","male"],"considerate":{"cabinet":"a","cabinet members":"a","alderperson":"a"},"inconsiderate":{"alderwomen":"female","aldermen":"male"}},{"id":"assemblyman-assemblywoman","type":"or","categories":["female","male"],"considerate":{"assembly person":"a","assembly worker":"a"},"inconsiderate":{"assemblywoman":"female","assemblyman":"male"}},{"id":"aunt-uncle","type":"or","categories":["female","male"],"considerate":{"relative":"a"},"inconsiderate":{"kinswoman":"female","aunt":"female","kinsman":"male","uncle":"male"}},{"id":"aunts-uncles","type":"or","categories":["female","male"],"considerate":{"relatives":"a"},"inconsiderate":{"kinswomen":"female","aunts":"female","kinsmen":"male","uncles":"male"}},{"id":"boogeyman-boogeywoman","type":"or","categories":["female","male"],"considerate":{"boogeymonster":"a"},"inconsiderate":{"boogeywoman":"female","boogeyman":"male"}},{"id":"boogieman-boogiewoman","type":"or","categories":["female","male"],"considerate":{"boogeymonster":"a"},"inconsiderate":{"boogiewoman":"female","boogieman":"male"}},{"id":"bogeyman-bogeywoman","type":"or","categories":["female","male"],"considerate":{"bogeymonster":"a"},"inconsiderate":{"bogeywoman":"female","bogeyman":"male"}},{"id":"bogieman-bogiewoman","type":"or","categories":["female","male"],"considerate":{"bogeymonster":"a"},"inconsiderate":{"bogiewoman":"female","bogieman":"male"}},{"id":"boogiemen-boogiewomen","type":"or","categories":["female","male"],"considerate":{"boogeymonsters":"a"},"inconsiderate":{"boogiewomen":"female","boogiemen":"male"}},{"id":"bogiemen-bogiewomen","type":"or","categories":["female","male"],"considerate":{"bogeymonsters":"a"},"inconsiderate":{"bogiewomen":"female","bogiemen":"male"}},{"id":"bondsman-bondswoman","type":"or","categories":["female","male"],"considerate":{"bonder":"a"},"inconsiderate":{"bondswoman":"female","bondsman":"male"}},{"id":"bondsmen-bondswomen","type":"or","categories":["female","male"],"considerate":{"bonders":"a"},"inconsiderate":{"bondswomen":"female","bondsmen":"male"}},{"id":"husband-wife","type":"or","categories":["female","male"],"considerate":{"partner":"a","significant other":"a","spouse":"a"},"inconsiderate":{"wife":"female","husband":"male"},"note":"Source: https://www.bustle.com/articles/108321-6-reasons-to-refer-to-your-significant-other-as-your-partner"},{"id":"husbands-wives","type":"or","categories":["female","male"],"considerate":{"partners":"a","significant others":"a","spouses":"a"},"inconsiderate":{"wives":"female","husbands":"male"},"note":"Source: https://www.bustle.com/articles/108321-6-reasons-to-refer-to-your-significant-other-as-your-partner"},{"id":"boyfriend-girlfriend","type":"or","categories":["female","male"],"considerate":{"partner":"a","friend":"a","significant other":"a"},"inconsiderate":{"girlfriend":"female","boyfriend":"male"},"note":"Source: https://www.bustle.com/articles/108321-6-reasons-to-refer-to-your-significant-other-as-your-partner"},{"id":"boyfriends-girlfriends","type":"or","categories":["female","male"],"considerate":{"partners":"a","friends":"a","significant others":"a"},"inconsiderate":{"girlfriends":"female","boyfriends":"male"},"note":"Source: https://www.bustle.com/articles/108321-6-reasons-to-refer-to-your-significant-other-as-your-partner"},{"id":"boyhood-girlhood","type":"or","categories":["female","male"],"considerate":{"childhood":"a"},"inconsiderate":{"girlhood":"female","boyhood":"male"}},{"id":"boyish-girly","type":"or","categories":["female","male"],"considerate":{"childish":"a"},"inconsiderate":{"girly":"female","girlish":"female","boyish":"male"}},{"id":"journeyman-journeywoman","type":"or","categories":["female","male"],"considerate":{"journeyperson":"a"},"inconsiderate":{"journeywoman":"female","journeyman":"male"}},{"id":"journeymen-journeywomen","type":"or","categories":["female","male"],"considerate":{"journeypersons":"a"},"inconsiderate":{"journeywomen":"female","journeymen":"male"}},{"id":"godfather-godmother","type":"or","categories":["female","male"],"considerate":{"godparent":"a","elder":"a","patron":"a"},"inconsiderate":{"godmother":"female","patroness":"female","godfather":"male"}},{"id":"granddaughter-grandson","type":"or","categories":["female","male"],"considerate":{"grandchild":"a"},"inconsiderate":{"granddaughter":"female","grandson":"male"}},{"id":"granddaughters-grandsons","type":"or","categories":["female","male"],"considerate":{"grandchildren":"a"},"inconsiderate":{"granddaughters":"female","grandsons":"male"}},{"id":"forefather-foremother","type":"or","categories":["female","male"],"considerate":{"ancestor":"a"},"inconsiderate":{"foremother":"female","forefather":"male"}},{"id":"forefathers-foremothers","type":"or","categories":["female","male"],"considerate":{"ancestors":"a"},"inconsiderate":{"foremothers":"female","forefathers":"male"}},{"id":"gramps-granny","type":"or","categories":["female","male"],"considerate":{"grandparent":"a","ancestor":"a"},"inconsiderate":{"granny":"female","grandma":"female","grandmother":"female","grandpappy":"male","granddaddy":"male","gramps":"male","grandpa":"male","grandfather":"male"}},{"id":"grandfathers-grandmothers","type":"or","categories":["female","male"],"considerate":{"grandparents":"a","ancestors":"a"},"inconsiderate":{"grandmothers":"female","grandfathers":"male"}},{"id":"bride-groom","type":"or","categories":["female","male"],"considerate":{"spouse":"a","newlywed":"a"},"inconsiderate":{"bride":"female","groom":"male"}},{"id":"brother-sister","type":"or","categories":["female","male"],"considerate":{"sibling":"a"},"inconsiderate":{"sister":"female","brother":"male"}},{"id":"brothers-sisters","type":"or","categories":["female","male"],"considerate":{"siblings":"a"},"inconsiderate":{"sisters":"female","brothers":"male"}},{"id":"cameraman-camerawoman","type":"or","categories":["female","male"],"considerate":{"camera operator":"a","camera person":"a"},"inconsiderate":{"camerawoman":"female","cameraman":"male"}},{"id":"cameramen-camerawomen","type":"or","categories":["female","male"],"considerate":{"camera operators":"a"},"inconsiderate":{"camerawomen":"female","cameramen":"male"}},{"id":"caveman-cavewoman","type":"or","categories":["female","male"],"considerate":{"troglodyte":"a","hominidae":"a"},"inconsiderate":{"cavewoman":"female","caveman":"male"}},{"id":"cavemen-cavewomen","type":"or","categories":["female","male"],"considerate":{"troglodytae":"a","troglodyti":"a","troglodytes":"a","hominids":"a"},"inconsiderate":{"cavewomen":"female","cavemen":"male"}},{"id":"clergyman-clergywoman","type":"or","categories":["female","male"],"considerate":{"clergyperson":"a","clergy":"a","cleric":"a"},"inconsiderate":{"clergywoman":"female","clergyman":"male"}},{"id":"clergymen-clergywomen","type":"or","categories":["female","male"],"considerate":{"clergies":"a","clerics":"a"},"inconsiderate":{"clergywomen":"female","clergymen":"male"}},{"id":"councilman-councilwoman","type":"or","categories":["female","male"],"considerate":{"council member":"a"},"inconsiderate":{"councilwoman":"female","councilman":"male"}},{"id":"councilmen-councilwomen","type":"or","categories":["female","male"],"considerate":{"council members":"a"},"inconsiderate":{"councilwomen":"female","councilmen":"male"}},{"id":"countryman-countrywoman","type":"or","categories":["female","male"],"considerate":{"country person":"a"},"inconsiderate":{"countrywoman":"female","countryman":"male"}},{"id":"countrymen-countrywomen","type":"or","categories":["female","male"],"considerate":{"country folk":"a"},"inconsiderate":{"countrywomen":"female","countrymen":"male"}},{"id":"handyman-handywoman","type":"or","categories":["female","male"],"considerate":{"artisan":"a","craftsperson":"a","skilled worker":"a"},"inconsiderate":{"handywoman":"female","craftswoman":"female","handyman":"male","craftsman":"male"}},{"id":"host-hostess","type":"or","categories":["female","male"],"considerate":{"presenter":"a","entertainer":"a","emcee":"a"},"inconsiderate":{"hostess":"female","host":"male"}},{"id":"hostesses-hosts","type":"or","categories":["female","male"],"considerate":{"presenters":"a","entertainers":"a","emcees":"a"},"inconsiderate":{"hostesses":"female","hosts":"male"}},{"id":"handymen-handywomen","type":"or","categories":["female","male"],"considerate":{"artisans":"a","craftspersons":"a","skilled workers":"a"},"inconsiderate":{"handywomen":"female","craftswomen":"female","handymen":"male","craftsmen":"male"}},{"id":"hangman-hangwoman","type":"or","categories":["female","male"],"considerate":{"guillotine":"a"},"inconsiderate":{"hangwoman":"female","hangman":"male"}},{"id":"hangmen-hangwomen","type":"or","categories":["female","male"],"considerate":{"guillotines":"a"},"inconsiderate":{"hangwomen":"female","hangmen":"male"}},{"id":"henchman-henchwoman","type":"or","categories":["female","male"],"considerate":{"sidekick":"a"},"inconsiderate":{"henchwoman":"female","henchman":"male"}},{"id":"henchmen-henchwomen","type":"or","categories":["female","male"],"considerate":{"sidekicks":"a"},"inconsiderate":{"henchwomen":"female","henchmen":"male"}},{"id":"hero-heroine","type":"or","categories":["female","male"],"considerate":{"role-model":"a","mentor":"a"},"inconsiderate":{"heroine":"female","hero":"male"}},{"id":"heroes-heroines","type":"or","categories":["female","male"],"considerate":{"role-models":"a","mentor":"a"},"inconsiderate":{"heroines":"female","heroes":"male"}},{"id":"maternal-paternal","type":"or","categories":["female","male"],"considerate":{"parental":"a","warm":"a","intimate":"a"},"inconsiderate":{"maternal":"female","paternal":"male","fraternal":"male"}},{"id":"maternity-paternity","type":"or","categories":["female","male"],"considerate":{"parental":"a"},"inconsiderate":{"maternity":"female","paternity":"male"}},{"id":"dads-moms","type":"or","categories":["female","male"],"considerate":{"parents":"a"},"inconsiderate":{"mamas":"female","mothers":"female","moms":"female","mums":"female","mommas":"female","mommies":"female","papas":"male","fathers":"male","dads":"male","daddies":"male"}},{"id":"dad-mom","type":"or","categories":["female","male"],"considerate":{"parent":"a"},"inconsiderate":{"mama":"female","mother":"female","mom":"female","mum":"female","momma":"female","mommy":"female","papa":"male","father":"male","dad":"male","pop":"male","daddy":"male"}},{"id":"daughter-son","type":"or","categories":["female","male"],"considerate":{"child":"a"},"inconsiderate":{"daughter":"female","son":"male"}},{"id":"daughters-sons","type":"or","categories":["female","male"],"considerate":{"children":"a"},"inconsiderate":{"daughters":"female","sons":"male"}},{"id":"doorman-doorwoman","type":"or","categories":["female","male"],"considerate":{"concierge":"a"},"inconsiderate":{"doorwoman":"female","doorman":"male"}},{"id":"doormen-doorwomen","type":"or","categories":["female","male"],"considerate":{"concierges":"a"},"inconsiderate":{"doorwomen":"female","doormen":"male"}},{"id":"feminin-manly","type":"or","categories":["female","male"],"considerate":{"humanly":"a","mature":"a"},"inconsiderate":{"feminin":"female","dudely":"male","manly":"male"}},{"id":"females-males","type":"or","categories":["female","male"],"considerate":{"humans":"a"},"inconsiderate":{"females":"female","males":"male"}},{"id":"king-queen","type":"or","categories":["female","male"],"considerate":{"ruler":"a"},"inconsiderate":{"empress":"female","queen":"female","emperor":"male","king":"male"}},{"id":"kings-queens","type":"or","categories":["female","male"],"considerate":{"rulers":"a"},"inconsiderate":{"empresses":"female","queens":"female","emperors":"male","kings":"male"}},{"id":"kingsize-queensize","type":"or","categories":["female","male"],"considerate":{"jumbo":"a","gigantic":"a"},"inconsiderate":{"queensize":"female","kingsize":"male"}},{"id":"kingmaker-queenmaker","type":"or","categories":["female","male"],"considerate":{"power behind the throne":"a"},"inconsiderate":{"queenmaker":"female","kingmaker":"male"}},{"id":"layman-laywoman","type":"or","categories":["female","male"],"considerate":{"civilian":"a"},"inconsiderate":{"laywoman":"female","layman":"male"}},{"id":"laymen-laywomen","type":"or","categories":["female","male"],"considerate":{"civilians":"a"},"inconsiderate":{"laywomen":"female","laymen":"male"}},{"id":"dame-lord","type":"or","categories":["female","male"],"considerate":{"official":"a","owner":"a","expert":"a","superior":"a","chief":"a","ruler":"a"},"inconsiderate":{"dame":"female","lord":"male"}},{"id":"dames-lords","type":"or","categories":["female","male"],"considerate":{"officials":"a","chiefs":"a","rulers":"a"},"inconsiderate":{"dames":"female","lords":"male"}},{"id":"manhood-womanhood","type":"or","categories":["female","male"],"considerate":{"adulthood":"a","personhood":"a","maturity":"a"},"inconsiderate":{"womanhood":"female","masculinity":"male","manhood":"male"}},{"id":"femininity-manliness","type":"or","categories":["female","male"],"considerate":{"humanity":"a"},"inconsiderate":{"femininity":"female","manliness":"male"}},{"id":"marksman-markswoman","type":"or","categories":["female","male"],"considerate":{"shooter":"a"},"inconsiderate":{"markswoman":"female","marksman":"male"}},{"id":"marksmen-markswomen","type":"or","categories":["female","male"],"considerate":{"shooters":"a"},"inconsiderate":{"markswomen":"female","marksmen":"male"}},{"id":"middleman-middlewoman","type":"or","categories":["female","male"],"considerate":{"intermediary":"a","go-between":"a"},"inconsiderate":{"middlewoman":"female","middleman":"male"}},{"id":"middlemen-middlewomen","type":"or","categories":["female","male"],"considerate":{"intermediaries":"a","go-betweens":"a"},"inconsiderate":{"middlewomen":"female","middlemen":"male"}},{"id":"milkman-milkwoman","type":"or","categories":["female","male"],"considerate":{"milk person":"a"},"inconsiderate":{"milkwoman":"female","milkman":"male"}},{"id":"milkmen-milkwomen","type":"or","categories":["female","male"],"considerate":{"milk people":"a"},"inconsiderate":{"milkwomen":"female","milkmen":"male"}},{"id":"nephew-niece","type":"or","categories":["female","male"],"considerate":{"nibling":"a","sibling’s child":"a"},"inconsiderate":{"niece":"female","nephew":"male"}},{"id":"nephews-nieces","type":"or","categories":["female","male"],"considerate":{"niblings":"a","sibling’s children":"a"},"inconsiderate":{"nieces":"female","nephews":"male"}},{"id":"nobleman-noblewoman","type":"or","categories":["female","male"],"considerate":{"noble":"a"},"inconsiderate":{"noblewoman":"female","nobleman":"male"}},{"id":"noblemen-noblewomen","type":"or","categories":["female","male"],"considerate":{"nobles":"a"},"inconsiderate":{"noblewomen":"female","noblemen":"male"}},{"id":"ombudsman-ombudswoman","type":"or","categories":["female","male"],"considerate":{"notary":"a","consumer advocate":"a","trouble shooter":"a","omsbudperson":"a","mediator":"a"},"inconsiderate":{"ombudswoman":"female","ombudsman":"male"}},{"id":"ombudsmen-ombudswomen","type":"or","categories":["female","male"],"considerate":{"notaries":"a","omsbudpersons":"a","omsbudpeople":"a","mediators":"a"},"inconsiderate":{"ombudswomen":"female","ombudsmen":"male"}},{"id":"prince-princess","type":"or","categories":["female","male"],"considerate":{"heir":"a"},"inconsiderate":{"princess":"female","prince":"male"}},{"id":"princes-princesses","type":"or","categories":["female","male"],"considerate":{"heirs":"a"},"inconsiderate":{"princesses":"female","princes":"male"}},{"id":"sandman-sandwoman","type":"or","categories":["female","male"],"considerate":{"fairy":"a"},"inconsiderate":{"sandwoman":"female","sandman":"male"}},{"id":"sandmen-sandwomen","type":"or","categories":["female","male"],"considerate":{"fairies":"a"},"inconsiderate":{"sandwomen":"female","sandmen":"male"}},{"id":"showman-showwoman","type":"or","categories":["female","male"],"considerate":{"promoter":"a"},"inconsiderate":{"showwoman":"female","showman":"male"}},{"id":"showmen-showwomen","type":"or","categories":["female","male"],"considerate":{"promoters":"a"},"inconsiderate":{"showwomen":"female","show women":"female","showmen":"male"}},{"id":"spaceman-spacewoman","type":"or","categories":["female","male"],"considerate":{"astronaut":"a"},"inconsiderate":{"spacewoman":"female","spaceman":"male"}},{"id":"spacemen-spacewomen","type":"or","categories":["female","male"],"considerate":{"astronauts":"a"},"inconsiderate":{"spacewomen":"female","spacemen":"male"}},{"id":"spokesman-spokeswoman","type":"or","categories":["female","male"],"considerate":{"speaker":"a","spokesperson":"a","representative":"a"},"inconsiderate":{"spokeswoman":"female","spokesman":"male"}},{"id":"spokesmen-spokeswomen","type":"or","categories":["female","male"],"considerate":{"speakers":"a","spokespersons":"a"},"inconsiderate":{"spokeswomen":"female","spokesmen":"male"}},{"id":"sportsman-sportswoman","type":"or","categories":["female","male"],"considerate":{"athlete":"a","sports person":"a"},"inconsiderate":{"sportswoman":"female","sportsman":"male"}},{"id":"sportsmen-sportswomen","type":"or","categories":["female","male"],"considerate":{"athletes":"a","sports persons":"a"},"inconsiderate":{"sportswomen":"female","sportsmen":"male"}},{"id":"statesman-stateswoman","type":"or","categories":["female","male"],"considerate":{"senator":"a"},"inconsiderate":{"stateswoman":"female","statesman":"male"}},{"id":"stepbrother-stepsister","type":"or","categories":["female","male"],"considerate":{"step-sibling":"a"},"inconsiderate":{"stepsister":"female","stepbrother":"male"}},{"id":"stepbrothers-stepsisters","type":"or","categories":["female","male"],"considerate":{"step-siblings":"a"},"inconsiderate":{"stepsisters":"female","stepbrothers":"male"}},{"id":"stepdad-stepmom","type":"or","categories":["female","male"],"considerate":{"step-parent":"a"},"inconsiderate":{"stepmom":"female","stepmother":"female","stepdad":"male","stepfather":"male"}},{"id":"stepfathers-stepmothers","type":"or","categories":["female","male"],"considerate":{"step-parents":"a"},"inconsiderate":{"stepmothers":"female","stepfathers":"male"}},{"id":"superman-superwoman","type":"or","categories":["female","male"],"considerate":{"titan":"a"},"inconsiderate":{"superwoman":"female","superman":"male"}},{"id":"supermen-superwomen","type":"or","categories":["female","male"],"considerate":{"titans":"a"},"inconsiderate":{"superwomen":"female","supermen":"male"}},{"id":"unmanly-unwomanly","type":"or","categories":["female","male"],"considerate":{"inhumane":"a"},"inconsiderate":{"unwomanly":"female","unwomenly":"female","unmanly":"male","unmenly":"male"}},{"id":"watchman-watchwoman","type":"or","categories":["female","male"],"considerate":{"watcher":"a"},"inconsiderate":{"watchwoman":"female","watchman":"male"}},{"id":"watchmen-watchwomen","type":"or","categories":["female","male"],"considerate":{"watchers":"a"},"inconsiderate":{"watchwomen":"female","watchmen":"male"}},{"id":"weatherman-weatherwoman","type":"or","categories":["female","male"],"considerate":{"weather forecaster":"a","meteorologist":"a"},"inconsiderate":{"weatherwoman":"female","weatherman":"male"}},{"id":"weathermen-weatherwomen","type":"or","categories":["female","male"],"considerate":{"weather forecasters":"a","meteorologists":"a"},"inconsiderate":{"weatherwomen":"female","weathermen":"male"}},{"id":"widow-widower","type":"or","categories":["female","male"],"considerate":{"bereaved":"a"},"inconsiderate":{"widow":"female","widows":"female","widower":"male","widowers":"male"}},{"id":"own-man-own-woman","type":"or","categories":["female","male"],"considerate":{"own person":"a"},"inconsiderate":{"own woman":"female","own man":"male"}},{"id":"frenchmen","type":"basic","categories":["male"],"considerate":{"french":"a","the french":"a"},"inconsiderate":{"frenchmen":"male"}},{"id":"ladylike","type":"basic","categories":["female"],"considerate":{"courteous":"a","cultured":"a"},"inconsiderate":{"ladylike":"female"}},{"id":"like-a-man","type":"basic","categories":["male"],"considerate":{"resolutely":"a","bravely":"a"},"inconsiderate":{"like a man":"male"}},{"id":"maiden-name","type":"basic","categories":["female"],"considerate":{"birth name":"a"},"inconsiderate":{"maiden name":"female"}},{"id":"maiden-voyage","type":"basic","categories":["female"],"considerate":{"first voyage":"a"},"inconsiderate":{"maiden voyage":"female"}},{"id":"man-enough","type":"basic","categories":["male"],"considerate":{"strong enough":"a"},"inconsiderate":{"man enough":"male"}},{"id":"oneupmanship","type":"basic","categories":["male"],"considerate":{"upstaging":"a","competitiveness":"a"},"inconsiderate":{"oneupmanship":"male"}},{"id":"mrs-","type":"basic","categories":["female"],"considerate":{"ms.":"a"},"inconsiderate":{"miss.":"female","mrs.":"female"}},{"id":"manmade","type":"basic","categories":["male"],"considerate":{"manufactured":"a","artificial":"a","synthetic":"a","machine-made":"a","constructed":"a"},"inconsiderate":{"manmade":"male"}},{"id":"man-of-action","type":"basic","categories":["male"],"considerate":{"dynamo":"a"},"inconsiderate":{"man of action":"male"}},{"id":"man-of-letters","type":"basic","categories":["male"],"considerate":{"scholar":"a","writer":"a","literary figure":"a"},"inconsiderate":{"man of letters":"male"}},{"id":"man-of-the-world","type":"basic","categories":["male"],"considerate":{"sophisticate":"a"},"inconsiderate":{"man of the world":"male"}},{"id":"fellowship","type":"basic","categories":["male"],"considerate":{"camaraderie":"a","community":"a","organization":"a"},"inconsiderate":{"fellowship":"male"}},{"id":"freshman","type":"basic","categories":["male"],"considerate":{"first-year student":"a","fresher":"a"},"inconsiderate":{"freshman":"male","freshwoman":"male"}},{"id":"workmanship","type":"basic","categories":["male"],"considerate":{"quality construction":"a","expertise":"a"},"inconsiderate":{"workmanship":"male"}},{"id":"housewife","type":"basic","categories":["female"],"considerate":{"homemaker":"a","homeworker":"a"},"inconsiderate":{"housewife":"female"}},{"id":"housewives","type":"basic","categories":["female"],"considerate":{"homemakers":"a","homeworkers":"a"},"inconsiderate":{"housewives":"female"}},{"id":"motherly","type":"basic","categories":["female"],"considerate":{"loving":"a","warm":"a","nurturing":"a"},"inconsiderate":{"motherly":"female"}},{"id":"manpower","type":"basic","categories":["male"],"considerate":{"human resources":"a","workforce":"a","personnel":"a","staff":"a","labor":"a","labor force":"a","staffing":"a","combat personnel":"a"},"inconsiderate":{"manpower":"male"}},{"id":"master-of-ceremonies","type":"basic","categories":["male"],"considerate":{"emcee":"a","moderator":"a","convenor":"a"},"inconsiderate":{"master of ceremonies":"male"}},{"id":"masterful","type":"basic","categories":["male"],"considerate":{"skilled":"a","authoritative":"a","commanding":"a"},"inconsiderate":{"masterful":"male"}},{"id":"mastermind","type":"basic","categories":["male"],"considerate":{"genius":"a","creator":"a","instigator":"a","oversee":"a","launch":"a","originate":"a"},"inconsiderate":{"mastermind":"male"}},{"id":"masterpiece","type":"basic","categories":["male"],"considerate":{"work of genius":"a","chef d’oeuvre":"a"},"inconsiderate":{"masterpiece":"male"}},{"id":"masterplan","type":"basic","categories":["male"],"considerate":{"vision":"a","comprehensive plan":"a"},"inconsiderate":{"masterplan":"male"}},{"id":"masterstroke","type":"basic","categories":["male"],"considerate":{"trump card":"a","stroke of genius":"a"},"inconsiderate":{"masterstroke":"male"}},{"id":"madman","type":"basic","categories":["male"],"considerate":{"fanatic":"a","zealot":"a","enthusiast":"a"},"inconsiderate":{"madman":"male","mad man":"male"}},{"id":"madmen","type":"basic","categories":["male"],"considerate":{"fanatics":"a","zealots":"a","enthusiasts":"a"},"inconsiderate":{"madmen":"male","mad men":"male"}},{"id":"mankind","type":"basic","categories":["male"],"considerate":{"humankind":"a"},"inconsiderate":{"mankind":"male"}},{"id":"manhour","type":"basic","categories":["male"],"considerate":{"staff hour":"a","hour of work":"a"},"inconsiderate":{"manhour":"male","man hour":"male"}},{"id":"manhours","type":"basic","categories":["male"],"considerate":{"staff hours":"a","hours of work":"a","hours of labor":"a","hours":"a"},"inconsiderate":{"manhours":"male","man hours":"male"}},{"id":"manned","type":"basic","categories":["a"],"considerate":{"staffed":"a","crewed":"a","piloted":"a"},"inconsiderate":{"manned":"a"},"note":"Using gender neutral language means users will help to break up gender stereotypes."},{"id":"unmanned","type":"basic","categories":["a"],"considerate":{"robotic":"a","automated":"a"},"inconsiderate":{"unmanned":"a"},"note":"Using gender neutral language means users will help to break up gender stereotypes."},{"id":"moaning","type":"basic","categories":["a"],"considerate":{"whining":"a","complaining":"a","crying":"a"},"inconsiderate":{"bitching":"a","moaning":"a"}},{"id":"moan","type":"basic","categories":["a"],"considerate":{"whine":"a","complain":"a","cry":"a"},"inconsiderate":{"bitch":"a","moan":"a"}},{"id":"wifebeater","type":"basic","categories":["a"],"considerate":{"tank top":"a","sleeveless undershirt":"a"},"inconsiderate":{"wife beater":"a","wifebeater":"a"}},{"id":"ancient-man","type":"basic","categories":["a"],"considerate":{"ancient civilization":"a","ancient people":"a"},"inconsiderate":{"ancient man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"authoress","type":"basic","categories":["a"],"considerate":{"author":"a","writer":"a"},"inconsiderate":{"authoress":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"average-housewife","type":"basic","categories":["a"],"considerate":{"average consumer":"a","average household":"a","average homemaker":"a"},"inconsiderate":{"average housewife":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"average-man","type":"basic","categories":["a"],"considerate":{"average person":"a"},"inconsiderate":{"average man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"average-working-man","type":"basic","categories":["a"],"considerate":{"average wage earner":"a","average taxpayer":"a"},"inconsiderate":{"average working man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"aviatrix","type":"basic","categories":["a"],"considerate":{"aviator":"a"},"inconsiderate":{"aviatrix":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"brotherhood-of-man","type":"basic","categories":["a"],"considerate":{"the human family":"a"},"inconsiderate":{"brotherhood of man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"calendar-girl","type":"basic","categories":["a"],"considerate":{"model":"a"},"inconsiderate":{"calendar girl":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"call-girl","type":"basic","categories":["a"],"considerate":{"escort":"a","prostitute":"a","sex worker":"a"},"inconsiderate":{"call girl":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"churchman","type":"basic","categories":["a"],"considerate":{"cleric":"a","practicing Christian":"a","pillar of the Church":"a"},"inconsiderate":{"churchman":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"english-master","type":"basic","categories":["a"],"considerate":{"english coordinator":"a","senior teacher of english":"a"},"inconsiderate":{"english master":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"englishmen","type":"basic","categories":["a"],"considerate":{"the english":"a"},"inconsiderate":{"englishmen":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"executrix","type":"basic","categories":["a"],"considerate":{"executor":"a"},"inconsiderate":{"executrix":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"father-of-*","type":"basic","categories":["a"],"considerate":{"founder of":"a"},"inconsiderate":{"father of *":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"founding-father","type":"basic","categories":["a"],"considerate":{"the founders":"a","founding leaders":"a","forebears":"a"},"inconsiderate":{"founding father":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"housemaid","type":"basic","categories":["a"],"considerate":{"house worker":"a","domestic help":"a"},"inconsiderate":{"housemaid":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"industrial-man","type":"basic","categories":["a"],"considerate":{"industrial civilization":"a","industrial people":"a"},"inconsiderate":{"industrial man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"lady-doctor","type":"basic","categories":["a"],"considerate":{"doctor":"a"},"inconsiderate":{"lady doctor":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"leading-lady","type":"basic","categories":["a"],"considerate":{"lead":"a"},"inconsiderate":{"leading lady":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"maiden","type":"basic","categories":["a"],"considerate":{"virgin":"a"},"inconsiderate":{"maiden":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"maiden-race","type":"basic","categories":["a"],"considerate":{"first race":"a"},"inconsiderate":{"maiden race":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"maiden-speech","type":"basic","categories":["a"],"considerate":{"first speech":"a"},"inconsiderate":{"maiden speech":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"man-a-desk","type":"basic","categories":["a"],"considerate":{"staff a desk":"a"},"inconsiderate":{"man a desk":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"man-in-the-street","type":"basic","categories":["a"],"considerate":{"ordinary citizen":"a","typical person":"a","average person":"a"},"inconsiderate":{"man in the street":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"man-of-the-land","type":"basic","categories":["a"],"considerate":{"farmer":"a","rural worker":"a","grazier":"a","landowner":"a","rural community":"a","country people":"a","country folk":"a"},"inconsiderate":{"man of the land":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"mans-best-friend","type":"basic","categories":["a"],"considerate":{"a faithful dog":"a"},"inconsiderate":{"mans best friend":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"man-the-booth","type":"basic","categories":["a"],"considerate":{"staff the booth":"a"},"inconsiderate":{"man the booth":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"man-the-phones","type":"basic","categories":["a"],"considerate":{"answer the phones":"a"},"inconsiderate":{"man the phones":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"mansized-task","type":"basic","categories":["a"],"considerate":{"a demanding task":"a","a big job":"a"},"inconsiderate":{"mansized task":"a","man sized task":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"master-key","type":"basic","categories":["a"],"considerate":{"pass key":"a","original":"a"},"inconsiderate":{"master key":"a","master copy":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"master-plan","type":"basic","categories":["a"],"considerate":{"grand scheme":"a","guiding principles":"a"},"inconsiderate":{"master plan":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"master-the-art","type":"basic","categories":["a"],"considerate":{"become skilled":"a"},"inconsiderate":{"master the art":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"men-of-science","type":"basic","categories":["a"],"considerate":{"scientists":"a"},"inconsiderate":{"men of science":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"midwife","type":"basic","categories":["a"],"considerate":{"birthing nurse":"a"},"inconsiderate":{"midwife":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"modern-man","type":"basic","categories":["a"],"considerate":{"modern civilization":"a","modern people":"a"},"inconsiderate":{"modern man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"no-mans-land","type":"basic","categories":["a"],"considerate":{"unoccupied territory":"a","wasteland":"a","deathtrap":"a"},"inconsiderate":{"no mans land":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"office-girls","type":"basic","categories":["a"],"considerate":{"administrative staff":"a"},"inconsiderate":{"office girls":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"poetess","type":"basic","categories":["a"],"considerate":{"poet":"a"},"inconsiderate":{"poetess":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"railwayman","type":"basic","categories":["a"],"considerate":{"railway worker":"a"},"inconsiderate":{"railwayman":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"sportsmanlike","type":"basic","categories":["a"],"considerate":{"fair":"a","sporting":"a"},"inconsiderate":{"sportsmanlike":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"sportsmanship","type":"basic","categories":["a"],"considerate":{"fairness":"a","good humor":"a","sense of fair play":"a"},"inconsiderate":{"sportsmanship":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"statesmanlike","type":"basic","categories":["a"],"considerate":{"diplomatic":"a"},"inconsiderate":{"statesmanlike":"a","statesman like":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"stockman","type":"basic","categories":["a"],"considerate":{"cattle worker":"a","farmhand":"a","drover":"a"},"inconsiderate":{"stockman":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"tradesmans-entrance","type":"basic","categories":["a"],"considerate":{"service entrance":"a"},"inconsiderate":{"tradesmans entrance":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"tax-man","type":"basic","categories":["a"],"considerate":{"tax commissioner":"a","tax office":"a","tax collector":"a"},"inconsiderate":{"tax man":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"usherette","type":"basic","categories":["a"],"considerate":{"usher":"a"},"inconsiderate":{"usherette":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"woman-lawyer","type":"basic","categories":["a"],"considerate":{"lawyer":"a"},"inconsiderate":{"woman lawyer":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"woman-painter","type":"basic","categories":["a"],"considerate":{"painter":"a"},"inconsiderate":{"woman painter":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"working-wife","type":"basic","categories":["a"],"considerate":{"wage or salary earning woman":"a","two-income family":"a"},"inconsiderate":{"working mother":"a","working wife":"a"},"note":"Source: https://radyananda.wordpress.com/2009/06/06/nonsexist-alternative-language-handbook-for-conscious-writers/"},{"id":"homosexual","type":"basic","categories":["a"],"considerate":{"gay":"a","gay man":"a","lesbian":"a","gay person/people":"a"},"inconsiderate":{"homosexual":"a"},"note":"This term has a clinical history and is used to imply LGBTQ+ people are diseased or psychologically/emotionally disordered (source: https://www.glaad.org/reference/offensive)"},{"id":"homosexual-relations","type":"basic","categories":["a"],"considerate":{"relationship":"a"},"inconsiderate":{"homosexual relations":"a","homosexual relationship":"a"},"note":"Avoid labeling something as LGBTQ+ unless you would call the same thing “straight” (source: https://www.glaad.org/reference/offensive)"},{"id":"homosexual-couple","type":"basic","categories":["a"],"considerate":{"couple":"a"},"inconsiderate":{"homosexual couple":"a"},"note":"Avoid labeling something as LGBTQ+ unless you would call the same thing “straight” (source: https://www.glaad.org/reference/offensive)"},{"id":"sexual-preference","type":"basic","categories":["a"],"considerate":{"sexual orientation":"a","orientation":"a"},"inconsiderate":{"sexual preference":"a"},"note":"Implies that being LGBTQ+ is a choice (source: https://www.glaad.org/reference/offensive)"},{"id":"gay-lifestyle","type":"basic","categories":["a"],"considerate":{"gay lives":"a","gay/lesbian lives":"a"},"inconsiderate":{"gay lifestyle":"a","homosexual lifestyle":"a"},"note":"Implies that being LGBTQ+ is a choice (source: https://www.glaad.org/reference/offensive)"},{"id":"gay-agenda","type":"basic","categories":["a"],"considerate":{"gay issues":"a"},"inconsiderate":{"gay agenda":"a","homosexual agenda":"a"},"note":"Used by anti-LGBTQ+ extremists to create a climate of fear around LGBTQ+ issues (source: https://www.glaad.org/reference/offensive)"},{"id":"gay-rights","type":"basic","categories":["a"],"considerate":{"equal rights":"a","civil rights for gay people":"a"},"inconsiderate":{"special rights":"a","gay rights":"a"},"note":"LGBTQ+ rights are human rights (source: https://www.glaad.org/reference/style)"},{"id":"fag","type":"basic","categories":["a"],"considerate":{"gay":"a"},"inconsiderate":{"fag":"a","faggot":"a","dyke":"a","homo":"a","sodomite":"a"},"note":"Derogatory terms for LGBTQ+ people are offensive (source: https://www.glaad.org/reference/offensive)"},{"id":"bi","type":"basic","categories":["a"],"considerate":{"bisexual":"a"},"inconsiderate":{"bi":"a"},"note":"Avoid using slang shorthand (source: https://www.glaad.org/reference/style)"},{"id":"homosexual-marriage","type":"basic","categories":["a"],"considerate":{"gay marriage":"a","same-sex marriage":"a"},"inconsiderate":{"homosexual marriage":"a"},"note":"Homosexual has a clinical history and is used to imply LGBTQ+ people are diseased or psychologically/emotionally disordered (source: https://www.glaad.org/reference/style)"},{"id":"tranny","type":"basic","categories":["a"],"considerate":{"transgender":"a"},"inconsiderate":{"tranny":"a"},"note":"Derogatory terms for LGBTQ+ people are offensive (source: https://www.glaad.org/reference/style)"},{"id":"transvestite","type":"basic","categories":["a"],"considerate":{"cross-dresser":"a"},"inconsiderate":{"transvestite":"a"},"note":"Avoid using outdated / offensive terms (source: https://www.glaad.org/reference/transgender)"},{"id":"sexchange","type":"basic","categories":["a"],"considerate":{"transition":"a","gender confirmation surgery":"a"},"inconsiderate":{"sexchange":"a","sex change":"a"},"note":"Avoid overemphasizing surgery when discussing transgender people or the process of transition - it’s not a necessary component (source: https://www.glaad.org/reference/transgender)"},{"id":"sex-change-operation","type":"basic","categories":["a"],"considerate":{"sex reassignment surgery":"a","gender confirmation surgery":"a"},"inconsiderate":{"sex change operation":"a"},"note":"Shift focus away from the assigned sex and towards the identified gender (source: https://www.glaad.org/reference/transgender)"},{"id":"transgenders","type":"basic","categories":["a"],"considerate":{"transgender people":"a"},"inconsiderate":{"transgenders":"a"},"note":"Transgender should be used as an adjective, not as a noun (source: https://www.glaad.org/reference/transgender)"},{"id":"transgendered","type":"basic","categories":["a"],"considerate":{"transgender":"a"},"inconsiderate":{"transgendered":"a"},"note":"Transgender is already an adjective (source: https://www.glaad.org/reference/transgender)"},{"id":"transgenderism","type":"basic","categories":["a"],"considerate":{"being transgender":"a","the movement for transgender equality":"a"},"inconsiderate":{"transgenderism":"a"},"note":"This is a term used by anti-transgender activists to dehumanize transgender people and reduce who they are to a condition (source: https://www.glaad.org/reference/transgender)"},{"id":"born-a-man","type":"basic","categories":["a"],"considerate":{"assigned male at birth":"a","designated male at birth":"a"},"inconsiderate":{"biologically male":"a","born a man":"a","genetically male":"a"},"note":"Assigned birth gender is complicated; gender identity is more than what your parents decided you were at birth"},{"id":"born-a-woman","type":"basic","categories":["a"],"considerate":{"assigned female at birth":"a","designated female at birth":"a"},"inconsiderate":{"biologically female":"a","born a woman":"a","genetically female":"a"},"note":"Assigned birth gender is complicated; gender identity is more than what your parents decided you were at birth"},{"id":"bathroom-bill","type":"basic","categories":["a"],"considerate":{"non-discrimination law":"a","non-discrimination ordinance":"a"},"inconsiderate":{"bathroom bill":"a"},"note":"A term created and used by far-right extremists to oppose nondiscrimination laws that protect transgender people (source: https://www.glaad.org/reference/transgender)"},{"id":"hermaphroditic","type":"basic","categories":["a"],"considerate":{"intersex":"a"},"inconsiderate":{"hermaphroditic":"a","pseudohermaphroditic":"a","pseudo hermaphroditic":"a"},"note":"These terms are stigmatizing to patients and their families because intersex status is more complicated than the mere presence or absence of certain gonadal tissues (source: http://www.isna.org/node/979)"},{"id":"hermaphrodite","type":"basic","categories":["a"],"considerate":{"person who is intersex":"a","person":"a","intersex person":"a"},"inconsiderate":{"hermaphrodite":"a","pseudohermaphrodite":"a","pseudo hermaphrodite":"a"},"note":"These terms are stigmatizing to patients and their families because intersex status is more complicated than the mere presence or absence of certain gonadal tissues (source: http://www.isna.org/node/979)"},{"id":"heshe","type":"basic","categories":["a"],"considerate":{"transgender person":"a","person":"a"},"inconsiderate":{"shemale":"a","she male":"a","heshe":"a","shehe":"a"},"note":"This word dehumanizes transgender people (source: https://www.reddit.com/r/asktransgender/comments/23wbq1/is_the_term_shemale_seen_as_offensive/)"},{"id":"gender-pronoun","type":"basic","categories":["a"],"considerate":{"pronoun":"a","pronouns":"a"},"inconsiderate":{"preferred pronoun":"a","preferred pronouns":"a","gender pronoun":"a","gender pronouns":"a"},"note":"Preferred pronoun sounds like it is optional to use someone\'s correct pronoun (source: https://www.selfdefined.app/definitions/pronouns/)"},{"id":"islamist","type":"basic","categories":["a"],"considerate":{"muslim":"a","person of Islamic faith":"a","fanatic":"a","zealot":"a","follower of islam":"a","follower of the islamic faith":"a"},"inconsiderate":{"islamist":"a"},"note":"Source: https://www.usnews.com/news/newsgram/articles/2013/04/04/the-associated-press-revises-islamist-another-politically-charged-term"},{"id":"islamists","type":"basic","categories":["a"],"considerate":{"muslims":"a","people of Islamic faith":"a","fanatics":"a","zealots":"a"},"inconsiderate":{"islamists":"a"},"note":"Source: https://www.usnews.com/news/newsgram/articles/2013/04/04/the-associated-press-revises-islamist-another-politically-charged-term"},{"id":"master","type":"basic","categories":["a"],"considerate":{"primary":"a","hub":"a","reference":"a"},"inconsiderate":{"master":"a"},"note":"Avoid using the term `master`; these suggestions are for the computer term, but there are better alternatives for other cases too"},{"id":"masters","type":"basic","categories":["a"],"considerate":{"primaries":"a","hubs":"a","references":"a"},"inconsiderate":{"masters":"a"},"note":"Avoid using the term `master`; these suggestions are for the computer term, but there are better alternatives for other cases too"},{"id":"eskimo","type":"basic","categories":["a"],"considerate":{"Inuit":"a"},"inconsiderate":{"eskimo":"a"}},{"id":"eskimos","type":"basic","categories":["a"],"considerate":{"Inuits":"a"},"inconsiderate":{"eskimos":"a"}},{"id":"oriental","type":"basic","categories":["a"],"considerate":{"Asian person":"a"},"inconsiderate":{"oriental":"a"}},{"id":"orientals","type":"basic","categories":["a"],"considerate":{"Asian people":"a"},"inconsiderate":{"orientals":"a"}},{"id":"nonwhite","type":"basic","categories":["a"],"considerate":{"person of color":"a","people of color":"a"},"inconsiderate":{"nonwhite":"a","non white":"a"}},{"id":"ghetto","type":"basic","categories":["a"],"considerate":{"projects":"a","urban":"a"},"inconsiderate":{"ghetto":"a"}},{"id":"redskin","type":"basic","categories":["a"],"considerate":{"Native American":"a"},"inconsiderate":{"red indian":"a","pocahontas":"a","redskin":"a"}},{"id":"redskins","type":"basic","categories":["a"],"considerate":{"Native American People":"a"},"inconsiderate":{"red indians":"a","redskins":"a"}},{"id":"totem","type":"basic","categories":["a"],"considerate":{"favorite":"a","inspiration":"a","personal interest":"a","personality type":"a"},"inconsiderate":{"animal spirit":"a","dream catcher":"a","spirit animal":"a","totem":"a"},"note":"Avoid using terms that oversimplify the complex and varied beliefs of indigenous religions. (source: https://www.worldreligionnews.com/opinion/spirit-animal-not-joke-oppression,https://www.spiralnature.com/spirituality/spirit-animal-cultural-appropriation)"},{"id":"long-time-no-see","type":"basic","categories":["a"],"considerate":{"I haven’t seen you in a long time":"a","it’s been a long time":"a"},"inconsiderate":{"long time no hear":"a","long time no see":"a"},"note":"Avoid using phrases that implicitly mock people with limited knowledge of the English language. (source: https://www.npr.org/sections/codeswitch/2014/03/09/288300303/who-first-said-long-time-no-see-and-in-which-language)"},{"id":"indian-country","type":"basic","categories":["a"],"considerate":{"enemy territory":"a"},"inconsiderate":{"Indian country":"a"},"note":"Avoid using phrases referring to the genocidal United States “Indian Removal” laws. (source: https://newsmaven.io/indiancountrytoday/archive/off-the-reservation-a-teachable-moment-nW1d7U0JRkOszhtg8N1V1A/)"},{"id":"off-reserve","type":"basic","categories":["a"],"considerate":{"disobey":"a","endure":"a","object to":"a","oppose":"a","resist":"a"},"inconsiderate":{"jump the reservation":"a","off reserve":"a","off the reservation":"a"},"note":"Avoid using phrases referring to the genocidal United States “Indian Removal” laws. (source: http://blog.nativepartnership.org/off-the-reservation/,https://www.wsj.com/articles/off-the-reservation-is-a-phrase-with-a-dark-past-1462552837,https://www.npr.org/sections/codeswitch/2014/06/29/326690947/should-saying-someone-is-off-the-reservation-be-off-limits,https://nowtoronto.com/news/native-references-and-terms-that-are-offensive-to-indigenous-people/)"},{"id":"on-the-warpath","type":"basic","categories":["a"],"considerate":{"defend":"a"},"inconsiderate":{"circle the wagons":"a","on the warpath":"a"},"note":"Avoid using phrases referring to colonial stereotypes regarding Native Americans. (source: https://idioms.thefreedictionary.com/circle+the+wagons,https://idioms.thefreedictionary.com/go+on+the+warpath)"},{"id":"too-many-chiefs","type":"basic","categories":["a"],"considerate":{"too many chefs in the kitchen":"a","too many cooks spoil the broth":"a"},"inconsiderate":{"too many chiefs":"a"},"note":"Avoid using phrases referring to colonial stereotypes regarding Native Americans. (source: https://idioms.thefreedictionary.com/too+many+chiefs+and+not+enough+Indians)"},{"id":"natives-are-restless","type":"basic","categories":["a"],"considerate":{"dissatisfied":"a","frustrated":"a"},"inconsiderate":{"natives are restless":"a","natives are becoming restless":"a","natives are getting restless":"a","natives are growing restless":"a"},"note":"Avoid using phrases referring to colonial stereotypes regarding indigenous peoples. (source: https://tvtropes.org/pmwiki/pmwiki.php/Main/TheNativesAreRestless)"},{"id":"powwow","type":"basic","categories":["a"],"considerate":{"conference":"a","gathering":"a","meeting":"a"},"inconsiderate":{"pow wow":"a","powwow":"a"},"note":"Avoid casually using this term, which refers to traditional indigenous celebration ceremonies that were banned by genocidal laws in the United States and Canada — Native people died fighting for this right. (source: https://twitter.com/chadloder/status/1203507070772793345,http://nativeappropriations.com/2012/09/paul-frank-offends-every-native-person-on-the-planet-with-fashion-night-out-dream-catchin-pow-wow.html,https://www.britannica.com/topic/powwow,https://nowtoronto.com/news/native-references-and-terms-that-are-offensive-to-indigenous-people/)"},{"id":"indian-give","type":"basic","categories":["a"],"considerate":{"go back on one’s offer":"a"},"inconsiderate":{"indian give":"a","indian giver":"a"},"note":"Avoid using phrases referring to colonial stereotypes regarding Native Americans."},{"id":"pinoys","type":"basic","categories":["a"],"considerate":{"Filipinos":"a","Filipino people":"a"},"inconsiderate":{"pinoys":"a","pinays":"a"}},{"id":"towel-heads","type":"basic","categories":["a"],"considerate":{"Arabs":"a","Middle Eastern People":"a"},"inconsiderate":{"sand niggers":"a","towel heads":"a"}},{"id":"latino","type":"basic","categories":["a"],"considerate":{"Latinx":"a"},"inconsiderate":{"latino":"a","latina":"a","mexican":"a"},"note":"Whenever possible, try to be gender inclusive."},{"id":"japs","type":"basic","categories":["a"],"considerate":{"Japanese person":"a","Japanese people":"a"},"inconsiderate":{"japs":"a"}},{"id":"hymie","type":"basic","categories":["a"],"considerate":{"Jewish person":"a"},"inconsiderate":{"shlomo":"a","shyster":"a","hymie":"a"}},{"id":"goy","type":"basic","categories":["a"],"considerate":{"a person who is not Jewish":"a","not Jewish":"a"},"inconsiderate":{"goyim":"a","goyum":"a","goy":"a"}},{"id":"spade","type":"basic","categories":["a"],"considerate":{"a Black person":"a"},"inconsiderate":{"spade":"a"}},{"id":"gyp","type":"basic","categories":["a"],"considerate":{"Nomad":"a","Traveler":"a","Roma":"a","Romani":"a"},"inconsiderate":{"gyppo":"a","gypsy":"a","Gipsy":"a","gyp":"a"},"note":"Gypsy is insensitive, use Roma or Romani. They’re not Egyptian as the name suggests. (source: en.wikipedia.org/wiki/Romani_people#cite_ref-80)"},{"id":"blacklist","type":"basic","categories":["a"],"considerate":{"blocklist":"a","wronglist":"a","banlist":"a","deny list":"a"},"inconsiderate":{"blacklist":"a","black list":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"blacklisted","type":"basic","categories":["a"],"considerate":{"blocklisted":"a","wronglisted":"a","banlisted":"a","deny-listed":"a"},"inconsiderate":{"blacklisted":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"blacklisting","type":"basic","categories":["a"],"considerate":{"blocklisting":"a","wronglisting":"a","banlisting":"a","deny-listing":"a"},"inconsiderate":{"blacklisting":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"whitelist","type":"basic","categories":["a"],"considerate":{"passlist":"a","alrightlist":"a","safelist":"a","allow list":"a"},"inconsiderate":{"whitelist":"a","white list":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"whitelisted","type":"basic","categories":["a"],"considerate":{"passlisted":"a","alrightlisted":"a","safelisted":"a","allow-listed":"a"},"inconsiderate":{"whitelisted":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"whitelisting","type":"basic","categories":["a"],"considerate":{"passlisting":"a","alrightlisting":"a","safelisting":"a","allow-listing":"a"},"inconsiderate":{"whitelisting":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"whitespace","type":"basic","categories":["a"],"considerate":{"space":"a","blank":"a"},"inconsiderate":{"whitespace":"a","white space":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"whitespaces","type":"basic","categories":["a"],"considerate":{"space":"a","blank":"a"},"inconsiderate":{"whitespaces":"a","white spaces":"a"},"note":"Replace racially-charged language with more accurate and inclusive words"},{"id":"savage","type":"basic","categories":["a"],"considerate":{"simple":"a","indigenous":"a","hunter-gatherer":"a"},"inconsiderate":{"primitive":"a","savage":"a","stone age":"a"},"note":"Avoid using terms that imply a group has not changed over time and that they are inferior"},{"id":"tribe","type":"basic","categories":["a"],"considerate":{"society":"a","community":"a"},"inconsiderate":{"tribe":"a"},"note":"Avoid using terms that make some groups sound inferior"},{"id":"sophisticated-culture","type":"basic","categories":["a"],"considerate":{"complex culture":"a"},"inconsiderate":{"sophisticated culture":"a"},"note":"Avoid using terms that make some groups sound inferior. Replace “sophisticated” with a neutral term such as “complex”"},{"id":"sophisticated-technology","type":"basic","categories":["a"],"considerate":{"complex technology":"a"},"inconsiderate":{"sophisticated technology":"a"},"note":"Avoid using terms that make some groups sound inferior. Replace “sophisticated” with a neutral term such as “complex”"},{"id":"bugreport","type":"basic","categories":["a"],"considerate":{"bug report":"a","snapshot":"a"},"inconsiderate":{"bugreport":"a"},"note":"Avoid using `bugreport`, as the word `bugre` is a slur in Brazilian Portuguese"},{"id":"grandfather-clause","type":"basic","categories":["a"],"considerate":{"legacy policy":"a","legacy clause":"a","deprecation policy":"a"},"inconsiderate":{"grandfather clause":"a","grandfather policy":"a"},"note":"Avoid using phrases referring to racist United States “Jim Crow” laws. (source: https://en.wikipedia.org/wiki/Grandfather_clause#Origin)"},{"id":"grandfathering","type":"basic","categories":["a"],"considerate":{"deprecate":"a"},"inconsiderate":{"grandfathering":"a"},"note":"Avoid using phrases referring to racist United States “Jim Crow” laws. (source: https://en.wikipedia.org/wiki/Grandfather_clause#Origin)"},{"id":"grandfathered","type":"basic","categories":["a"],"considerate":{"deprecated":"a"},"inconsiderate":{"grandfathered":"a"},"note":"Avoid using phrases referring to racist United States “Jim Crow” laws. (source: https://en.wikipedia.org/wiki/Grandfather_clause#Origin)"},{"id":"make-*-great-again","type":"basic","categories":["a"],"considerate":{"improve":"a"},"inconsiderate":{"make * great again":"a","make * * great again":"a","make * * * great again":"a","make * * * * great again":"a","make * * * * * great again":"a"}},{"id":"committed-suicide","type":"basic","categories":["a"],"considerate":{"died by suicide":"a"},"inconsiderate":{"committed suicide":"a","completed suicide":"a"},"note":"Source: https://www.afsp.org/news-events/for-the-media/reporting-on-suicide, https://www.speakingofsuicide.com/2013/04/13/language/"},{"id":"commit-suicide","type":"basic","categories":["a"],"considerate":{"die by suicide":"a"},"inconsiderate":{"commit suicide":"a","complete suicide":"a","successful suicide":"a"},"note":"Committing suicide is not successful/unsuccessful, that sends the wrong message (source: https://www.afsp.org/news-events/for-the-media/reporting-on-suicide, https://www.speakingofsuicide.com/2013/04/13/language/)"},{"id":"suicide-pact","type":"basic","categories":["a"],"considerate":{"rise in suicides":"a"},"inconsiderate":{"suicide epidemic":"a","epidemic of suicides":"a","suicide pact":"a"},"note":"Using sensational words can cause copycat suicides or contagion (source: https://www.afsp.org/news-events/for-the-media/reporting-on-suicide)"},{"id":"failed-suicide","type":"basic","categories":["a"],"considerate":{"suicide attempt":"a","attempted suicide":"a"},"inconsiderate":{"failed suicide":"a","failed attempt":"a","suicide failure":"a"},"note":"Attempted suicide should not be depicted as a failure (source: https://www.speakingofsuicide.com/2013/04/13/language, https://www.afsp.org/news-events/for-the-media/reporting-on-suicide)"},{"id":"suicide-note","type":"basic","categories":["a"],"considerate":{"a note from the deceased":"a"},"inconsiderate":{"suicide note":"a"},"note":"Source: https://www.afsp.org/news-events/for-the-media/reporting-on-suicide"},{"id":"hang","type":"basic","categories":["a"],"considerate":{"the app froze":"a","the app stopped responding":"a","the app stopped responding to events":"a","the app became unresponsive":"a"},"inconsiderate":{"hang":"a","hanged":"a"},"note":"When describing the behavior of computer software, using the word “hanged” needlessly invokes the topic of death by self-harm or lynching.  Consider using the word “froze” or the phrase “stopped responding to events” or “became unresponsive” instead."}]');

/***/ }),

/***/ 2826:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('["U","UEFA","UK","UN","UNHCR","US","USB","eucalypt*","eucha*","euchr*","euclid*","eucrite","eucryphia","eugen*","eukar*","eulog*","eunice","eunuch","euph*","eura*","eure*","euro*","eury*","eutha*","ewe","ewer","habitual","hallucin*","herb*","heredit*","histor*","hilarious*","horrend*","horrif*","hotel*","ms","once","one","one/","one-*","oneanother","oneberry","onefold*","oneheart*","oneness*","oneself*","onetime*","oneway","onewhere*","oneyear","ubiq*","ugandan","ukase","ukrain*","ukulele","ululated","ululation","unanim*","unary","unesco","uniam*","uniart*","uniat*","uniaur*","uniax*","unibas*","unible","unicycl*","unidirect*","union*","unit*","univ*","unif*","uniq*","uran*","urate","uri*","urologist","uruguay","uruguayan","uruguayans","usab*","usage","use*","using","usu*","utah","uten*","uter*","util*","utop*","utrecht","uttoxeter","uvula","uvular","uyghur"]');

/***/ }),

/***/ 5459:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('["α","f","fbi","fm","fda","l","m","n","nfl","nba","nbc","nhl","ngo","npm","nvidia","s","r","h","habitual","hallucin*","hauteur","heir*","herb*","heredit*","hilarious*","histor*","homage","honest*","honor*","honour*","horrend*","horrif*","hotel*","hour*","h1","h2","h3","h4","h5","h6","hiv","lbw","lcd","mpg","mph","MBA","MA","MRI","msc","MS","MTV","html","r&d","SGML","SOS","SMS","x","XML","xmas","x-ray","x-rays","xbox","SUV","STD","SPF","HB","RAF","IOU"]');

/***/ }),

/***/ 2310:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('["a","able","about","above","across","act","add","afraid","after","afternoon","again","against","ago","air","airplane","alarm","all","almost","alone","along","already","also","always","am","among","an","and","angry","animal","another","answer","any","anyone","appear","apple","are","arm","around","arrow","as","ask","asleep","at","ate","attention","aunt","awake","away","b","baby","back","bad","bag","ball","balloon","bang","bank","bark","barn","basket","be","bean","bear","beat","beautiful","became","because","become","bed","bee","been","before","began","begin","behind","believe","bell","belong","bend","bent","beside","best","better","between","big","bird","birthday","bit","bite","black","blanket","blew","block","blow","blue","board","boat","book","boot","born","borrow","both","bother","bottle","bottom","bought","bow","box","boy","branch","brave","bread","break","breakfast","breath","brick","bridge","bright","bring","broke","broken","brother","brought","brown","brush","build","bump","burn","bus","busy","but","butter","button","buy","by","c","cabin","cage","cake","call","came","camp","can","can\'t","candle","candy","cap","captain","car","card","care","careful","carrot","carry","case","castle","cat","catch","cattle","caught","cause","cent","certain","chair","chance","change","chase","chicken","chief","child","children","church","circle","circus","city","clap","clean","clever","cliff","climb","clock","close","cloth","clothes","clown","coat","cold","color","come","comfortable","company","contest","continue","cook","cool","corner","could","count","country","course","cover","cow","crawl","cream","cry","cup","curtain","cut","d","dad","dance","danger","dangerous","dark","dash","daughter","day","dear","decide","deep","desk","did","didn\'t","die","different","dig","dinner","direction","disappear","disappoint","discover","distance","do","doctor","does","dog","dollar","don\'t","done","door","down","dragon","dream","dress","drink","drive","drop","drove","dry","duck","during","dust","e","each","eager","ear","early","earn","earth","easy","eat","edge","egg","eight","eighteen","either","elephant","else","empty","end","enemy","enough","enter","even","ever","every","everything","exact","except","excite","exclaim","explain","eye","face","fact","fair","fall","family","far","farm","farmer","farther","fast","fat","father","feather","feed","feel","feet","fell","fellow","felt","fence","few","field","fierce","fight","figure","fill","final","find","fine","finger","finish","fire","first","fish","five","flag","flash","flat","flew","floor","flower","fly","follow","food","for","forest","forget","forth","found","four","fourth","fox","fresh","friend","frighten","frog","from","front","fruit","full","fun","funny","fur","g","game","garden","gasp","gate","gave","get","giant","gift","girl","give","glad","glass","go","goat","gone","good","got","grandfather","grandmother","grass","gray","great","green","grew","grin","ground","group","grow","growl","guess","gun","h","had","hair","half","hall","hand","handle","hang","happen","happiness","happy","hard","harm","has","hat","hate","have","he","he\'s","head","hear","heard","heavy","held","hello","help","hen","her","here","herself","hid","hide","high","hill","him","himself","his","hit","hold","hole","holiday","home","honey","hop","horn","horse","hot","hour","house","how","howl","hum","hundred","hung","hungry","hunt","hurry","hurt","husband","i","i\'ll","i\'m","ice","idea","if","imagine","important","in","inch","indeed","inside","instead","into","invite","is","it","it\'s","its","j","jacket","jar","jet","job","join","joke","joy","jump","just","k","keep","kept","key","kick","kill","kind","king","kitchen","kitten","knee","knew","knock","know","l","ladder","lady","laid","lake","land","large","last","late","laugh","lay","lazy","lead","leap","learn","least","leave","left","leg","less","let","let\'s","letter","lick","lift","light","like","line","lion","list","listen","little","live","load","long","look","lost","lot","loud","love","low","luck","lump","lunch","m","machine","made","magic","mail","make","man","many","march","mark","market","master","matter","may","maybe","me","mean","meant","meat","meet","melt","men","merry","met","middle","might","mile","milk","milkman","mind","mine","minute","miss","mistake","moment","money","monkey","month","more","morning","most","mother","mountain","mouse","mouth","move","much","mud","music","must","my","n","name","near","neck","need","needle","neighbor","neighborhood","nest","never","new","next","nibble","nice","night","nine","no","nod","noise","none","north","nose","not","note","nothing","notice","now","number","o","ocean","of","off","offer","often","oh","old","on","once","one","only","open","or","orange","order","other","our","out","outside","over","owl","own","p","pack","paid","pail","paint","pair","palace","pan","paper","parade","parent","park","part","party","pass","past","pasture","path","paw","pay","peanut","peek","pen","penny","people","perfect","perhaps","person","pet","pick","picket","picnic","picture","pie","piece","pig","pile","pin","place","plan","plant","play","pleasant","please","plenty","plow","point","poke","pole","policeman","pond","poor","pop","postman","pot","potato","pound","pour","practice","prepare","present","pretend","pretty","princess","prize","probably","problem","promise","protect","proud","puff","pull","puppy","push","put","q","queen","queer","quick","quiet","quite","r","rabbit","raccoon","race","radio","rag","rain","raise","ran","ranch","rang","reach","read","ready","real","red","refuse","remember","reply","rest","return","reward","rich","ride","right","ring","river","road","roar","rock","rode","roll","roof","room","rope","round","row","rub","rule","run","rush","s","sad","safe","said","sail","sale","salt","same","sand","sang","sat","save","saw","say","scare","school","scold","scratch","scream","sea","seat","second","secret","see","seed","seem","seen","sell","send","sent","seven","several","sew","shadow","shake","shall","shape","she","sheep","shell","shine","ship","shoe","shone","shook","shoot","shop","shore","short","shot","should","show","sick","side","sight","sign","signal","silent","silly","silver","since","sing","sister","sit","six","size","skip","sky","sled","sleep","slid","slide","slow","small","smart","smell","smile","smoke","snap","sniff","snow","so","soft","sold","some","something","sometimes","son","song","soon","sorry","sound","speak","special","spend","spill","splash","spoke","spot","spread","spring","squirrel","stand","star","start","station","stay","step","stick","still","stone","stood","stop","store","story","straight","strange","street","stretch","strike","strong","such","sudden","sugar","suit","summer","sun","supper","suppose","sure","surprise","swallow","sweet","swim","swing","t","table","tail","take","talk","tall","tap","taste","teach","teacher","team","tear","teeth","telephone","tell","ten","tent","than","thank","that","that\'s","the","their","them","then","there","these","they","thick","thin","thing","think","third","this","those","though","thought","three","threw","through","throw","tie","tiger","tight","time","tiny","tip","tire","to","today","toe","together","told","tomorrow","too","took","tooth","top","touch","toward","tower","town","toy","track","traffic","train","trap","tree","trick","trip","trot","truck","true","trunk","try","turkey","turn","turtle","twelve","twin","two","u","ugly","uncle","under","unhappy","until","up","upon","upstairs","us","use","usual","v","valley","vegetable","very","village","visit","voice","w","wag","wagon","wait","wake","walk","want","war","warm","was","wash","waste","watch","water","wave","way","we","wear","weather","week","well","went","were","wet","what","wheel","when","where","which","while","whisper","whistle","white","who","whole","whose","why","wide","wife","will","win","wind","window","wing","wink","winter","wire","wise","wish","with","without","woke","wolf","woman","women","won\'t","wonder","wood","word","wore","work","world","worm","worry","worth","would","wrong","x","y","yard","year","yell","yellow","yes","yet","you","young","your","z","zoo"]');

/***/ }),

/***/ 7483:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"abalone":4,"abare":3,"abbruzzese":4,"abed":2,"aborigine":5,"abruzzese":4,"acreage":3,"adame":3,"adieu":2,"adobe":3,"anemone":4,"anyone":3,"apache":3,"aphrodite":4,"apostrophe":4,"ariadne":4,"cafe":2,"calliope":4,"catastrophe":4,"chile":2,"chloe":2,"circe":2,"coyote":3,"daphne":2,"epitome":4,"eurydice":4,"euterpe":3,"every":2,"everywhere":3,"forever":3,"gethsemane":4,"guacamole":4,"hermione":4,"hyperbole":4,"jesse":2,"jukebox":2,"karate":3,"machete":3,"maybe":2,"naive":2,"newlywed":3,"penelope":4,"people":2,"persephone":4,"phoebe":2,"pulse":1,"queue":1,"recipe":3,"riverbed":3,"sesame":3,"shoreline":2,"simile":3,"snuffleupagus":5,"sometimes":2,"syncope":3,"tamale":3,"waterbed":3,"wednesday":2,"yosemite":4,"zoe":2}');

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/helpers/github.js
async function getChangedPRFiles(
  client,
  repo,
  owner,
  pullNumber
) {
  try {
    const list = await client.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber
    });
    
    const files = list.data.map(file => file.filename).filter(file => file);

    return files;
  } catch (error) {
    const eString = `There was an error getting change files for repo:${repo} owner:${owner} pr:${pullNumber}`;

    throw new Error(eString);
  }
}

async function getChangedFiles(
  client,
  repo,
  owner,
  pr
) {
  try {
    let files = await getChangedPRFiles(client, repo, owner, pr)
    return files
  } catch (error) {
    throw error;
  }
}
// EXTERNAL MODULE: ./node_modules/retext/index.js
var retext = __nccwpck_require__(6959);
var retext_default = /*#__PURE__*/__nccwpck_require__.n(retext);
// EXTERNAL MODULE: ./node_modules/retext-spell/index.js
var retext_spell = __nccwpck_require__(8755);
var retext_spell_default = /*#__PURE__*/__nccwpck_require__.n(retext_spell);
// EXTERNAL MODULE: ./node_modules/retext-english/index.js
var retext_english = __nccwpck_require__(6206);
var retext_english_default = /*#__PURE__*/__nccwpck_require__.n(retext_english);
// EXTERNAL MODULE: ./node_modules/retext-contractions/index.js
var retext_contractions = __nccwpck_require__(4262);
var retext_contractions_default = /*#__PURE__*/__nccwpck_require__.n(retext_contractions);
// EXTERNAL MODULE: ./node_modules/retext-equality/index.js
var retext_equality = __nccwpck_require__(1901);
var retext_equality_default = /*#__PURE__*/__nccwpck_require__.n(retext_equality);
// EXTERNAL MODULE: ./node_modules/retext-readability/index.js
var retext_readability = __nccwpck_require__(7746);
var retext_readability_default = /*#__PURE__*/__nccwpck_require__.n(retext_readability);
// EXTERNAL MODULE: ./node_modules/retext-repeated-words/index.js
var retext_repeated_words = __nccwpck_require__(2346);
var retext_repeated_words_default = /*#__PURE__*/__nccwpck_require__.n(retext_repeated_words);
// EXTERNAL MODULE: ./node_modules/retext-indefinite-article/index.js
var retext_indefinite_article = __nccwpck_require__(8488);
var retext_indefinite_article_default = /*#__PURE__*/__nccwpck_require__.n(retext_indefinite_article);
// EXTERNAL MODULE: ./node_modules/retext-stringify/index.js
var retext_stringify = __nccwpck_require__(7715);
var retext_stringify_default = /*#__PURE__*/__nccwpck_require__.n(retext_stringify);
// EXTERNAL MODULE: ./node_modules/dictionary-en-gb/index.js
var dictionary_en_gb = __nccwpck_require__(7161);
var dictionary_en_gb_default = /*#__PURE__*/__nccwpck_require__.n(dictionary_en_gb);
// EXTERNAL MODULE: ./node_modules/vfile-reporter/index.js
var vfile_reporter = __nccwpck_require__(8366);
var vfile_reporter_default = /*#__PURE__*/__nccwpck_require__.n(vfile_reporter);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(5747);
var external_fs_default = /*#__PURE__*/__nccwpck_require__.n(external_fs_);
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(5622);
var external_path_default = /*#__PURE__*/__nccwpck_require__.n(external_path_);
;// CONCATENATED MODULE: ./src/index.js

const github = __nccwpck_require__(245);
const core = __nccwpck_require__(9326);














const github_token = core.getInput('github_token');
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const pull_request = github.context.payload.pull_request.number;




if (!github_token) {
  core.warning('Github token was not set');
}

const octokit = github.getOctokit(github_token);

(async () => {
  const filesChanged = await getChangedFiles(octokit, repo, owner, pull_request);

  filesChanged.forEach((PRFile) => {
    if (PRFile.endsWith('.md') || PRFile.endsWith('.markdown')) {
      const data = external_fs_default().readFileSync(external_path_default().join(process.env.GITHUB_WORKSPACE, PRFile), { encoding: 'utf8', flag: 'r' });

      retext_default()()
        .use((retext_english_default()))
        .use((retext_equality_default()))
        .use((retext_contractions_default()), { straight: true })
        .use((retext_readability_default()), { age: 20 })
        .use((retext_spell_default()), { dictionary: (dictionary_en_gb_default()), normalizeApostrophes: false, max: 100 })
        .use((retext_repeated_words_default()))
        .use((retext_indefinite_article_default()))
        .use((retext_stringify_default()))
        .process(data, (err, file) => {
          console.log('error', err);
          console.log('file', file);
          const body = `
<details>
<summary>Review tips to improve ${PRFile}</summary>

${vfile_reporter_default()(file)}

</details>
`
          octokit.issues.createComment({
            owner,
            repo,
            issue_number: pull_request,
            body
          });
        })
    }
  })
})();
})();

module.exports = __webpack_exports__;
/******/ })()
;