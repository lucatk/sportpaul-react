import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './app/App';
import Checkout from './checkout/Checkout';
import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/checkout" component={Checkout}></Route>
  </Router>,
  document.getElementById('root')
);
