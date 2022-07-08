import * as KeyLayers from 'key-layers-js';
export declare type EventType = 'keyDown' | 'keyPress' | 'keyUp' | 'keyRelease' | 'pressRelease';
export { EMITTER_FORCE_LAYER_TYPE, EMITTER_TOP_LAYER_TYPE, IEmitter } from 'key-layers-js';
/**
 * Hook to create a new KeyLayer.
 * @param {boolean|number|string} subscribeType - Layer type,
 * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
 * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
 * 5 - add to the layer with index 5.
 * @param {number} releaseDelay - Delay between keyDown and keyUp events for
 * fires keyRelease event.
 */
declare const useKeyLayers: (subscribeType: boolean | number | string, releaseDelay?: number) => [(key: EventType, callback: (e: KeyboardEvent) => void, options?: KeyLayers.ListenerOptions) => void, (key: EventType, callback: (e: KeyboardEvent) => void) => void];
export default useKeyLayers;
