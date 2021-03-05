import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SectionListComponent from './src/components/SectionList'
import CustomDatePicker from './src/components/CustomDatePicker';
import DatePickerContainer from './src/containers/DatePickerContainer';

export default function App() {
  return (
    <View style={styles.container}>
      <DatePickerContainer />
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
