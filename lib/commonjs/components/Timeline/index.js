"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _timeZone = require("../../assets/timeZone");
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
var _useDragCreateGesture = _interopRequireDefault(require("../../hooks/useDragCreateGesture"));
var _usePinchGesture = _interopRequireDefault(require("../../hooks/usePinchGesture"));
var _useTimelineScroll = _interopRequireDefault(require("../../hooks/useTimelineScroll"));
var _utils = require("../../utils");
var _DragCreateItem = _interopRequireDefault(require("./DragCreateItem"));
var _TimelineHeader = _interopRequireDefault(require("./TimelineHeader"));
var _TimelineSlots = _interopRequireDefault(require("./TimelineSlots"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = (0, _useTimelineScroll.default)();
  (0, _react.useImperativeHandle)(ref, () => ({
    goToDate: props => {
      var _timelineHorizontalLi;
      const numOfDays = viewMode === 'workWeek' ? _constants.COLUMNS.week : _constants.COLUMNS[viewMode];
      const currentDay = _momentTimezone.default.tz(props === null || props === void 0 ? void 0 : props.date, tzOffset);
      const firstDateMoment = _momentTimezone.default.tz(firstDate.current[viewMode], tzOffset);
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
    getZones: () => Object.values(_timeZone.timeZoneData),
    getZone: key => _timeZone.timeZoneData[key],
    getHour: () => {
      const position = offsetY.value + 8;
      const minutes = (position - spaceFromTop) * 60 / timeIntervalHeight.value;
      const hour = minutes / 60;
      return Math.max(0, hour);
    },
    getDate: () => {
      const numOfDays = viewMode === 'workWeek' ? _constants.COLUMNS.week : _constants.COLUMNS[viewMode];
      const firstDateMoment = _momentTimezone.default.tz(firstDate.current[viewMode], tzOffset);
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
      const clampedHeight = (0, _utils.clampValues)(newHeight, minTimeIntervalHeight.value, maxTimeIntervalHeight);
      const pinchYNormalized = offsetY.value / timeIntervalHeight.value;
      const pinchYScale = clampedHeight * pinchYNormalized;
      const y = pinchYScale;
      (_timelineVerticalList = timelineVerticalListRef.current) === null || _timelineVerticalList === void 0 ? void 0 : _timelineVerticalList.scrollTo({
        x: 0,
        y,
        animated: true
      });
      timeIntervalHeight.value = (0, _reactNativeReanimated.withTiming)(clampedHeight);
    }
  }), [goToNextPage, goToPrevPage, updateCurrentDate, viewMode, tzOffset, firstDate, totalPages, timelineHorizontalListRef, timeIntervalHeight, currentIndex.value, spaceFromTop, goToOffsetY, minTimeIntervalHeight.value, maxTimeIntervalHeight, offsetY.value, timelineVerticalListRef, initialTimeIntervalHeight, recheckTimezoneOffset]);
  (0, _react.useEffect)(() => {
    _momentTimezone.default.locale(locale);
  }, [locale]);
  (0, _react.useEffect)(() => {
    requestAnimationFrame(() => {
      const current = _momentTimezone.default.tz(tzOffset);
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
      const minHeight = Math.max(layout.height / (totalHours + 1), _constants.DEFAULT_PROPS.MIN_TIME_INTERVAL_HEIGHT);
      minTimeIntervalHeight.value = minHeight;
    }
    timelineLayoutRef.current = {
      width: layout.width,
      height: layout.height
    };
  };
  const {
    zoomGesture
  } = (0, _usePinchGesture.default)({
    enabled: allowPinchToZoom && !(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id)
  });
  const {
    dragCreateGesture,
    isDraggingCreate,
    dragXPosition,
    dragYPosition,
    currentHour,
    onLongPress
  } = (0, _useDragCreateGesture.default)({
    onDragCreateEnd
  });
  const _onLongPressBackground = (date, event) => {
    if (allowDragToCreate && !selectedEvent) {
      onLongPress(event);
    }
    onLongPressBackground === null || onLongPressBackground === void 0 ? void 0 : onLongPressBackground(date, event);
  };
  const groupedEvents = (0, _react.useMemo)(() => (0, _utils.groupEventsByDate)(events, tzOffset), [events, tzOffset]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => currentIndex.value, (index, prevIndex) => {
    if (!onChange) {
      return;
    }
    const startDate = pages[viewMode].data[index];
    if (startDate) {
      (0, _reactNativeReanimated.runOnJS)(onChange)({
        length: pages[viewMode].data.length,
        index,
        prevIndex,
        date: startDate
      });
    }
  }, [viewMode]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: [styles.container, {
      backgroundColor: theme.backgroundColor
    }]
  }, isShowHeader && /*#__PURE__*/_react.default.createElement(_TimelineHeader.default, {
    renderDayBarItem: renderDayBarItem,
    onPressDayNum: onPressDayNum,
    isLoading: isLoading,
    highlightDates: highlightDates,
    selectedEventId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.content,
    onLayout: _onContentLayout
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: _reactNativeGestureHandler.Gesture.Race(dragCreateGesture, zoomGesture)
  }, /*#__PURE__*/_react.default.createElement(_TimelineSlots.default, _extends({}, other, {
    events: groupedEvents,
    selectedEvent: selectedEvent,
    isDragging: isDraggingCreate,
    isLoading: isLoading,
    onLongPressBackground: _onLongPressBackground
  }))), isDraggingCreate && /*#__PURE__*/_react.default.createElement(_DragCreateItem.default, {
    offsetX: dragXPosition,
    offsetY: dragYPosition,
    currentHour: currentHour
  })));
};
var _default = /*#__PURE__*/(0, _react.forwardRef)(Timeline);
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexGrow: 1
  }
});
//# sourceMappingURL=index.js.map