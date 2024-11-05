/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Provider } from 'react-redux';
import { store } from './src/Redux/Store/Store';

import Main from './src/Main';
import { BorderWidth } from 'react-bootstrap-icons';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  return (
    <Provider store={store}>

      <SafeAreaView style={[styles.app, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
        <Main />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  }
});

export default App;