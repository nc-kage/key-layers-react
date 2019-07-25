/// <reference types="react" />
export { Emitter, EMITTER_TOP_LAYER_TYPE, EMITTER_FORCE_LAYER_TYPE } from 'key-layers-js';
export declare const withKeyLayer: (param?: string | number | boolean | (new () => import("react").Component<any, any, any>) | (new () => import("react").FunctionComponent<any>) | undefined, config?: {
    releaseDelay?: number | undefined;
    addListenerMethodName?: string | undefined;
    removeListenerMethodName?: string | undefined;
} | undefined) => (new () => import("react").Component<any, any, any>) | ((Comp: (new () => import("react").Component<any, any, any>) | (new () => import("react").FunctionComponent<any>)) => new () => import("react").Component<any, any, any>);
