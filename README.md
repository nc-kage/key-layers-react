# key-layers-react
It's a High Order Component (HOC) for comfortable handling key events. If web application contains the several abstract layers such as file browsing, image preview, video preview etc. If active layer needs to handle own events and lock event handlers of the other layers, key-layers-react can help to resolve this task.

# Getting Started
To connect the component with the layer use HOC imported from key-layers-react

```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer from 'react-key-layers';

import NewTaskModal from '../NewTaskModal';
import './ListHeader.scss';

class ListHeader extends Component {
  componentDidMount() {
  
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the layer 1', e);
    });
    
    // Add a listener for key down event when user presses
    // "w" and "e" keys together.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('"w" and "e" keys down of the layer 2', e);
    }, { codes: [87, 69] });
  
    // Add a listener for the synthetic key release event
    // which fires on down and up "n" key with 150 ms delay or less.
    this.props.addKeyListener('keyRelease', this.newTaskHandler, { code: 78 });
  }

  newTaskHandler = () => {
    this.context.addModal(<NewTaskModal />);
  }

  render() {
    return (
      <div className="ListHeader">
        <button onClick={this.newTaskHandler} className="button">Add new Task</button>
        <div className="ListHeader__helpText">
          <span>Hit the "N" key for open the "New task dialog".</span>
        </div>
      </div>
    );
  }
}

ListHeader.contextTypes = {
  addModal: PropTypes.func,
};

ListHeader.propTypes = {
  addKeyListener: PropTypes.func.isRequired,
};

// Connect component with the first layer. HOC add two functiions into the props:
// addKeyListener - function for the adding key listener to the layer
// removeKeyListener - function for the removing key listener from the layer
export default withKeyLayer(1)(ListHeader);
```

This example shows how to connect component with the layer (1) and add different types of the key listeners such as:
* Key down listener for any key
* "w" and "e" keys together down listener
* "n" key release listener which fires on down and up with 150 ms delay or less.

HOC takes two parameters and returns configured HOC.
```javascript
export default withKeyLayer(layerIndex, componentConfig)(ListHeader);
```

***layerIndex*** - it's a something like z-index. Active layer will be with the biggest layerIndex.

***componentConfig*** - it's a new component configuration object.

***componentConfig.releaseDelay*** - it's a delay between down and up events for release synthetic event. By default, this value sets to 150 ms.

***componentConfig.addListenerMethodName*** - it's a name for the add key listener function, that pass to the props. By default, this value sets to "addKeyListener".

***componentConfig.removeListenerMethodName*** - it's a name for the remove key listener function, that pass to the props. By default, this value sets to "removeKeyListener".

# Layer execute priority
**Layer** - it's an abstract plane with which Emitter instances connecting.

There are three types of the layers:
* High priority layer (anonymous top layer) with only one Emitter instance
* General priority layer (index layer)
* Force executable layer

## High priority layers
Component that are created without index. HOC execution without parameters or with layerIndex = null creates a new unindexed layer and connect new component with this layer.

**Listening layer is a layer that was created latest.**
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer from 'react-key-layers';

class TestFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirstWithLayer = withKeyLayer(TestFirst);

class TestSecond extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestSecond', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestSecondWithLayer = withKeyLayer(null)(TestSecond);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isRemovedSecond: false };
  }
  
  componentDidMount() {
    setTimeout(() => {
      // Remove TestSecondWithLayer
      // and than TestFirstWithLayer starts listen key events
      this.setState({ isRemovedSecond: true });
    }, 3000);
  }
  
  render() {
    return [
      <TestFirstWithLayer key={0} />,
      this.state.isRemovedSecond ? null : <TestSecondWithLayer key={1} />,
    ];
  }
}

render(
  <App />,
  document.getElementById('app')
);

