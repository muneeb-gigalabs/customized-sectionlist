import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  Platform
} from 'react-native';
import Constants from 'expo-constants';
import _ from 'lodash';
import { getData, previousData } from './dumyData';

const Item = ({ item }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item}</Text>
    </View>
  );
};

const ITEM_HEIGHT = 50;

const SectionListComponent = () => {
  const [previousPageNo, setPreviousPageNo] = useState(1);
  const [nextPageNo, setNextPageNo] = useState(1);
  const [nextMore, setNextMore] = useState(true);
  const [previousMore, setPreviousMore] = useState(true);
  const [data, setData] = useState([]);
  const [fetchPrevious, setFetchPrevious] = useState(false);

  const sectionListRef = useRef(null);

  const prevZeroIndexRef = useRef();
  useEffect(() => {
    prevZeroIndexRef.current = {
      data: data[0],
    };
  });
  const prevState = prevZeroIndexRef.current;

  useEffect(() => {
    if (
      data.length === 10 ||
      (prevState && prevState.data && prevState.data.key !== data[0].key)
    )
    scrollToSection();
  }, [data]);

  useEffect(() => {
    let nextResult = getData(nextPageNo, 5);
    let previousResult = previousData(previousPageNo, 5);
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
      let result = getData(nextPageNo, 5);
      setData([...data, ...result.data]);
      setNextMore(result.hasMore);
      setNextPageNo(nextPageNo + 1);
    }
  };

  const onRefresh = () => {
    if (previousMore && fetchPrevious) {
      let result = previousData(previousPageNo, 5);
      setData([...result.data, ...data]);
      setFetchPrevious(false);
      setPreviousMore(result.hasMore);
      setPreviousPageNo(previousPageNo + 1);
    }
  };

  const onViewableItemsChanged = (item) => {
    let titlesDisplayed = item.viewableItems.map(
      (singleItem) => singleItem.section.key
    );
    if (!titlesDisplayed.includes(data[0].key)) {
      setFetchPrevious(true);
      return;
    }
    if (fetchPrevious) {
      let changed = null;
      if (item && item.changed) {
        changed = item.changed;
        for (let i = 0; i < changed.length; i++) {
          const element = changed[i];
          if (element.isViewable && element.section.key === data[0].key) {
            onRefresh();
            return;
          }
        }
      }
    }
  };

  const scrollToSection = () => {
    setTimeout(() => {
      sectionListRef.current.scrollToLocation({
        animated: false,
        sectionIndex: 4,
        itemIndex: data[4].data.length - 1,
        viewPosition: 0,
      });
    }, 0);
  };

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <SafeAreaView style={Platform.OS === 'web' ? styles.webContainer : styles.container}>
      <SectionList
        ref={sectionListRef}
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        initialNumToRender={3}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={(change) => onViewableItemsChanged(change)}
        onScrollToIndexFailed={()=>{}}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
};

export default SectionListComponent;

const styles = StyleSheet.create({
  webContainer: {
    height: '90vh',
    width: '50%'
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    width: '80%'
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
