import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SectionListComponent from './src/components/SectionList'
import CustomDatePicker from './src/components/CustomDatePicker';

export default function App() {
  return (
    <View style={styles.container}>
      <CustomDatePicker />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
