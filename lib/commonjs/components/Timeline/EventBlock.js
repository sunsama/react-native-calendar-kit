"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _utils = require("../../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EVENT_DEFAULT_COLOR = '#FFFFFF';
const EventBlock = _ref => {
  let {
    event,
    dayIndex,
    columnWidth,
    onPressEvent,
    onLongPressEvent,
    renderEventContent,
    theme,
    selectedEventId,
    eventAnimatedDuration,
    isPinchActive,
    timeIntervalHeight,
    heightByTimeInterval
  } = _ref;
  const _onLongPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex
    };
    onLongPressEvent === null || onLongPressEvent === void 0 ? void 0 : onLongPressEvent(eventParams);
  };
  const _onPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex
    };
    onPressEvent === null || onPressEvent === void 0 ? void 0 : onPressEvent(eventParams);
  };
  const eventStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    let eventHeight = event.duration * heightByTimeInterval.value;
    if (theme.minimumEventHeight) {
      eventHeight = Math.max(theme.minimumEventHeight, eventHeight);
    }
    if (isPinchActive.value) {
      return {
        top: event.startHour * heightByTimeInterval.value,
        height: eventHeight,
        left: event.left + columnWidth * dayIndex,
        width: event.width
      };
    }
    return {
      top: (0, _reactNativeReanimated.withTiming)(event.startHour * heightByTimeInterval.value, {
        duration: eventAnimatedDuration
      }),
      height: (0, _reactNativeReanimated.withTiming)(eventHeight, {
        duration: eventAnimatedDuration
      }),
      left: (0, _reactNativeReanimated.withTiming)(event.left + columnWidth * dayIndex, {
        duration: eventAnimatedDuration
      }),
      width: (0, _reactNativeReanimated.withTiming)(event.width, {
        duration: eventAnimatedDuration
      })
    };
  }, [event]);
  const _renderEventContent = () => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.title, theme.eventTitle]
    }, event.title);
  };
  const eventOpacity = selectedEventId ? 0.5 : 1;
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.eventBlock, {
      opacity: eventOpacity
    }, event.containerStyle, eventStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    disabled: !!selectedEventId,
    delayLongPress: 300,
    onPress: _onPress,
    onLongPress: _onLongPress,
    style: [_reactNative.StyleSheet.absoluteFill, {
      backgroundColor: event.color || EVENT_DEFAULT_COLOR
    }],
    activeOpacity: 0.6
  }, renderEventContent ? renderEventContent(event, timeIntervalHeight) : _renderEventContent()));
};
const areEqual = (prev, next) => {
  const {
    event: prevEvent,
    theme: prevTheme,
    ...prevOther
  } = prev;
  const {
    event: nextEvent,
    theme: nextTheme,
    ...nextOther
  } = next;
  const isSameEvent = (0, _isEqual.default)(prevEvent, nextEvent);
  const isSameTheme = (0, _isEqual.default)(prevTheme, nextTheme);
  const isSameOther = (0, _utils.shallowEqual)(prevOther, nextOther);
  return isSameEvent && isSameTheme && isSameOther;
};
var _default = /*#__PURE__*/(0, _react.memo)(EventBlock, areEqual);
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  eventBlock: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden'
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 10,
    color: _constants.DEFAULT_PROPS.BLACK_COLOR
  }
});
//# sourceMappingURL=EventBlock.js.map