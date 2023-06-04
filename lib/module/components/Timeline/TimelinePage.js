import times from 'lodash/times';
import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { COLUMNS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import { convertPositionToISOString, divideEventsByColumns } from '../../utils';
import EventBlock from './EventBlock';
import NowIndicator from './NowIndicator';
import TimelineBoard from './TimelineBoard';
import TimelineHours from './TimelineHours';
const TimelinePage = _ref => {
  let {
    startDate,
    onPressBackground,
    onLongPressBackground,
    onPressOutBackground,
    isLoading,
    holidays,
    events,
    onPressEvent,
    onLongPressEvent,
    renderEventContent,
    selectedEventId,
    renderCustomUnavailableItem,
    renderHalfLineCustom,
    halfLineContainerStyle,
    currentDate
  } = _ref;
  const {
    rightSideWidth,
    viewMode,
    spaceFromTop,
    timeIntervalHeight,
    totalHours,
    timelineWidth,
    columnWidth,
    showNowIndicator,
    start,
    overlapEventsSpacing,
    rightEdgeSpacing,
    theme,
    eventAnimatedDuration,
    tzOffset,
    updateCurrentDate,
    nowIndicatorInterval,
    isPinchActive,
    heightByTimeInterval
  } = useTimelineCalendarContext();
  const eventsByColumns = useMemo(() => divideEventsByColumns({
    events,
    columns: COLUMNS[viewMode],
    columnWidth,
    startHour: start,
    startDate,
    overlapEventsSpacing,
    rightEdgeSpacing,
    tzOffset
  }), [columnWidth, events, overlapEventsSpacing, rightEdgeSpacing, start, startDate, viewMode, tzOffset]);
  const boardStyle = useAnimatedStyle(() => {
    return {
      height: totalHours * timeIntervalHeight.value
    };
  });
  const _onPressBackgroundHandler = (type, event) => {
    if (!event.nativeEvent.locationX || !event.nativeEvent.locationY) {
      return;
    }
    const dateIsoString = convertPositionToISOString(event.nativeEvent.locationX, event.nativeEvent.locationY, startDate, heightByTimeInterval.value, columnWidth);
    switch (type) {
      case 'longPress':
        onLongPressBackground === null || onLongPressBackground === void 0 ? void 0 : onLongPressBackground(dateIsoString, event);
        break;
      case 'pressOut':
        onPressOutBackground === null || onPressOutBackground === void 0 ? void 0 : onPressOutBackground(dateIsoString, event);
        break;
      default:
        onPressBackground === null || onPressBackground === void 0 ? void 0 : onPressBackground(dateIsoString, event);
        break;
    }
  };
  const _renderEvent = (event, dayIndex) => {
    return /*#__PURE__*/React.createElement(EventBlock, {
      key: event.id,
      event: event,
      dayIndex: dayIndex,
      columnWidth: columnWidth,
      timeIntervalHeight: timeIntervalHeight,
      onPressEvent: onPressEvent,
      onLongPressEvent: onLongPressEvent,
      renderEventContent: renderEventContent,
      selectedEventId: selectedEventId,
      theme: theme,
      eventAnimatedDuration: eventAnimatedDuration,
      isPinchActive: isPinchActive,
      heightByTimeInterval: heightByTimeInterval
    });
  };
  const _renderTimelineColumn = dayIndex => {
    var _eventsByColumns$dayI;
    const dateByColumn = moment.tz(startDate, tzOffset).add(dayIndex, 'd');
    const dateStr = dateByColumn.format('YYYY-MM-DD');
    const isToday = dateStr === currentDate;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: dayIndex
    }, /*#__PURE__*/React.createElement(View, {
      pointerEvents: "box-none",
      style: styles.eventsContainer
    }, (_eventsByColumns$dayI = eventsByColumns[dayIndex]) === null || _eventsByColumns$dayI === void 0 ? void 0 : _eventsByColumns$dayI.map(event => _renderEvent(event, dayIndex))), showNowIndicator && isToday && /*#__PURE__*/React.createElement(NowIndicator, {
      timeIntervalHeight: heightByTimeInterval,
      width: columnWidth,
      dayIndex: dayIndex,
      nowIndicatorColor: theme.nowIndicatorColor,
      tzOffset: tzOffset,
      start: start,
      updateCurrentDate: updateCurrentDate,
      nowIndicatorInterval: nowIndicatorInterval
    }));
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      width: viewMode === 'day' ? timelineWidth : rightSideWidth
    }]
  }, viewMode === 'day' && /*#__PURE__*/React.createElement(TimelineHours, null), /*#__PURE__*/React.createElement(Animated.View, {
    style: [{
      width: rightSideWidth,
      marginTop: spaceFromTop
    }, boardStyle]
  }, /*#__PURE__*/React.createElement(TimelineBoard, {
    startDate: startDate,
    onPressBackgroundHandler: _onPressBackgroundHandler,
    holidays: holidays,
    renderCustomUnavailableItem: renderCustomUnavailableItem,
    renderHalfLineCustom: renderHalfLineCustom,
    halfLineContainerStyle: halfLineContainerStyle
  }), times(COLUMNS[viewMode], _renderTimelineColumn)), isLoading && /*#__PURE__*/React.createElement(View, {
    style: styles.loadingFrame
  }));
};
export default TimelinePage;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  loadingFrame: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0)'
  },
  eventsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=TimelinePage.js.map