import { useRef, useCallback, useEffect, useMemo } from 'react';

import * as KeyLayers from 'key-layers-js';

export type EventType = 'keyDown' | 'keyPress' | 'keyUp' | 'keyRelease' | 'pressRelease';

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
const useKeyLayers = (
  subscribeType: boolean | number | string, releaseDelay?: number,
): [
  (
    key: EventType, callback: (e: KeyboardEvent) => void, options?: KeyLayers.ListenerOptions,
  ) => void,
  (key: EventType, callback: (e: KeyboardEvent) => void) => void,
] => {
  const initParams = useRef<{ subscribeType: boolean | number | string, releaseDelay?: number }>({
    subscribeType, releaseDelay,
  });
  const emitter = useMemo(() => {
    return new KeyLayers.Emitter(initParams.current.subscribeType, initParams.current.releaseDelay);
  }, []);
  const addListener = useCallback((
    key: EventType, callback: (e: KeyboardEvent) => void, options?: KeyLayers.ListenerOptions,
  ) => {
    emitter.addListener(key, callback, options);
  }, [emitter]);
  const removeListener = useCallback((key: EventType, callback: (e: KeyboardEvent) => void) => {
    emitter.removeListener(key, callback);
  }, [emitter]);

  useEffect(() => {
    emitter.updateLayerType(subscribeType);
  }, [emitter, subscribeType]);

  useEffect(() => () => {
    emitter.destroy();
  }, [emitter]);
  return [addListener, removeListener];
};

export default useKeyLayers;
