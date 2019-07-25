import React, { Component, FunctionComponent } from 'react';
import * as KeyLayers from 'key-layers-js';

import { copyStaticProps } from '../utils/components';

export {
  Emitter, EMITTER_TOP_LAYER_TYPE, EMITTER_FORCE_LAYER_TYPE,
} from 'key-layers-js';

type ListenerOptionsType = {
  code?: number;
  codes?: number[];
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  skipInput?: boolean;
};

type HocResultType = (new () => Component<any, any>)
  | ((Comp: (new () => Component<any, any>) | (new () => FunctionComponent<any>))
    => (new () => Component<any, any>))

const configGlobal: {
  releaseDelay?: number;
} = {
  releaseDelay: undefined,
};

export const setConfig = (
  newConfig: {
    releaseDelay?: number;
    aliases?: { [key: string]: number };
  } = {},
) => {
  const {
    releaseDelay = undefined,
    aliases = null,
  } = newConfig;
  if (typeof releaseDelay === 'number' && releaseDelay >= 0) {
    configGlobal.releaseDelay = releaseDelay;
  }
  if (aliases) {
    KeyLayers.Emitter.setLayersMap(aliases);
  }
};

interface IWithKeyEventsCompProps {
  refs?: (ref: any) => void;
}

const componentGenerator = (
  Comp: (new () => Component<any, any>),
  config: {
    layerIndex?: boolean | number | string;
    releaseDelay?: number;
    addListenerMethodName?: string;
    removeListenerMethodName?: string;
  } = {},
): new () => Component<any, any> => {
  const {
    releaseDelay,
    layerIndex = false,
    addListenerMethodName = 'addKeyListener',
    removeListenerMethodName = 'removeKeyListener',
  } = config;

  class WithKeyEventsComp extends Component<IWithKeyEventsCompProps> {
    private readonly emitter: KeyLayers.Emitter;
    private originalRef?: React.ReactNode;

    constructor(props: {}) {
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
        [addListenerMethodName]: (
          type: string, callback: (e: KeyboardEvent) => void, options: ListenerOptionsType,
        ) => {
          emitter.addListener.call(emitter, type, callback, options);
        },
        [removeListenerMethodName]: (
          type: string, callback: (e: KeyboardEvent) => void,
        ) => {
          emitter.removeListener.call(emitter, type, callback);
        },
      };
    }

    render() {
      return (<Comp
        ref={(r: React.ReactNode) => {
          this.originalRef = r;
        }}
        {...this.getAdditionalProps()}
        {...this.props}
      />);
    }
  }

  return copyStaticProps<new () => Component<any, any>>(
    Comp,
    WithKeyEventsComp as unknown as new () => Component<any, any>,
  );
};

const withKeyLayer = (
  param?: any,
  config?: {
    releaseDelay?: number;
    addListenerMethodName?: string;
    removeListenerMethodName?: string;
  },
): HocResultType => {
  if (typeof param !== 'boolean' && typeof param !== 'number' && typeof param !== 'string') {
    return componentGenerator(param as new () => Component<any, any>, config);
  }
  return (Comp: any): new () => Component<any, any> => {
    return componentGenerator(Comp as new () => Component<any, any>, { layerIndex: param });
  };
};

export default withKeyLayer;
