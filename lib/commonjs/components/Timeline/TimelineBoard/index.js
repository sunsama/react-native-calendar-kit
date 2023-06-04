"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _times = _interopRequireDefault(require("lodash/times"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _constants = require("../../../constants");
var _TimelineProvider = require("../../../context/TimelineProvider");
var _HorizontalLine = _interopRequireDefault(require("./HorizontalLine"));
var _UnavailableMultipleDays = _interopRequireDefault(require("./UnavailableMultipleDays"));
var _VerticalBlock = _interopRequireDefault(require("./VerticalBlock"));
var _VerticalLine = _interopRequireDefault(require("./VerticalLine"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TimelineBoard = _ref => {
  let {
    holidays,
    startDate,
    onPressBackgroundHandler,
    renderCustomUnavailableItem,
    renderHalfLineCustom,
    halfLineContainerStyle
  } = _ref;
  const {
    hours,
    viewMode,
    isShowHalfLine,
    unavailableHours,
    minDate,
    maxDate
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const _renderHorizontalLine = (_ref2, index) => {
    let {
      hourNumber
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
      key: `line_${hourNumber}`
    }, /*#__PURE__*/_react.default.createElement(_HorizontalLine.default, {
      hourIndex: index
    }), isShowHalfLine && /*#__PURE__*/_react.default.createElement(_HorizontalLine.default, {
      hourIndex: index + 0.5,
      renderHalfLineCustom: renderHalfLineCustom,
      containerStyle: halfLineContainerStyle
    }), index === hours.length - 1 && /*#__PURE__*/_react.default.createElement(_HorizontalLine.default, {
      hourIndex: index + 1
    }));
  };
  const minDayUnix = (0, _react.useMemo)(() => (0, _momentTimezone.default)(minDate).unix(), [minDate]);
  const maxDayUnix = (0, _react.useMemo)(() => (0, _momentTimezone.default)(maxDate).unix(), [maxDate]);
  const startDayUnix = (0, _react.useMemo)(() => (0, _momentTimezone.default)(startDate).unix(), [startDate]);
  const _renderVerticalBlock = dayIndex => {
    if (!unavailableHours && !holidays) {
      return /*#__PURE__*/_react.default.createElement(_VerticalLine.default, {
        key: dayIndex,
        index: dayIndex
      });
    }
    const currentUnix = startDayUnix + dayIndex * _constants.SECONDS_IN_DAY;
    const isLtMin = currentUnix - minDayUnix < 0;
    const isGtMax = maxDayUnix - currentUnix < 0;
    let unavailableHour;
    if (unavailableHours) {
      if (Array.isArray(unavailableHours)) {
        unavailableHour = unavailableHours;
      } else {
        const current = _momentTimezone.default.unix(currentUnix);
        const currentDateStr = current.format('YYYY-MM-DD');
        const currentWeekDay = current.day();
        unavailableHour = (unavailableHours === null || unavailableHours === void 0 ? void 0 : unavailableHours[currentDateStr]) || (unavailableHours === null || unavailableHours === void 0 ? void 0 : unavailableHours[currentWeekDay]);
      }
    }
    let isDayDisabled = false;
    if (holidays !== null && holidays !== void 0 && holidays.length) {
      const dateStr = _momentTimezone.default.unix(currentUnix).format('YYYY-MM-DD');
      isDayDisabled = holidays.includes(dateStr);
    }
    return /*#__PURE__*/_react.default.createElement(_VerticalBlock.default, {
      key: dayIndex,
      dayIndex: dayIndex,
      isOutsideLimit: isLtMin || isGtMax,
      unavailableHour: unavailableHour,
      isDayDisabled: isDayDisabled,
      renderCustomUnavailableItem: renderCustomUnavailableItem
    });
  };
  const numOfDays = _constants.COLUMNS[viewMode];
  const _renderOutsideDateLimit = () => {
    if (numOfDays !== 1) {
      const diffDayMin = (minDayUnix - startDayUnix) / _constants.SECONDS_IN_DAY;
      const endDayUnix = startDayUnix + (numOfDays - 1) * _constants.SECONDS_IN_DAY;
      const diffDayMax = (endDayUnix - maxDayUnix) / _constants.SECONDS_IN_DAY;
      if (diffDayMin > 0 || diffDayMax > 0) {
        return /*#__PURE__*/_react.default.createElement(_UnavailableMultipleDays.default, {
          left: diffDayMin > 0 ? 0 : undefined,
          right: diffDayMax > 0 ? 0 : undefined,
          diffDays: diffDayMin > 0 ? diffDayMin : diffDayMax,
          renderCustomUnavailableItem: renderCustomUnavailableItem
        });
      }
    }
    return;
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill
  }, _renderOutsideDateLimit(), (0, _times.default)(numOfDays, _renderVerticalBlock), hours.map(_renderHorizontalLine), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
    delayLongPress: 300,
    onPress: e => onPressBackgroundHandler('press', e),
    onLongPress: e => onPressBackgroundHandler('longPress', e),
    onPressOut: e => onPressBackgroundHandler('pressOut', e)
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill
  })));
};
var _default = /*#__PURE__*/(0, _react.memo)(TimelineBoard);
exports.default = _default;
//# sourceMappingURL=index.js.map