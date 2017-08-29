import loadable from 'react-loadable';

import LoadingPage from './LoadingPage';

const LoadableComponent = opts => loadable({
  loading: LoadingPage,
  delay: 300,
  ...opts
});

export default LoadableComponent;
