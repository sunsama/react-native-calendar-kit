"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _TimelineProvider = require("../context/TimelineProvider");
var _utils = require("../utils");
var _useTimelineScroll = _interopRequireDefault(require("./useTimelineScroll"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const useZoomGesture = _ref => {
  let {
    enabled
  } = _ref;
  const {
    timeIntervalHeight,
    maxTimeIntervalHeight,
    minTimeIntervalHeight,
    isDragCreateActive,
    offsetY,
    pinchRef,
    isPinchActive,
    spaceFromTop
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const {
    goToOffsetY
  } = (0, _useTimelineScroll.default)();
  const focalY = (0, _reactNativeReanimated.useSharedValue)(0);
  const _handleScrollView = (currentHeight, prevHeight) => {
    const pinchYNormalized = (focalY.value + offsetY.value + spaceFromTop) / prevHeight;
    const pinchYScale = currentHeight * pinchYNormalized;
    const y = pinchYScale - focalY.value;
    goToOffsetY(y, false);
  };
  (0, _reactNativeReanimated.useAnimatedReaction)(() => timeIntervalHeight.value, (current, prev) => {
    if (!isPinchActive.value || !prev || current === prev) {
      return;
    }
    (0, _reactNativeReanimated.runOnJS)(_handleScrollView)(current, prev);
  });
  const startHeight = (0, _reactNativeReanimated.useSharedValue)(timeIntervalHeight.value);
  const zoomGesture = _reactNativeGestureHandler.Gesture.Pinch().enabled(enabled).onStart(() => {
    isPinchActive.value = true;
    startHeight.value = timeIntervalHeight.value;
  }).onUpdate(event => {
    if (isDragCreateActive.value) {
      return;
    }
    const newHeight = startHeight.value * event.scale;
    const clampedHeight = (0, _utils.clampValues)(newHeight, minTimeIntervalHeight.value - 2, maxTimeIntervalHeight + 5);
    focalY.value = event.focalY;
    timeIntervalHeight.value = clampedHeight;
  }).onEnd(() => {
    const clampedHeight = (0, _utils.clampValues)(timeIntervalHeight.value, minTimeIntervalHeight.value, maxTimeIntervalHeight);
    timeIntervalHeight.value = (0, _reactNativeReanimated.withTiming)(clampedHeight, undefined, () => {
      isPinchActive.value = false;
    });
  }).withRef(pinchRef);
  return {
    zoomGesture
  };
};
var _default = useZoomGesture;
exports.default = _default;
//# sourceMappingURL=usePinchGesture.js.map