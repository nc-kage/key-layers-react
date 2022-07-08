import React, { useState, useCallback } from 'react';

import './App.scss';

import Main from './components/Main';
import Secondary from './components/Secondary';

const App = () => {
  const [withSecondary, setWithSecondary] = useState(false);

  const onMainRelease = useCallback(() => {
    console.log('Main release');
    setWithSecondary(true);
  }, [setWithSecondary]);

  const onSecondaryRelease = useCallback(() => {
    console.log('Secondary release');
    setWithSecondary(false);
  }, [setWithSecondary]);

  return (
    <div>
      <Main
        onRelease={onMainRelease}
        code={78}
      />
      {withSecondary && <Secondary onRelease={onSecondaryRelease} code={78} />}
    </div>
  );
};
export default App;
