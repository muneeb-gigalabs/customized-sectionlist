import React, { useState, useEffect, useRef } from 'react';
import { SectionList } from 'react-native';

const TwoWaySectionList = ({
  sections,
  keyExtractor,
  renderItem,
  renderSectionHeader,
  initialNumToRender,
  onEndReached,
  onEndReachedThreshold,
  onScrollToIndexFailed,
  getItemLayout,
  pageSize,
  onTopReached,
}) => {
  const [fetchPrevious, setFetchPrevious] = useState(false);
  const sectionListRef = useRef(null);

  const prevZeroIndexRef = useRef();
  useEffect(() => {
    prevZeroIndexRef.current = {
      sections: sections[0],
    };
  });
  const prevState = prevZeroIndexRef.current;

  useEffect(() => {
    if (
      sections.length === pageSize * 2 ||
      (prevState &&
        prevState.sections &&
        prevState.sections.key !== sections[0].key)
    )
      scrollToSection();
  }, [sections]);

  const scrollToSection = () => {
    setTimeout(() => {
      sectionListRef.current.scrollToLocation({
        animated: false,
        sectionIndex: pageSize - 1,
        itemIndex: sections[pageSize - 1].data.length - 1,
        viewPosition: 0,
      });
    }, 0);
  };

  const onViewableItemsChanged = (item) => {
    let titlesDisplayed = item.viewableItems.map(
      (singleItem) => singleItem.section.key
    );
    if (!titlesDisplayed.includes(sections[0].key)) {
      setFetchPrevious(true);
      return;
    }
    if (fetchPrevious) {
      let changed = null;
      if (item && item.changed) {
        changed = item.changed;
        for (let i = 0; i < changed.length; i++) {
          const element = changed[i];
          if (element.isViewable && element.section.key === sections[0].key) {
            onTopReached();
            setFetchPrevious(false);
            return;
          }
        }
      }
    }
  };

  return (
    <SectionList
      ref={sectionListRef}
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      initialNumToRender={initialNumToRender}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      onViewableItemsChanged={(change) => onViewableItemsChanged(change)}
      onScrollToIndexFailed={onScrollToIndexFailed}
      getItemLayout={getItemLayout}
    />
  );
};

export default TwoWaySectionList;
