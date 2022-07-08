import React, { FC, useEffect } from 'react';
import useKeyLayers, { EMITTER_TOP_LAYER_TYPE } from '../../hooks/useKeyLayers';

type PropsType = {
  onRelease: (e: KeyboardEvent) => void;
  code: number;
};

const Main: FC<PropsType> = ({ onRelease, code }: PropsType) => {
  const [addListener, removeListener] = useKeyLayers(EMITTER_TOP_LAYER_TYPE);

  useEffect(() => {
    console.log('Main add listener');
    addListener('keyDown', onRelease, { code });
    return () => {
      console.log('Main remove listener');
      removeListener('keyDown', onRelease);
    };
  }, [code, onRelease, addListener, removeListener]);

  return (
    <div>Main</div>
  );
};

export default Main;
