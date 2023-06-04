"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _TimelineProvider = require("../../../context/TimelineProvider");
var _UnavailableHourItem = _interopRequireDefault(require("./UnavailableHourItem"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const VerticalBlock = _ref => {
  let {
    dayIndex,
    isOutsideLimit,
    unavailableHour,
    isDayDisabled,
    renderCustomUnavailableItem
  } = _ref;
  const {
    columnWidth,
    start,
    end,
    theme
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const _renderUnavailableHour = (hour, i) => {
    const startFixed = Math.max(hour.start, start);
    const endFixed = Math.min(hour.end, end);
    return /*#__PURE__*/_react.default.createElement(_UnavailableHourItem.default, {
      key: `${dayIndex}_${i}`,
      top: startFixed - start,
      hour: endFixed - startFixed,
      renderCustomUnavailableItem: renderCustomUnavailableItem
    });
  };
  const _renderUnavailableHours = () => {
    if (!isOutsideLimit) {
      if (isDayDisabled) {
        const startFixed = Math.max(0, start);
        const endFixed = Math.min(24, end);
        return /*#__PURE__*/_react.default.createElement(_UnavailableHourItem.default, {
          top: startFixed - start,
          hour: endFixed - startFixed,
          renderCustomUnavailableItem: renderCustomUnavailableItem
        });
      }
      if (unavailableHour) {
        return unavailableHour.map(_renderUnavailableHour);
      }
    }
    return;
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: "box-none",
    style: [styles.verticalBlock, {
      left: columnWidth * dayIndex,
      width: columnWidth
    }]
  }, _renderUnavailableHours(), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.verticalLine, {
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
var _default = /*#__PURE__*/(0, _react.memo)(VerticalBlock);
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  verticalBlock: {
    position: 'absolute',
    height: '100%'
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#E8E9ED',
    position: 'absolute',
    height: '100%',
    right: 0
  }
});
//# sourceMappingURL=VerticalBlock.js.map