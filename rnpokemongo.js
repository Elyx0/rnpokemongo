/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MapContainer from './containers/MapContainer';
import configureStore from './configureStore';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class rnpokemongo extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <MapContainer />
      </Provider>

    );
  }
}
