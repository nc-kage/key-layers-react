import React, { Component, FunctionComponent, FC } from 'react';
import * as KeyLayers from 'key-layers-js';

import { copyStaticProps } from '../utils/components';

export {
  Emitter, EMITTER_TOP_LAYER_TYPE, EMITTER_FORCE_LAYER_TYPE,
} from 'key-layers-js';

export type EventType = 'keyDown' | 'keyPress' | 'keyUp' | 'keyRelease' | 'pressRelease';

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
    => (new () => Component<any, any>));

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

type ConfigType = {
  layerIndex?: boolean | number | string;
  releaseDelay?: number;
  addListenerMethodName?: string;
  removeListenerMethodName?: string;
};

const componentGenerator = (
  Comp: any,
  config: ConfigType = {},
): (new () => Component<any, any>) => {
  const {
    releaseDelay,
    layerIndex = false,
    addListenerMethodName = 'addKeyListener',
    removeListenerMethodName = 'removeKeyListener',
  } = config;

  class WithKeyEventsComp extends Component<IWithKeyEventsCompProps> {
    private readonly emitter: KeyLayers.Emitter;

    private originalRef?: React.ReactNode;

    constructor(props: { [key: string]: any }) {
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
        ): (type: string, callback: (e: KeyboardEvent) => void) => void => {
          return emitter.addListener.call(emitter, type, callback, options);
        },
        [removeListenerMethodName]: (
          type: string, callback: (e: KeyboardEvent) => void,
        ) => {
          emitter.removeListener.call(emitter, type, callback);
        },
      };
    }

    render() {
      return (
        <Comp
          {...(typeof Comp === 'function') ? {} : {
            ref: (r: React.ReactNode) => {
              this.originalRef = r;
            },
          }}
          {...this.getAdditionalProps()}
          {...this.props}
        />
      );
    }
  }

  return copyStaticProps<new() => Component<any, any>>(
    Comp,
    WithKeyEventsComp as unknown as new () => Component<any, any>,
  );
};

type ComponentType = (new () => Component<any, any>)
  | (new () => FunctionComponent<any>) | (new () => FC<any>) | FC | FunctionComponent | Component;
type SimpleParamsType = boolean | number | string | ComponentType;
type ResultType<K> = K extends (boolean | number | string)
  ? ((Comp: ComponentType, config?: ConfigType) => (new () => Component<any, any>))
  : (new () => Component<any, any>);

const withKeyLayer = <T extends SimpleParamsType>(
  param?: T,
  config?: {
    releaseDelay?: number;
    addListenerMethodName?: string;
    removeListenerMethodName?: string;
  },
): ResultType<T> => {
  if (['boolean', 'number', 'string'].includes(typeof param)) {
    return ((Comp: ComponentType): (new () => Component<any, any>) => {
      return componentGenerator(
        Comp as (new () => Component<any, any>) | FunctionComponent<any> | FC<any>,
        { layerIndex: param as boolean | number | string },
      );
    }) as ResultType<T>;
  }
  return componentGenerator(
    param as (new () => Component<any, any>) | FunctionComponent<any> | FC<any>, config,
  ) as ResultType<T>;
};

export default withKeyLayer;
