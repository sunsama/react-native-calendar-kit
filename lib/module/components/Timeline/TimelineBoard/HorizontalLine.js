import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
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
  } = useTimelineCalendarContext();
  const horizontalStyle = useAnimatedStyle(() => {
    return {
      top: timeIntervalHeight.value * hourIndex
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: [styles.line, {
      width: rightSideWidth,
      backgroundColor: theme.cellBorderColor
    }, containerStyle, horizontalStyle]
  }, renderHalfLineCustom && renderHalfLineCustom(rightSideWidth));
};
export default /*#__PURE__*/memo(HorizontalLine);
const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: '#E8E9ED',
    position: 'absolute'
  }
});
//# sourceMappingURL=HorizontalLine.js.map