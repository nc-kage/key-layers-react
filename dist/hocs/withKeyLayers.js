"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const KeyLayers = __importStar(require("key-layers-js"));
const components_1 = require("../utils/components");
var key_layers_js_1 = require("key-layers-js");
exports.Emitter = key_layers_js_1.Emitter;
exports.EMITTER_TOP_LAYER_TYPE = key_layers_js_1.EMITTER_TOP_LAYER_TYPE;
exports.EMITTER_FORCE_LAYER_TYPE = key_layers_js_1.EMITTER_FORCE_LAYER_TYPE;
const configGlobal = {
    releaseDelay: undefined,
};
exports.setConfig = (newConfig = {}) => {
    const { releaseDelay = undefined, aliases = null, } = newConfig;
    if (typeof releaseDelay === 'number' && releaseDelay >= 0) {
        configGlobal.releaseDelay = releaseDelay;
    }
    if (aliases) {
        KeyLayers.Emitter.setLayersMap(aliases);
    }
};
const componentGenerator = (Comp, config = {}) => {
    const { releaseDelay, layerIndex = false, addListenerMethodName = 'addKeyListener', removeListenerMethodName = 'removeKeyListener', } = config;
    class WithKeyEventsComp extends react_1.Component {
        constructor(props) {
            super(props);
            this.emitter = new KeyLayers.Emitter(layerIndex, releaseDelay || configGlobal.releaseDelay);
        }
        componentDidMount() {
            const { refs } = this.props;
            if (refs) {
                refs(this.originalRef);
            }
        }
        componentWillUnmount() {
            this.emitter.destroy();
        }
        getAdditionalProps() {
            const { emitter } = this;
            return {
                [addListenerMethodName]: (type, callback, options) => {
                    emitter.addListener.call(emitter, type, callback, options);
                },
                [removeListenerMethodName]: (type, callback) => {
                    emitter.removeListener.call(emitter, type, callback);
                },
            };
        }
        render() {
            return (react_1.default.createElement(Comp, Object.assign({}, (typeof Comp === 'function') ? {} : {
                ref: (r) => {
                    this.originalRef = r;
                }
            }, this.getAdditionalProps(), this.props)));
        }
    }
    return components_1.copyStaticProps(Comp, WithKeyEventsComp);
};
const withKeyLayer = (param, config) => {
    if (typeof param !== 'boolean' && typeof param !== 'number' && typeof param !== 'string') {
        return componentGenerator(param, config);
    }
    return (Comp) => {
        return componentGenerator(Comp, { layerIndex: param });
    };
};
exports.default = withKeyLayer;
