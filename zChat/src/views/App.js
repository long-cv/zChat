/* eslint-disable comma-dangle */
/**
 * Sample chat app
 *
 * @format
 * @flow
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {AppNavigator, reducers} from '../srcExports';

const store = createStore(reducers);

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export {App};
