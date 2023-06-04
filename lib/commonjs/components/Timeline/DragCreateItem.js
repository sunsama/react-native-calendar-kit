"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _TimelineProvider = require("../../context/TimelineProvider");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DragCreateItem = _ref => {
  let {
    offsetX,
    offsetY,
    currentHour
  } = _ref;
  const {
    columnWidth,
    hourWidth,
    heightByTimeInterval,
    dragCreateInterval,
    theme,
    hourFormat
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const animatedStyles = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      height: dragCreateInterval / 60 * heightByTimeInterval.value,
      transform: [{
        translateX: offsetX.value
      }, {
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    pointerEvents: "none"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.defaultStyle, {
      left: hourWidth,
      backgroundColor: theme.dragCreateItemBackgroundColor,
      width: columnWidth
    }, animatedStyles]
  }), /*#__PURE__*/_react.default.createElement(AnimatedHour, {
    currentHour: currentHour,
    offsetY: offsetY,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }));
};
var _default = DragCreateItem;
exports.default = _default;
const AnimatedHour = _ref2 => {
  let {
    currentHour,
    offsetY,
    hourWidth,
    theme,
    hourFormat
  } = _ref2;
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
      transform: [{
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, time));
};
const styles = _reactNative.StyleSheet.create({
  defaultStyle: {
    position: 'absolute',
    borderRadius: 4,
    top: 0,
    left: 0
  },
  hourContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4,
    borderColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR
  },
  hourText: {
    color: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  }
});
//# sourceMappingURL=DragCreateItem.js.map