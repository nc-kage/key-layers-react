import { Component, FunctionComponent, FC } from 'react';
export { Emitter, EMITTER_TOP_LAYER_TYPE, EMITTER_FORCE_LAYER_TYPE, } from 'key-layers-js';
export declare type EventType = 'keyDown' | 'keyPress' | 'keyUp' | 'keyRelease' | 'pressRelease';
export declare const setConfig: (newConfig?: {
    releaseDelay?: number;
    aliases?: {
        [key: string]: number;
    };
}) => void;
declare type ConfigType = {
    layerIndex?: boolean | number | string;
    releaseDelay?: number;
    addListenerMethodName?: string;
    removeListenerMethodName?: string;
};
declare type ComponentType = (new () => Component<any, any>) | (new () => FunctionComponent<any>) | (new () => FC<any>) | FC | FunctionComponent | Component;
declare type SimpleParamsType = boolean | number | string | ComponentType;
declare type ResultType<K> = K extends (boolean | number | string) ? ((Comp: ComponentType, config?: ConfigType) => (new () => Component<any, any>)) : (new () => Component<any, any>);
declare const withKeyLayer: <T extends SimpleParamsType>(param?: T, config?: {
    releaseDelay?: number;
    addListenerMethodName?: string;
    removeListenerMethodName?: string;
}) => ResultType<T>;
export default withKeyLayer;
