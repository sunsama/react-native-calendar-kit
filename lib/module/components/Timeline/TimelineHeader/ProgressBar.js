import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
const DEVICE_WIDTH = Dimensions.get('window').width;
const ProgressBar = _ref => {
  let {
    barColor
  } = _ref;
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(progress, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    })).start();
  }, [progress]);
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DEVICE_WIDTH, DEVICE_WIDTH]
  });
  return /*#__PURE__*/React.createElement(View, {
    style: styles.progressBar
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.bgLoading, {
      backgroundColor: barColor
    }]
  }), /*#__PURE__*/React.createElement(Animated.View, {
    style: [{
      transform: [{
        translateX
      }]
    }]
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.loadingBar, {
      backgroundColor: barColor
    }]
  })));
};
export default ProgressBar;
const styles = StyleSheet.create({
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