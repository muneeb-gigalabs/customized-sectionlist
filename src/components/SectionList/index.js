import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import Constants from 'expo-constants';
import _ from 'lodash';
import { getData, previousData } from './dumyData';
import TwoWaySectionList from '../TwoWaySectionList';

const Item = ({ item }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item}</Text>
    </View>
  );
};

const ITEM_HEIGHT = 50;
const pageSize = 5;

const SectionListComponent = () => {
  const [previousPageNo, setPreviousPageNo] = useState(1);
  const [nextPageNo, setNextPageNo] = useState(1);
  const [nextMore, setNextMore] = useState(true);
  const [previousMore, setPreviousMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let nextResult = getData(nextPageNo, pageSize);
    let previousResult = previousData(previousPageNo, pageSize);
    let finalData = [...data];
    if (nextResult.data && nextResult.data.length) {
      finalData = [...finalData, ...nextResult.data];
    }
    if (previousResult.data && previousResult.data.length) {
      finalData = [...previousResult.data, ...finalData];
    }
    setData(finalData);
    setPreviousMore(previousResult.hasMore);
    setNextMore(nextResult.hasMore);
    setPreviousPageNo(previousPageNo + 1);
    setNextPageNo(nextPageNo + 1);
  }, []);

  const onEndReached = () => {
    if (nextMore) {
      let result = getData(nextPageNo, pageSize);
      setData([...data, ...result.data]);
      setNextMore(result.hasMore);
      setNextPageNo(nextPageNo + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (previousMore) {
      let result = previousData(previousPageNo, pageSize);
      setData([...result.data, ...data]);
      setRefreshing(false);
      setPreviousMore(result.hasMore);
      setPreviousPageNo(previousPageNo + 1);
    } else {
      setRefreshing(false);
    }
  };

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <SafeAreaView
      style={Platform.OS === 'web' ? styles.webContainer : styles.container}
    >
      <TwoWaySectionList
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        initialNumToRender={3}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onScrollToIndexFailed={() => {}}
        getItemLayout={getItemLayout}
        pageSize={pageSize}
        refreshing={refreshing}
        onRefresh={onRefresh}
        setRefreshing={(val) => setRefreshing(val)}
        enableUpwardLoadMore={false}
      />
    </SafeAreaView>
  );
};

export default SectionListComponent;

const styles = StyleSheet.create({
  webContainer: {
    height: '90vh',
    width: '50%',
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    width: '80%',
  },
  item: {
    height: ITEM_HEIGHT,
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
  },
  header: {
    height: ITEM_HEIGHT,
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
