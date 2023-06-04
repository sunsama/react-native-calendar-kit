"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = require("react");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _TimelineProvider = require("../context/TimelineProvider");
var _utils = require("../utils");
var _useTimelineScroll = _interopRequireDefault(require("./useTimelineScroll"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const useDragCreateGesture = _ref => {
  let {
    onDragCreateEnd
  } = _ref;
  const {
    timeIntervalHeight,
    spaceFromTop,
    spaceFromBottom,
    offsetY,
    timelineLayoutRef,
    isScrolling,
    currentIndex,
    minDate,
    maxDate,
    pages,
    hourWidth,
    columnWidth,
    timelineWidth,
    totalHours,
    dragCreateInterval,
    dragStep,
    viewMode,
    isDragCreateActive,
    useHaptic,
    tzOffset,
    start,
    navigateDelay,
    heightByTimeInterval
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = (0, _useTimelineScroll.default)();
  const [isDraggingCreate, setIsDraggingCreate] = (0, _react.useState)(false);
  const currentHour = (0, _reactNativeReanimated.useSharedValue)(0);
  const dragXPosition = (0, _reactNativeReanimated.useSharedValue)(0);
  const dragYPosition = (0, _reactNativeReanimated.useSharedValue)(0);
  const startOffsetY = (0, _react.useRef)(0);
  const calcPosition = (xPosition, yPosition, nearestMinutes) => {
    'worklet';

    const positionIndex = Math.floor((xPosition - hourWidth) / columnWidth);
    const calcX = positionIndex * columnWidth;
    const startY = yPosition + offsetY.value - spaceFromTop;
    const subtractHour = dragCreateInterval / 60 * heightByTimeInterval.value;
    const originalTime = (startY - subtractHour) / heightByTimeInterval.value;
    const roundedHour = (0, _utils.roundTo)(originalTime, nearestMinutes, 'up');
    const calcY = roundedHour * heightByTimeInterval.value;
    currentHour.value = roundedHour + start;
    return {
      x: Math.max(0, calcX),
      y: calcY + spaceFromTop - offsetY.value
    };
  };
  const timeoutRef = (0, _react.useRef)(null);
  const _handleScroll = x => {
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
    const scrollTargetDiff = Math.abs(startOffsetY.current - offsetY.value);
    const scrollInProgress = scrollTargetDiff > 3;
    if (scrollInProgress) {
      return;
    }
    const startY = dragYPosition.value - spaceFromTop;
    if (startY < 3 && offsetY.value > 0) {
      const targetOffset = Math.max(0, offsetY.value - timeIntervalHeight.value * 3);
      startOffsetY.current = targetOffset;
      goToOffsetY(targetOffset);
    }
    const subtractHour = dragCreateInterval / 60 * timeIntervalHeight.value;
    const yInPage = dragYPosition.value + subtractHour + spaceFromTop;
    const pageSize = timelineLayoutRef.current.height;
    const currentY = startY + offsetY.value + subtractHour;
    const timelineHeight = totalHours * timeIntervalHeight.value;
    if (yInPage > pageSize - 3 && currentY < timelineHeight) {
      const spacingInBottomAndTop = spaceFromTop + spaceFromBottom;
      const maxOffsetY = timelineHeight + spacingInBottomAndTop - pageSize;
      const nextOffset = offsetY.value + timeIntervalHeight.value * 3;
      const targetOffset = Math.min(maxOffsetY, nextOffset);
      startOffsetY.current = targetOffset;
      goToOffsetY(targetOffset);
    }
  };
  const _onEnd = event => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
    const time = event.y / heightByTimeInterval.value;
    const positionIndex = Math.round(event.x / columnWidth);
    const startDate = pages[viewMode].data[currentIndex.value];
    const eventStart = _momentTimezone.default.tz(startDate, tzOffset).add(positionIndex, 'd').add(time, 'h').add(start, 'h');
    const isBeforeMinDate = eventStart.isBefore((0, _momentTimezone.default)(minDate), 'd');
    const isAfterMaxDate = eventStart.isAfter((0, _momentTimezone.default)(maxDate), 'd');
    if (isBeforeMinDate || isAfterMaxDate) {
      return;
    }
    const eventEnd = eventStart.clone().add(dragCreateInterval, 'm');
    onDragCreateEnd === null || onDragCreateEnd === void 0 ? void 0 : onDragCreateEnd({
      start: eventStart.toISOString(),
      end: eventEnd.toISOString()
    });
  };
  const gestureEvent = (0, _reactNativeReanimated.useSharedValue)(undefined);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => gestureEvent.value, event => {
    if (!event) {
      return;
    }
    const {
      x,
      y
    } = calcPosition(event.x, event.y, dragStep);
    if (dragXPosition.value !== x || dragYPosition.value !== y) {
      dragXPosition.value = (0, _reactNativeReanimated.withTiming)(x, {
        duration: 100,
        easing: _reactNativeReanimated.Easing.linear
      });
      dragYPosition.value = y;
      if (useHaptic) {
        (0, _reactNativeReanimated.runOnJS)(_utils.triggerHaptic)();
      }
    }
    (0, _reactNativeReanimated.runOnJS)(_handleScroll)(event.x);
  });
  const isTouchesUp = (0, _reactNativeReanimated.useSharedValue)(false);
  const dragCreateGesture = _reactNativeGestureHandler.Gesture.Pan().minPointers(1).manualActivation(true).onTouchesDown((event, stateManager) => {
    if (event.numberOfTouches > 1) {
      stateManager.fail();
      isDragCreateActive.value = false;
    }
  }).onTouchesMove((_e, stateManager) => {
    if (isDragCreateActive.value) {
      stateManager.activate();
    }
  }).onUpdate(event => {
    if (event.numberOfPointers > 1) {
      return;
    }
    gestureEvent.value = event;
  }).onTouchesUp(() => {
    if (isDragCreateActive.value) {
      isTouchesUp.value = true;
      isDragCreateActive.value = false;
    }
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => isTouchesUp.value, touchesUp => {
    if (touchesUp) {
      (0, _reactNativeReanimated.runOnJS)(_onEnd)({
        x: dragXPosition.value,
        y: dragYPosition.value + offsetY.value - spaceFromTop
      });
      gestureEvent.value = undefined;
      isTouchesUp.value = false;
    }
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => isDragCreateActive.value, active => {
    (0, _reactNativeReanimated.runOnJS)(setIsDraggingCreate)(active);
  });
  const onLongPress = e => {
    isDragCreateActive.value = true;
    const posX = e.nativeEvent.locationX + hourWidth;
    const posY = e.nativeEvent.locationY + spaceFromTop - offsetY.value;
    const {
      x,
      y
    } = calcPosition(posX, posY, dragStep);
    dragXPosition.value = x;
    dragYPosition.value = y;
    startOffsetY.current = offsetY.value;
    if (useHaptic) {
      (0, _utils.triggerHaptic)();
    }
  };
  return {
    dragCreateGesture,
    dragXPosition,
    dragYPosition,
    isDraggingCreate,
    currentHour,
    onLongPress
  };
};
var _default = useDragCreateGesture;
exports.default = _default;
//# sourceMappingURL=useDragCreateGesture.js.map