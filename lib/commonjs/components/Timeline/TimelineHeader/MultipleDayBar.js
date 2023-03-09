"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _times = _interopRequireDefault(require("lodash/times"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _constants = require("../../../constants");
var _utils = require("../../../utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MultipleDayBar = _ref => {
  let {
    width,
    columnWidth,
    viewMode,
    startDate,
    onPressDayNum,
    theme,
    locale,
    highlightDates,
    currentDate,
    tzOffset
  } = _ref;
  const _renderDay = dayIndex => {
    const dateByIndex = _momentTimezone.default.tz(startDate, tzOffset).add(dayIndex, 'd');
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const [dayNameText, dayNum] = dateByIndex.locale(locale).format('ddd,DD').split(',');
    const highlightDate = highlightDates === null || highlightDates === void 0 ? void 0 : highlightDates[dateStr];
    const {
      dayName,
      dayNumber,
      dayNumberContainer
    } = (0, _utils.getDayBarStyle)(currentDate, dateByIndex, theme, highlightDate);
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: `${startDate}_${dayIndex}`,
      style: [styles.dayItem, {
        width: columnWidth
      }]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayName, dayName]
    }, dayNameText), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
      activeOpacity: 0.6,
      disabled: !onPressDayNum,
      onPress: () => onPressDayNum === null || onPressDayNum === void 0 ? void 0 : onPressDayNum(dateStr),
      style: [styles.dayNumBtn, dayNumberContainer]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayNumber, dayNumber]
    }, dayNum)));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      width,
      height: _constants.DEFAULT_PROPS.DAY_BAR_HEIGHT
    }]
  }, (0, _times.default)(_constants.COLUMNS[viewMode]).map(_renderDay));
};
var _default = MultipleDayBar;
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dayItem: {
    alignItems: 'center'
  },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderRadius: 14,
    width: 28,
    height: 28,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR
  },
  dayName: {
    color: _constants.DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 12
  },
  dayNumber: {
    color: _constants.DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 16
  }
});
//# sourceMappingURL=MultipleDayBar.js.map