// TestSecondWithLayer is listening key events for 3 seconds
// TestFirstWithLayer isn't listening key events
```

## General priority layers
Layers with index (z-index).
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer from 'react-key-layers';

class TestFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirstWithLayer = withKeyLayer(1)(TestFirst);

class TestFirst2 extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst2', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirst2WithLayer = withKeyLayer(1)(TestFirst);

class TestSecond extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestSecond', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestSecondWithLayer = withKeyLayer(2)(TestSecond);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isRemovedSecond: false };
  }
  
  componentDidMount() {
    setTimeout(() => {
      // Remove TestSecondWithLayer
      // and than TestFirstWithLaye, TestFirst2WithLayer start listen key events
      this.setState({ isRemovedSecond: true });
    }, 3000);
  }
  
  render() {
    return [
      <TestFirstWithLayer key={0} />,
      <TestFirst2WithLayer key={1} />,
      this.state.isRemovedSecond ? null : <TestSecondWithLayer key={2} />,
    ];
  }
}

render(
  <App />,
  document.getElementById('app')
);

// TestSecondWithLayer is listening key events for 3 seconds
// TestFirstWithLayer isn't listening key events
// TestFirst2WithLayer isn't listening key events
```

## Force executable layer
Component which connected with this layer will listen key events despite
the existence of the "high priority layers" and "general priority layers".

For creating component which connected with **Force executable layer** needs to execute HOC with layerIndex = EMITTER_FORCE_LAYER_TYPE.
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer, { EMITTER_FORCE_LAYER_TYPE } from 'react-key-layers';

class TestFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirstWithLayer = withKeyLayer(1)(TestFirst);

class TestFirst2 extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst2', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirst2WithLayer = withKeyLayer(1)(TestFirst2);

class TestForce extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestForce', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestForceWithLayer = withKeyLayer(EMITTER_FORCE_LAYER_TYPE)(TestForce);

class App extends Component {
  render() {
    return [
      <TestFirstWithLayer key={0} />,
      <TestFirst2WithLayer key={1} />,
      <TestForceWithLayer key={2} />,
    ];
  }
}

render(
  <App />,
  document.getElementById('app')
);

// TestFirstWithLayer is listening key events
// TestFirst2WithLayer is listening key events
// TestForceWithLayer is listening key events
```

## Summary
In general there are two active layers
* Force executable layer
* One of the high priority or low priority layer.
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer, { EMITTER_FORCE_LAYER_TYPE } from 'react-key-layers';

class Hight extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the Hight', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const HightWithLayer = withKeyLayer(Hight);

class TestFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirstWithLayer = withKeyLayer(1)(TestFirst);

class TestSecond extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestSecond', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestSecondWithLayer = withKeyLayer(2)(TestSecond);

class TestForce extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestForce', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestForceWithLayer = withKeyLayer(EMITTER_FORCE_LAYER_TYPE)(TestForce);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isRemovedHigh: false, isRemovedSecond: false };
  }
  
  componentDidMount() {
    setTimeout(() => {
      // Remove TestSecondWithLayer
      // and than TestSecondWithLayer starts listen key events
      this.setState({ isRemovedHigh: true });
    }, 3000);
    setTimeout(() => {
      // Remove HightWithLayer
      // and than TestFirstWithLayer starts listen key events
      this.setState({ isRemovedSecond: true });
    }, 6000);

  }

  render() {
    return [
      this.state.isRemovedHigh ? null : <HightWithLayer key={0} />, 
      <TestFirstWithLayer key={1} />,
      this.state.isRemovedSecond ? null : <TestSecondWithLayer key={2} />,
      <TestForceWithLayer key={3} />,
    ];
  }
}

render(
  <App />,
  document.getElementById('app')
);

// HightWithLayer is listening key events
// TestFirstWithLayer isn't listening key events
// TestSecondWithLayer isn't listening key events
// TestForceWithLayer is listening key events
```
# API
There are two api types (module and component with layer).
## Module API
### withKeyLayer(layerIndex[, componentConfig]) ###
HOC which takes two parameters and returns configured HOC.
```javascript
export default withKeyLayer(layerIndex, componentConfig)(ListHeader);
```

***layerIndex*** - it's an index of the layer with which key listerners instance connect.
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer, { EMITTER_FORCE_LAYER_TYPE } from 'react-key-layers';

class TestFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirstWithLayer = withKeyLayer(1)(TestFirst);

class TestList extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestList', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestListWithLayer = withKeyLayer('list')(TestList);

class TestHightFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestHightFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestHightFirstWithLayer = withKeyLayer(TestHightFirst);

class TestHightSecond extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestHightSecond', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestHightSecondWithLayer = withKeyLayer(null)(TestHightSecond);

