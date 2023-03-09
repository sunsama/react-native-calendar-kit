"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _TimelineProvider = require("../../../context/TimelineProvider");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const HorizontalLine = _ref => {
  let {
    hourIndex,
    renderHalfLineCustom,
    containerStyle
  } = _ref;
  const {
    timeIntervalHeight,
    theme,
    rightSideWidth
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const horizontalStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: timeIntervalHeight.value * hourIndex
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.line, {
      width: rightSideWidth,
      backgroundColor: theme.cellBorderColor
    }, containerStyle, horizontalStyle]
  }, renderHalfLineCustom && renderHalfLineCustom(rightSideWidth));
};
var _default = /*#__PURE__*/(0, _react.memo)(HorizontalLine);
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: '#E8E9ED',
    position: 'absolute'
  }
});
//# sourceMappingURL=HorizontalLine.js.map