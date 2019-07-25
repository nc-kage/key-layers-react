import React, { Component, FunctionComponent } from 'react';
export { Emitter, EMITTER_TOP_LAYER_TYPE, EMITTER_FORCE_LAYER_TYPE, } from 'key-layers-js';
declare type HocResultType = (new () => Component<any, any>) | ((Comp: (new () => Component<any, any>) | (new () => FunctionComponent<any>)) => (new () => Component<any, any>));
export declare const setConfig: (newConfig?: {
    releaseDelay?: number | undefined;
    aliases?: {
        [key: string]: number;
    } | undefined;
}) => void;
declare const withKeyLayer: (param?: string | number | boolean | (new () => React.Component<any, any, any>) | (new () => React.FunctionComponent<any>) | undefined, config?: {
    releaseDelay?: number | undefined;
    addListenerMethodName?: string | undefined;
    removeListenerMethodName?: string | undefined;
} | undefined) => HocResultType;
export default withKeyLayer;
