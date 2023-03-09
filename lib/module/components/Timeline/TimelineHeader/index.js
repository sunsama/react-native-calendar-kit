function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { AnimatedFlashList } from '@shopify/flash-list';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../../constants';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
import MultipleDayBar from './MultipleDayBar';
import ProgressBar from './ProgressBar';
import SingleDayBar from './SingleDayBar';
const TimelineHeader = _ref => {
  let {
    renderDayBarItem,
    onPressDayNum,
    isLoading,
    highlightDates,
    selectedEventId
  } = _ref;
  const {
    syncedLists,
    viewMode,
    dayBarListRef,
    pages,
    timelineWidth,
    rightSideWidth,
    currentIndex,
    hourWidth,
    columnWidth,
    theme,
    locale,
    tzOffset,
    currentDate
  } = useTimelineCalendarContext();
  const [startDate, setStartDate] = useState(pages[viewMode].data[pages[viewMode].index] || '');
  const dayBarIndex = useRef(pages.week.index);
  const _renderSingleDayItem = _ref2 => {
    let {
      item,
      extraData
    } = _ref2;
    const dayItemProps = {
      width: timelineWidth,
      startDate: item,
      columnWidth,
      hourWidth,
      viewMode,
      onPressDayNum,
      theme: extraData.theme,
      locale: extraData.locale,
      highlightDates: extraData.highlightDates,
      tzOffset,
      currentDate: extraData.currentDate
    };
    if (renderDayBarItem) {
      return renderDayBarItem(dayItemProps);
    }
    return /*#__PURE__*/React.createElement(SingleDayBar, dayItemProps);
  };
  const _renderMultipleDayItem = _ref3 => {
    let {
      item,
      extraData
    } = _ref3;
    const dayItemProps = {
      width: rightSideWidth,
      startDate: item,
      columnWidth,
      hourWidth,
      viewMode,
      onPressDayNum,
      theme: extraData.theme,
      locale: extraData.locale,
      highlightDates: extraData.highlightDates,
      tzOffset,
      currentDate: extraData.currentDate
    };
    if (renderDayBarItem) {
      return renderDayBarItem(dayItemProps);
    }
    return /*#__PURE__*/React.createElement(MultipleDayBar, dayItemProps);
  };
  const extraValues = useMemo(() => ({
    locale,
    highlightDates,
    theme,
    currentDate
  }), [locale, highlightDates, theme, currentDate]);
  const _renderDayBarList = () => {
    const listProps = {
      ref: dayBarListRef,
      keyExtractor: item => item,
      scrollEnabled: false,
      disableHorizontalListHeightMeasurement: true,
      showsHorizontalScrollIndicator: false,
      horizontal: true,
      bounces: false,
      scrollEventThrottle: 16,
      pagingEnabled: true,
      extraData: extraValues
    };
    if (viewMode === 'day') {
      return /*#__PURE__*/React.createElement(View, {
        style: {
          width: timelineWidth
        }
      }, /*#__PURE__*/React.createElement(AnimatedFlashList, _extends({}, listProps, {
        data: pages[viewMode].data,
        initialScrollIndex: pages[viewMode].index,
        estimatedItemSize: timelineWidth,
        estimatedListSize: {
          width: timelineWidth,
          height: DEFAULT_PROPS.DAY_BAR_HEIGHT
        },
        renderItem: _renderSingleDayItem,
        onScroll: e => {
          const x = e.nativeEvent.contentOffset.x;
          const width = e.nativeEvent.layoutMeasurement.width;
          const pageIndex = Math.round(x / width);
          if (dayBarIndex.current !== pageIndex) {
            dayBarIndex.current = pageIndex;
          }
        }
      })));
    }
    return /*#__PURE__*/React.createElement(View, {
      style: styles.multipleDayContainer
    }, /*#__PURE__*/React.createElement(View, {
      style: {
        width: hourWidth
      }
    }), /*#__PURE__*/React.createElement(View, {
      style: {
        width: rightSideWidth
      }
    }, /*#__PURE__*/React.createElement(AnimatedFlashList, _extends({}, listProps, {
      data: pages[viewMode].data,
      initialScrollIndex: pages[viewMode].index,
      estimatedItemSize: rightSideWidth,
      estimatedListSize: {
        width: rightSideWidth,
        height: DEFAULT_PROPS.DAY_BAR_HEIGHT
      },
      renderItem: _renderMultipleDayItem
    }))));
  };
  useAnimatedReaction(() => currentIndex.value, index => {
    if (syncedLists) {
      return;
    }
    const dateByIndex = pages[viewMode].data[index];
    if (dateByIndex) {
      runOnJS(setStartDate)(dateByIndex);
    }
  }, [viewMode, syncedLists]);
  const _renderDayBarView = () => {
    if (viewMode === 'day') {
      return _renderSingleDayItem({
        item: startDate,
        extraData: extraValues,
        index: 0,
        target: 'Cell'
      });
    }
    return /*#__PURE__*/React.createElement(View, {
      style: styles.multipleDayContainer
    }, /*#__PURE__*/React.createElement(View, {
      style: {
        width: hourWidth
      }
    }), _renderMultipleDayItem({
      item: startDate,
      extraData: extraValues,
      index: 0,
      target: 'Cell'
    }));
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      backgroundColor: theme.backgroundColor
    }]
  }, syncedLists ? _renderDayBarList() : _renderDayBarView(), selectedEventId && /*#__PURE__*/React.createElement(View, {
    style: styles.disabledFrame
  }), isLoading && /*#__PURE__*/React.createElement(ProgressBar, {
    barColor: theme.loadingBarColor
  }));
};
export default TimelineHeader;
const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 99
  },
  multipleDayContainer: {
    flexDirection: 'row'
  },
  disabledFrame: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0)'
  }
});
//# sourceMappingURL=index.js.map