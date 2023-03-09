function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import moment from 'moment-timezone';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { timeZoneData } from '../../assets/timeZone';
import { COLUMNS, DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import useDragCreateGesture from '../../hooks/useDragCreateGesture';
import useZoomGesture from '../../hooks/usePinchGesture';
import useTimelineScroll from '../../hooks/useTimelineScroll';
import { clampValues, groupEventsByDate } from '../../utils';
import DragCreateItem from './DragCreateItem';
import TimelineHeader from './TimelineHeader';
import TimelineSlots from './TimelineSlots';
const Timeline = (_ref, ref) => {
  let {
    renderDayBarItem,
    onPressDayNum,
    onDragCreateEnd,
    onLongPressBackground,
    isLoading,
    events,
    selectedEvent,
    highlightDates,
    onChange,
    ...other
  } = _ref;
  const {
    timelineLayoutRef,
    minTimeIntervalHeight,
    theme,
    totalHours,
    allowDragToCreate,
    firstDate,
    viewMode,
    totalPages,
    timelineHorizontalListRef,
    timeIntervalHeight,
    spaceFromTop,
    allowPinchToZoom,
    scrollToNow,
    initialDate,
    locale,
    isShowHeader,
    currentIndex,
    pages,
    tzOffset,
    maxTimeIntervalHeight,
    updateCurrentDate,
    offsetY,
    timelineVerticalListRef,
    initialTimeIntervalHeight,
    recheckTimezoneOffset
  } = useTimelineCalendarContext();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = useTimelineScroll();
  useImperativeHandle(ref, () => ({
    goToDate: props => {
      var _timelineHorizontalLi;
      const numOfDays = viewMode === 'workWeek' ? COLUMNS.week : COLUMNS[viewMode];
      const currentDay = moment.tz(props === null || props === void 0 ? void 0 : props.date, tzOffset);
      const firstDateMoment = moment.tz(firstDate.current[viewMode], tzOffset);
      const diffDays = currentDay.startOf('D').diff(firstDateMoment, 'd');
      const pageIndex = Math.floor(diffDays / numOfDays);
      if (pageIndex < 0 || pageIndex > totalPages[viewMode] - 1) {
        return;
      }
      (_timelineHorizontalLi = timelineHorizontalListRef.current) === null || _timelineHorizontalLi === void 0 ? void 0 : _timelineHorizontalLi.scrollToIndex({
        index: pageIndex,
        animated: props === null || props === void 0 ? void 0 : props.animatedDate
      });
      if (props !== null && props !== void 0 && props.hourScroll) {
        const minutes = currentDay.hour() * 60 + currentDay.minute();
        const position = minutes * timeIntervalHeight.value / 60 + spaceFromTop;
        const offset = timeIntervalHeight.value * 5;
        goToOffsetY(Math.max(0, position - offset), props === null || props === void 0 ? void 0 : props.animatedHour);
      }
    },
    goToNextPage: goToNextPage,
    goToPrevPage: goToPrevPage,
    getZones: () => Object.values(timeZoneData),
    getZone: key => timeZoneData[key],
    getHour: () => {
      const position = offsetY.value + 8;
      const minutes = (position - spaceFromTop) * 60 / timeIntervalHeight.value;
      const hour = minutes / 60;
      return Math.max(0, hour);
    },
    getDate: () => {
      const numOfDays = viewMode === 'workWeek' ? COLUMNS.week : COLUMNS[viewMode];
      const firstDateMoment = moment.tz(firstDate.current[viewMode], tzOffset);
      const pageIndex = currentIndex.value;
      const currentDay = firstDateMoment.add(pageIndex * numOfDays, 'd');
      return currentDay.toISOString();
    },
    goToHour: (hour, animated) => {
      const minutes = hour * 60;
      const position = minutes * timeIntervalHeight.value / 60 + spaceFromTop;
      goToOffsetY(Math.max(0, position - 8), animated);
    },
    forceUpdateNowIndicator: updateCurrentDate,
    recheckTimezoneOffset: recheckTimezoneOffset,
    zoom: props => {
      var _timelineVerticalList;
      let newHeight = (props === null || props === void 0 ? void 0 : props.height) ?? initialTimeIntervalHeight;
      if (props !== null && props !== void 0 && props.scale) {
        newHeight = timeIntervalHeight.value * props.scale;
      }
      const clampedHeight = clampValues(newHeight, minTimeIntervalHeight.value, maxTimeIntervalHeight);
      const pinchYNormalized = offsetY.value / timeIntervalHeight.value;
      const pinchYScale = clampedHeight * pinchYNormalized;
      const y = pinchYScale;
      (_timelineVerticalList = timelineVerticalListRef.current) === null || _timelineVerticalList === void 0 ? void 0 : _timelineVerticalList.scrollTo({
        x: 0,
        y,
        animated: true
      });
      timeIntervalHeight.value = withTiming(clampedHeight);
    }
  }), [goToNextPage, goToPrevPage, updateCurrentDate, viewMode, tzOffset, firstDate, totalPages, timelineHorizontalListRef, timeIntervalHeight, currentIndex.value, spaceFromTop, goToOffsetY, minTimeIntervalHeight.value, maxTimeIntervalHeight, offsetY.value, timelineVerticalListRef, initialTimeIntervalHeight, recheckTimezoneOffset]);
  useEffect(() => {
    moment.locale(locale);
  }, [locale]);
  useEffect(() => {
    requestAnimationFrame(() => {
      const current = moment.tz(tzOffset);
      const isSameDate = current.format('YYYY-MM-DD') === initialDate.current;
      if (scrollToNow && isSameDate) {
        const minutes = current.hour() * 60 + current.minute();
        const position = minutes * timeIntervalHeight.value / 60 + spaceFromTop;
        const offset = timeIntervalHeight.value * 5;
        goToOffsetY(Math.max(0, position - offset), true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goToOffsetY, scrollToNow]);
  const _onContentLayout = _ref2 => {
    let {
      nativeEvent: {
        layout
      }
    } = _ref2;
    if (!minTimeIntervalHeight.value) {
      const minHeight = Math.max(layout.height / (totalHours + 1), DEFAULT_PROPS.MIN_TIME_INTERVAL_HEIGHT);
      minTimeIntervalHeight.value = minHeight;
    }
    timelineLayoutRef.current = {
      width: layout.width,
      height: layout.height
    };
  };
  const {
    zoomGesture
  } = useZoomGesture({
    enabled: allowPinchToZoom && !(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id)
  });
  const {
    dragCreateGesture,
    isDraggingCreate,
    dragXPosition,
    dragYPosition,
    currentHour,
    onLongPress
  } = useDragCreateGesture({
    onDragCreateEnd
  });
  const _onLongPressBackground = (date, event) => {
    if (allowDragToCreate && !selectedEvent) {
      onLongPress(event);
    }
    onLongPressBackground === null || onLongPressBackground === void 0 ? void 0 : onLongPressBackground(date, event);
  };
  const groupedEvents = useMemo(() => groupEventsByDate(events, tzOffset), [events, tzOffset]);
  useAnimatedReaction(() => currentIndex.value, (index, prevIndex) => {
    if (!onChange) {
      return;
    }
    const startDate = pages[viewMode].data[index];
    if (startDate) {
      runOnJS(onChange)({
        length: pages[viewMode].data.length,
        index,
        prevIndex,
        date: startDate
      });
    }
  }, [viewMode]);
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
    style: [styles.container, {
      backgroundColor: theme.backgroundColor
    }]
  }, isShowHeader && /*#__PURE__*/React.createElement(TimelineHeader, {
    renderDayBarItem: renderDayBarItem,
    onPressDayNum: onPressDayNum,
    isLoading: isLoading,
    highlightDates: highlightDates,
    selectedEventId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id
  }), /*#__PURE__*/React.createElement(View, {
    style: styles.content,
    onLayout: _onContentLayout
  }, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: Gesture.Race(dragCreateGesture, zoomGesture)
  }, /*#__PURE__*/React.createElement(TimelineSlots, _extends({}, other, {
    events: groupedEvents,
    selectedEvent: selectedEvent,
    isDragging: isDraggingCreate,
    isLoading: isLoading,
    onLongPressBackground: _onLongPressBackground
  }))), isDraggingCreate && /*#__PURE__*/React.createElement(DragCreateItem, {
    offsetX: dragXPosition,
    offsetY: dragYPosition,
    currentHour: currentHour
  })));
};
export default /*#__PURE__*/forwardRef(Timeline);
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexGrow: 1
  }
});
//# sourceMappingURL=index.js.map