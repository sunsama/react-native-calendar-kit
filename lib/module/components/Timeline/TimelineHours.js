import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
const TimelineHours = () => {
  const {
    hours,
    hourWidth,
    timeIntervalHeight,
    spaceFromTop,
    theme
  } = useTimelineCalendarContext();
  const _renderHour = (hour, index) => {
    return /*#__PURE__*/React.createElement(HourItem, {
      key: index,
      hour: hour,
      index: index,
      timeIntervalHeight: timeIntervalHeight,
      spaceContent: spaceFromTop,
      theme: theme
    });
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.hours, {
      width: hourWidth,
      backgroundColor: theme.backgroundColor,
      marginBottom: spaceFromTop
    }]
  }, hours.map(_renderHour), /*#__PURE__*/React.createElement(View, {
    style: [styles.verticalLine, {
      top: spaceFromTop,
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
export default /*#__PURE__*/memo(TimelineHours);
const HourItem = _ref => {
  let {
    hour,
    index,
    timeIntervalHeight,
    spaceContent,
    theme
  } = _ref;
  const hourLabelStyle = useAnimatedStyle(() => {
    return {
      top: timeIntervalHeight.value * index - 6 + spaceContent
    };
  });
  return /*#__PURE__*/React.createElement(Animated.Text, {
    allowFontScaling: theme.allowFontScaling,
    key: `hourLabel_${hour.text}`,
    style: [styles.hourText, theme.hourText, hourLabelStyle]
  }, hour.text);
};
const styles = StyleSheet.create({
  hours: {
    alignItems: 'center',
    overflow: 'hidden'
  },
  hourText: {
    position: 'absolute',
    fontSize: 10,
    color: DEFAULT_PROPS.BLACK_COLOR
  },
  verticalLine: {
    width: 1,
    backgroundColor: DEFAULT_PROPS.CELL_BORDER_COLOR,
    position: 'absolute',
    right: 0,
    height: '100%'
  }
});
//# sourceMappingURL=TimelineHours.js.map