class TestForce extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addKeyListener('keyDown', (e) => {
      console.log('Key down of the TestForce', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestForceWithLayer = withKeyLayer(EMITTER_FORCE_LAYER_TYPE)(TestForce);

class App extends Component {
  render() {
    return [
      <TestFirstWithLayer key={0} />,
      <TestHightFirstWithLayer key={1} />,
      <TestHightSecondWithLayer key={2} />,
      <TestForceWithLayer key={3} />,
      <TestListWithLayer key={4} />,
    ];
  }
}

render(
  <App />,
  document.getElementById('app')
);
```

***componentConfig*** - it's a new component configuration object.

***componentConfig.releaseDelay*** - it's a delay between down and up events for release synthetic event. By default, this value sets to 150 ms.

***componentConfig.addListenerMethodName*** - it's a name for the add key listener function, that pass to the props. By default, this value sets to "addKeyListener".

***componentConfig.removeListenerMethodName*** - it's a name for the remove key listener function, that pass to the props. By default, this value sets to "removeKeyListener".
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer from 'react-key-layers';

class TestFirst extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addListener('keyDown', (e) => {
      console.log('Key down of the TestFirst', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestFirstWithLayer = withKeyLayer(1, {
  releaseDelay: 250,
  addListenerMethodName: 'addListener',
  removeListenerMethodName: 'removeListener',
})(TestFirst);

class App extends Component {
  render() {
    return <TestFirstWithLayer />
  }
}

render(
  <App />,
  document.getElementById('app')
);
```

### EMITTER_FORCE_LAYER_TYPE ###
Force executable layer index.
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer, { EMITTER_FORCE_LAYER_TYPE } from 'react-key-layers';

class TestForce extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addListener('keyDown', (e) => {
      console.log('Key down of the TestForce', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestForceWithLayer = withKeyLayer(EMITTER_FORCE_LAYER_TYPE)(TestForce);

class App extends Component {
  render() {
    return <TestForceWithLayer />
  }
}

render(
  <App />,
  document.getElementById('app')
);
```

### setConfig(config) ###
Sets general configuration.

***config.releaseDelay*** - it's a delay between down and up events for release synthetic event for all components are created by HOC. By default, this value sets to 150 ms.

***config.aliases*** - Sets names for the layer's index and that component can be connected to the layer by alias.
```javascript
import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import HOC
import withKeyLayer, { setConfig } from 'react-key-layers';

setConfig({
  releaseDelay: 250,
  aliases: {
    list: 1,
    preview: 2,
  },
});

class TestList extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addListener('keyDown', (e) => {
      console.log('Key down of the TestList', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestListWithLayer = withKeyLayer('list')(TestList);

class TestPreview extends Component {
  componentDidMount() {
    // Add a listener for any key down event.
    this.props.addListener('keyDown', (e) => {
      console.log('Key down of the TestPreview', e);
    });
  }
  
  render() {
    return <div />;
  }
};

const TestPreviewWithLayer = withKeyLayer('preview')(TestPreview);

class App extends Component {
  render() {
    return [
      <TestListWithLayer key={0} />,
      <TestPreviewWithLayer key={1} />,
      ]
  }
}

render(
  <App />,
  document.getElementById('app')
);
```

## Component with layer API
### addKeyListener(type, callback[, options]) ###
Add key event listener. **name can be changed from HOC config (second parameter).**

***type*** - type of the event listener. It can be on of "keyDown", "keyUp", "keyPress", "keyRelease". "keyRelease" is a synthetic event of the when user downs and ups the key with delay 150 ms or less.

***callback*** - specifies the function to run when the event occurs.

***options*** - settings of the event listener.

***options.metaKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed command key.

***options.ctrlKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed control key.

***options.altKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed alt key.

***options.shiftKey*** - a boolean parameter that allows you to set the execution of the callback only with pressed shift key.

***options.code*** - an integer parameter that allows you to set the execution of the callback only for the key matches keyCode.

***options.codes*** - an array with number that allows you to set the execution of the callback only for the key combination matches keyCodes from array.

***options.skipInput*** - a boolean parameter that allows you to set skip the execution of the callback if an input or a textarea is in a focus.

### removeListener(type, callback) ###
Remove key event listener. **name can be changed from HOC config (second parameter).**

***type*** - type of the event listener. It can be on of "keyDown", "keyUp", "keyPress", "keyRelease". "keyRelease" is a synthetic event of the when user downs and ups the key with delay 150 ms or less.

***callback*** - specifies the function to run when the event occurs.
