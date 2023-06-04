"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
var _useTimelineScroll = _interopRequireDefault(require("../../hooks/useTimelineScroll"));
var _utils = require("../../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EVENT_DEFAULT_COLOR = '#FFFFFF';
const DragEditItem = _ref => {
  let {
    selectedEvent,
    onEndDragSelectedEvent,
    renderEventContent,
    isEnabled = true,
    EditIndicatorComponent
  } = _ref;
  const {
    columnWidth,
    hourWidth,
    offsetY,
    dragStep,
    pages,
    currentIndex,
    isScrolling,
    timelineWidth,
    rightEdgeSpacing,
    spaceFromTop,
    timeIntervalHeight,
    heightByTimeInterval,
    viewMode,
    spaceFromBottom,
    timelineLayoutRef,
    totalHours,
    theme,
    hourFormat,
    useHaptic,
    tzOffset,
    start,
    navigateDelay
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = (0, _useTimelineScroll.default)();
  const event = (0, _react.useRef)(selectedEvent).current;
  const leftWithHourColumn = event.leftByIndex + hourWidth;
  const defaultTopPosition = event.top + spaceFromTop;
  const eventWidth = (0, _reactNativeReanimated.useSharedValue)(event.width);
  const eventLeft = (0, _reactNativeReanimated.useSharedValue)(leftWithHourColumn + event.left);
  const currentHour = (0, _reactNativeReanimated.useSharedValue)(event.top / heightByTimeInterval.value + start);
  const startOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const startXY = (0, _reactNativeReanimated.useSharedValue)({
    x: 0,
    y: 0
  });
  const translateX = (0, _reactNativeReanimated.useSharedValue)(0);
  const eventTop = (0, _reactNativeReanimated.useSharedValue)(defaultTopPosition);
  const eventHeight = (0, _reactNativeReanimated.useSharedValue)(theme.minimumEventHeight ? Math.max(theme.minimumEventHeight, event.height) : event.height);
  (0, _react.useEffect)(() => {
    if (useHaptic) {
      (0, _utils.triggerHaptic)();
    }
  }, [useHaptic]);
  (0, _react.useEffect)(() => {
    requestAnimationFrame(() => {
      eventWidth.value = (0, _reactNativeReanimated.withTiming)(columnWidth - rightEdgeSpacing, {
        duration: 100
      });
      eventLeft.value = (0, _reactNativeReanimated.withTiming)(leftWithHourColumn, {
        duration: 100
      });
    });
  }, [columnWidth, eventLeft, eventWidth, leftWithHourColumn, rightEdgeSpacing]);
  const timeoutRef = (0, _react.useRef)(null);
  const _handleScroll = _ref2 => {
    let {
      x,
      y,
      type
    } = _ref2;
    if (timeoutRef.current && x > hourWidth && x < timelineWidth - 25) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (x <= hourWidth) {
      if (isScrolling.current || timeoutRef.current) {
        return;
      }
      timeoutRef.current = setInterval(() => {
        goToPrevPage(true);
      }, navigateDelay);
    }
    if (x >= timelineWidth - 25) {
      if (isScrolling.current || timeoutRef.current) {
        return;
      }
      timeoutRef.current = setInterval(() => {
        goToNextPage(true);
      }, navigateDelay);
    }
    const scrollTargetDiff = Math.abs(startOffsetY.value - offsetY.value);
    const scrollInProgress = scrollTargetDiff > 3;
    if (scrollInProgress) {
      return;
    }
    const startY = y + timeIntervalHeight.value;
    if (startY < 3 && offsetY.value > 0 && type === 'swipe_up') {
      const targetOffset = Math.max(0, offsetY.value - timeIntervalHeight.value * 3);
      startOffsetY.value = targetOffset;
      goToOffsetY(targetOffset);
    }
    const pageSize = timelineLayoutRef.current.height;
    const scrollPosition = y + eventHeight.value - timeIntervalHeight.value;
    if (scrollPosition > pageSize - 3 && type === 'swipe_down') {
      const spacingInBottomAndTop = spaceFromTop + spaceFromBottom;
      const timelineHeight = totalHours * timeIntervalHeight.value;
      const maxOffsetY = timelineHeight + spacingInBottomAndTop - pageSize;
      const nextOffset = offsetY.value + timeIntervalHeight.value * 3;
      const targetOffset = Math.min(maxOffsetY, nextOffset);
      startOffsetY.value = targetOffset;
      goToOffsetY(targetOffset);
    }
  };
  const recalculateEvent = () => {
    const newLeftPosition = event.leftByIndex + translateX.value;
    const dayIndex = Math.round(newLeftPosition / columnWidth);
    const startDate = pages[viewMode].data[currentIndex.value];
    const currentDateMoment = _momentTimezone.default.tz(startDate, tzOffset).add(dayIndex, 'd').add(currentHour.value, 'h');
    const newEvent = {
      ...selectedEvent,
      left: newLeftPosition,
      top: eventTop.value,
      height: eventHeight.value,
      start: currentDateMoment.toISOString(),
      end: currentDateMoment.clone().add(eventHeight.value / heightByTimeInterval.value, 'h').toISOString()
    };
    if (onEndDragSelectedEvent) {
      onEndDragSelectedEvent(newEvent);
    }
  };
  const clearCurrentInterval = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const dragPositionGesture = _reactNativeGestureHandler.Gesture.Pan().enabled(isEnabled).runOnJS(true).maxPointers(1).onStart(() => {
    startOffsetY.value = offsetY.value;
    startXY.value = {
      x: translateX.value,
      y: eventTop.value - offsetY.value
    };
  }).onUpdate(_ref3 => {
    let {
      translationX,
      translationY,
      absoluteX
    } = _ref3;
    const initIndex = event.leftByIndex / columnWidth;
    const maxIndex = _constants.COLUMNS[viewMode] - 1;
    const minRounded = -initIndex;
    const maxRounded = maxIndex - initIndex;
    const nextTranslateX = startXY.value.x + translationX;
    const xToIndex = Math.round(nextTranslateX / columnWidth);
    const clampIndex = Math.min(Math.max(minRounded, xToIndex), maxRounded);
    const roundedTranslateX = clampIndex * columnWidth;
    const nextTranslateY = startXY.value.y + translationY;
    const offset = offsetY.value - spaceFromTop;
    const originalY = startXY.value.y + offset + translationY;
    const originalTime = originalY / heightByTimeInterval.value;
    const roundedHour = (0, _utils.roundTo)(originalTime, dragStep, 'up');
    const newTopPosition = roundedHour * heightByTimeInterval.value + spaceFromTop;
    const isSameX = translateX.value === roundedTranslateX;
    const isSameY = eventTop.value === newTopPosition;
    if (!isSameX || !isSameY) {
      translateX.value = (0, _reactNativeReanimated.withTiming)(roundedTranslateX, {
        duration: 100,
        easing: _reactNativeReanimated.Easing.linear
      });
      eventTop.value = newTopPosition;
      currentHour.value = roundedHour + start;
      if (useHaptic) {
        (0, _reactNativeReanimated.runOnJS)(_utils.triggerHaptic)();
      }
    }
    (0, _reactNativeReanimated.runOnJS)(_handleScroll)({
      x: absoluteX,
      y: nextTranslateY,
      type: nextTranslateY > startXY.value.y ? 'swipe_down' : 'swipe_up'
    });
  }).onEnd(() => {
    (0, _reactNativeReanimated.runOnJS)(recalculateEvent)();
  }).onTouchesUp(() => {
    (0, _reactNativeReanimated.runOnJS)(clearCurrentInterval)();
  });
  const startHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const dragDurationGesture = _reactNativeGestureHandler.Gesture.Pan().enabled(isEnabled).runOnJS(true).maxPointers(1).onStart(() => {
    startOffsetY.value = offsetY.value;
    startHeight.value = eventHeight.value;
  }).onUpdate(e => {
    const heightOfTenMinutes = dragStep / 60 * heightByTimeInterval.value;
    const nextHeight = startHeight.value + e.translationY;
    const roundedHeight = Math.ceil(nextHeight / heightOfTenMinutes) * heightOfTenMinutes;
    const clampedHeight = theme.minimumEventHeight ? Math.max(theme.minimumEventHeight, Math.max(roundedHeight, heightOfTenMinutes)) : Math.max(roundedHeight, heightOfTenMinutes);
    const isSameHeight = eventHeight.value === clampedHeight;
    if (!isSameHeight) {
      eventHeight.value = clampedHeight;
      if (useHaptic) {
        (0, _reactNativeReanimated.runOnJS)(_utils.triggerHaptic)();
      }
    }
  }).onEnd(() => {
    (0, _reactNativeReanimated.runOnJS)(recalculateEvent)();
  }).onTouchesUp(() => {
    (0, _reactNativeReanimated.runOnJS)(clearCurrentInterval)();
  });
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      height: eventHeight.value,
      width: eventWidth.value,
      left: eventLeft.value,
      top: eventTop.value,
      transform: [{
        translateX: translateX.value
      }]
    };
  }, []);
  const _renderEventContent = () => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [styles.title, theme.eventTitle]
    }, event.title);
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: dragPositionGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.eventContainer, {
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR,
      top: defaultTopPosition
    }, event.containerStyle, animatedStyle]
  }, renderEventContent ? renderEventContent(event, heightByTimeInterval) : _renderEventContent(), /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: dragDurationGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.indicatorContainer
  }, EditIndicatorComponent ? EditIndicatorComponent : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.indicator
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.indicatorLine, theme.editIndicatorColor ? {
      backgroundColor: theme.editIndicatorColor
    } : undefined]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.indicatorLine, theme.editIndicatorColor ? {
      backgroundColor: theme.editIndicatorColor
    } : undefined]
  })))))), /*#__PURE__*/_react.default.createElement(AnimatedHour, {
    currentHour: currentHour,
    animatedTop: eventTop,
    top: defaultTopPosition,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }));
};
var _default = /*#__PURE__*/(0, _react.memo)(DragEditItem);
exports.default = _default;
const AnimatedHour = _ref4 => {
  let {
    currentHour,
    animatedTop,
    top,
    hourWidth,
    theme,
    hourFormat
  } = _ref4;
  const [time, setTime] = (0, _react.useState)('');
  const _onChangedTime = (hourStr, minutesStr) => {
    let newTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newTime = (0, _momentTimezone.default)(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setTime(newTime);
  };
  (0, _reactNativeReanimated.useAnimatedReaction)(() => currentHour.value, hour => {
    let extra = 0;
    if (hour < 0) {
      extra = 24;
    } else if (hour >= 24) {
      extra = -24;
    }
    const convertedTime = hour + extra;
    const rHours = Math.floor(convertedTime);
    const minutes = (convertedTime - rHours) * 60;
    const rMinutes = Math.round(minutes);
    const offset = rHours < 0 ? 24 : 0;
    const hourStr = rHours + offset < 10 ? '0' + rHours : rHours + offset;
    const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
    (0, _reactNativeReanimated.runOnJS)(_onChangedTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: animatedTop.value - 6
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8,
      top: top - 6
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, time));
};
const styles = _reactNative.StyleSheet.create({
  eventContainer: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden'
  },
  badgeContainer: {
    padding: 2,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginBottom: 2
  },
  hourContainer: {
    position: 'absolute',
    borderColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  indicator: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 24
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 10,
    color: _constants.DEFAULT_PROPS.BLACK_COLOR
  },
  hourText: {
    color: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  },
  indicatorLine: {
    width: 12,
    height: 2,
    backgroundColor: '#000',
    marginBottom: 2
  }
});
//# sourceMappingURL=DragEditItem.js.map