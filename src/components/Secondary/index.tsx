import React, { FC, useEffect } from 'react';
import * as KeyLayers from 'key-layers-js';

import withKeyLayers, { EMITTER_TOP_LAYER_TYPE, EventType } from '../../hocs/withKeyLayers';

type PropsType = {
  onRelease: (e: KeyboardEvent) => void;
  addKeyListener: (
    key: EventType, callback: (e: KeyboardEvent) => void, options?: KeyLayers.ListenerOptions,
  ) => void;
  removeKeyListener: (key: EventType, callback: (e: KeyboardEvent) => void) => void;
  code: number;
};

const Secondary: FC<PropsType> = (
  { onRelease, code, addKeyListener, removeKeyListener }: PropsType,
) => {
  useEffect(() => {
    addKeyListener('keyDown', onRelease, { code });
    return () => removeKeyListener('keyDown', onRelease);
  }, [code, onRelease, addKeyListener, removeKeyListener]);

  return (
    <div>Secondary</div>
  );
};

export default withKeyLayers(EMITTER_TOP_LAYER_TYPE)(Secondary);
