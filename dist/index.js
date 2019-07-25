"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withKeyLayers_1 = __importDefault(require("./hocs/withKeyLayers"));
var key_layers_js_1 = require("key-layers-js");
exports.Emitter = key_layers_js_1.Emitter;
exports.EMITTER_TOP_LAYER_TYPE = key_layers_js_1.EMITTER_TOP_LAYER_TYPE;
exports.EMITTER_FORCE_LAYER_TYPE = key_layers_js_1.EMITTER_FORCE_LAYER_TYPE;
exports.withKeyLayer = withKeyLayers_1.default;
