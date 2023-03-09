import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
const UnavailableHourItem = _ref => {
  let {
    top,
    hour,
    renderCustomUnavailableItem
  } = _ref;
  const {
    timeIntervalHeight,
    theme,
    columnWidth
  } = useTimelineCalendarContext();
  const unavailableHourStyle = useAnimatedStyle(() => {
    return {
      top: top * timeIntervalHeight.value,
      height: hour * timeIntervalHeight.value
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: [styles.unavailableHourItem, {
      backgroundColor: theme.unavailableBackgroundColor
    }, unavailableHourStyle]
  }, renderCustomUnavailableItem && renderCustomUnavailableItem({
    timeIntervalHeight: timeIntervalHeight,
    hour,
    width: columnWidth
  }));
};
export default /*#__PURE__*/memo(UnavailableHourItem);
const styles = StyleSheet.create({
  unavailableHourItem: {
    left: 0,
    width: '100%',
    position: 'absolute',
    overflow: 'hidden'
  }
});
//# sourceMappingURL=UnavailableHourItem.js.map