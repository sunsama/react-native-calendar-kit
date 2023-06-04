"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const DEVICE_WIDTH = _reactNative.Dimensions.get('window').width;
const ProgressBar = _ref => {
  let {
    barColor
  } = _ref;
  const progress = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  (0, _react.useEffect)(() => {
    _reactNative.Animated.loop(_reactNative.Animated.timing(progress, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    })).start();
  }, [progress]);
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DEVICE_WIDTH, DEVICE_WIDTH]
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.progressBar
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.bgLoading, {
      backgroundColor: barColor
    }]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    style: [{
      transform: [{
        translateX
      }]
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.loadingBar, {
      backgroundColor: barColor
    }]
  })));
};
var _default = ProgressBar;
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  progressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  loadingBar: {
    width: '100%',
    height: 2
  },
  bgLoading: {
    position: 'absolute',
    width: '100%',
    height: 2,
    opacity: 0.3
  }
});
//# sourceMappingURL=ProgressBar.js.map