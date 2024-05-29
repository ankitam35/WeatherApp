import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import AppNavigation from './src/navigation/appNavigation';

function App(): React.JSX.Element {
  return <AppNavigation />;
}

export default App;
