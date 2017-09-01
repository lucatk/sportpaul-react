import loadable from 'react-loadable';

import LoadingPage from './LoadingPage';

const LoadableComponent = opts => loadable({
  loading: LoadingPage,
  ...opts
});

export default LoadableComponent;
