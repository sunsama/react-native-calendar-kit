"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const TimelineHours = () => {
  const {
    hours,
    hourWidth,
    timeIntervalHeight,
    spaceFromTop,
    theme
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const _renderHour = (hour, index) => {
    return /*#__PURE__*/_react.default.createElement(HourItem, {
      key: index,
      hour: hour,
      index: index,
      timeIntervalHeight: timeIntervalHeight,
      spaceContent: spaceFromTop,
      theme: theme
    });
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.hours, {
      width: hourWidth,
      backgroundColor: theme.backgroundColor,
      marginBottom: spaceFromTop
    }]
  }, hours.map(_renderHour), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.verticalLine, {
      top: spaceFromTop,
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
var _default = /*#__PURE__*/(0, _react.memo)(TimelineHours);
exports.default = _default;
const HourItem = _ref => {
  let {
    hour,
    index,
    timeIntervalHeight,
    spaceContent,
    theme
  } = _ref;
  const hourLabelStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: timeIntervalHeight.value * index - 6 + spaceContent
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.Text, {
    allowFontScaling: theme.allowFontScaling,
    key: `hourLabel_${hour.text}`,
    style: [styles.hourText, theme.hourText, hourLabelStyle]
  }, hour.text);
};
const styles = _reactNative.StyleSheet.create({
  hours: {
    alignItems: 'center',
    overflow: 'hidden'
  },
  hourText: {
    position: 'absolute',
    fontSize: 10,
    color: _constants.DEFAULT_PROPS.BLACK_COLOR
  },
  verticalLine: {
    width: 1,
    backgroundColor: _constants.DEFAULT_PROPS.CELL_BORDER_COLOR,
    position: 'absolute',
    right: 0,
    height: '100%'
  }
});
//# sourceMappingURL=TimelineHours.js.map