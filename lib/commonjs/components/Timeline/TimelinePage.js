"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _times = _interopRequireDefault(require("lodash/times"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
var _utils = require("../../utils");
var _EventBlock = _interopRequireDefault(require("./EventBlock"));
var _NowIndicator = _interopRequireDefault(require("./NowIndicator"));
var _TimelineBoard = _interopRequireDefault(require("./TimelineBoard"));
var _TimelineHours = _interopRequireDefault(require("./TimelineHours"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const eventsByColumns = (0, _react.useMemo)(() => (0, _utils.divideEventsByColumns)({
    events,
    columns: _constants.COLUMNS[viewMode],
    columnWidth,
    startHour: start,
    startDate,
    overlapEventsSpacing,
    rightEdgeSpacing,
    tzOffset
  }), [columnWidth, events, overlapEventsSpacing, rightEdgeSpacing, start, startDate, viewMode, tzOffset]);
  const boardStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      height: totalHours * timeIntervalHeight.value
    };
  });
  const _onPressBackgroundHandler = (type, event) => {
    if (!event.nativeEvent.locationX || !event.nativeEvent.locationY) {
      return;
    }
    const dateIsoString = (0, _utils.convertPositionToISOString)(event.nativeEvent.locationX, event.nativeEvent.locationY, startDate, heightByTimeInterval.value, columnWidth);
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
    return /*#__PURE__*/_react.default.createElement(_EventBlock.default, {
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
    const dateByColumn = _momentTimezone.default.tz(startDate, tzOffset).add(dayIndex, 'd');
    const dateStr = dateByColumn.format('YYYY-MM-DD');
    const isToday = dateStr === currentDate;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: dayIndex
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      pointerEvents: "box-none",
      style: styles.eventsContainer
    }, (_eventsByColumns$dayI = eventsByColumns[dayIndex]) === null || _eventsByColumns$dayI === void 0 ? void 0 : _eventsByColumns$dayI.map(event => _renderEvent(event, dayIndex))), showNowIndicator && isToday && /*#__PURE__*/_react.default.createElement(_NowIndicator.default, {
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      width: viewMode === 'day' ? timelineWidth : rightSideWidth
    }]
  }, viewMode === 'day' && /*#__PURE__*/_react.default.createElement(_TimelineHours.default, null), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [{
      width: rightSideWidth,
      marginTop: spaceFromTop
    }, boardStyle]
  }, /*#__PURE__*/_react.default.createElement(_TimelineBoard.default, {
    startDate: startDate,
    onPressBackgroundHandler: _onPressBackgroundHandler,
    holidays: holidays,
    renderCustomUnavailableItem: renderCustomUnavailableItem,
    renderHalfLineCustom: renderHalfLineCustom,
    halfLineContainerStyle: halfLineContainerStyle
  }), (0, _times.default)(_constants.COLUMNS[viewMode], _renderTimelineColumn)), isLoading && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.loadingFrame
  }));
};
var _default = TimelinePage;
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  loadingFrame: {
    ..._reactNative.StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0)'
  },
  eventsContainer: {
    ..._reactNative.StyleSheet.absoluteFillObject,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=TimelinePage.js.map