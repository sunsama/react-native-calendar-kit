"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getCurrentMinutes = tzOffset => {
  const now = _momentTimezone.default.tz(tzOffset);
  const date = now.format('YYYY-MM-DD');
  const minutes = now.hour() * 60 + now.minute();
  return {
    date,
    minutes
  };
};
const NowIndicator = _ref => {
  let {
    width,
    dayIndex,
    timeIntervalHeight,
    nowIndicatorColor,
    tzOffset,
    start,
    updateCurrentDate,
    nowIndicatorInterval
  } = _ref;
  const initial = (0, _react.useRef)(getCurrentMinutes(tzOffset));
  const translateY = (0, _reactNativeReanimated.useSharedValue)(0);
  const intervalCallbackId = (0, _react.useRef)(null);
  const prevMinutes = (0, _react.useRef)(initial.current.minutes);
  const updateLinePosition = (0, _react.useCallback)(() => {
    const {
      date,
      minutes
    } = getCurrentMinutes(tzOffset);
    if (prevMinutes.current === minutes) {
      return;
    }
    if (initial.current.date !== date) {
      updateCurrentDate();
      return;
    }
    prevMinutes.current = minutes;
    const subtractInitialMinutes = minutes - initial.current.minutes;
    const newY = subtractInitialMinutes / 60 * timeIntervalHeight.value;
    translateY.value = (0, _reactNativeReanimated.withTiming)(newY, {
      duration: 500
    });
  }, [tzOffset, timeIntervalHeight.value, translateY, updateCurrentDate]);
  (0, _react.useEffect)(() => {
    updateLinePosition();
    if (intervalCallbackId.current) {
      clearInterval(intervalCallbackId.current);
    }
    intervalCallbackId.current = setInterval(updateLinePosition, nowIndicatorInterval);
    return () => {
      if (intervalCallbackId.current) {
        clearInterval(intervalCallbackId.current);
      }
    };
  }, [nowIndicatorInterval, updateLinePosition]);
  const animStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: (initial.current.minutes / 60 - start) * timeIntervalHeight.value,
      transform: [{
        translateY: translateY.value
      }]
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, {
      left: dayIndex * width
    }, animStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.line, {
      width,
      backgroundColor: nowIndicatorColor
    }]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dot, {
      backgroundColor: nowIndicatorColor
    }]
  }));
};
var _default = /*#__PURE__*/(0, _react.memo)(NowIndicator);
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center'
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#007aff'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007aff',
    position: 'absolute',
    left: -4
  }
});
//# sourceMappingURL=NowIndicator.js.map