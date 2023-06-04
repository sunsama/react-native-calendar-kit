import moment from 'moment-timezone';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle } from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
const DragCreateItem = _ref => {
  let {
    offsetX,
    offsetY,
    currentHour
  } = _ref;
  const {
    columnWidth,
    hourWidth,
    heightByTimeInterval,
    dragCreateInterval,
    theme,
    hourFormat
  } = useTimelineCalendarContext();
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: dragCreateInterval / 60 * heightByTimeInterval.value,
      transform: [{
        translateX: offsetX.value
      }, {
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: "none"
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.defaultStyle, {
      left: hourWidth,
      backgroundColor: theme.dragCreateItemBackgroundColor,
      width: columnWidth
    }, animatedStyles]
  }), /*#__PURE__*/React.createElement(AnimatedHour, {
    currentHour: currentHour,
    offsetY: offsetY,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }));
};
export default DragCreateItem;
const AnimatedHour = _ref2 => {
  let {
    currentHour,
    offsetY,
    hourWidth,
    theme,
    hourFormat
  } = _ref2;
  const [time, setTime] = useState('');
  const _onChangedTime = (hourStr, minutesStr) => {
    let newTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newTime = moment(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setTime(newTime);
  };
  useAnimatedReaction(() => currentHour.value, hour => {
    let extra = 0;
    if (hour < 0) {
      extra = 24;
    } else if (hour >= 24) {
      extra = -24;
    }
    const convertedTime = hour + extra;
    const rHours = Math.floor(convertedTime);
    const minutes = (convertedTime - rHours) * 60;
    const rMinutes = Math.round(minutes);
    const offset = rHours < 0 ? 24 : 0;
    const hourStr = rHours + offset < 10 ? '0' + rHours : rHours + offset;
    const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
    runOnJS(_onChangedTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: offsetY.value
      }]
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/React.createElement(Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, time));
};
const styles = StyleSheet.create({
  defaultStyle: {
    position: 'absolute',
    borderRadius: 4,
    top: 0,
    left: 0
  },
  hourContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4,
    borderColor: DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR
  },
  hourText: {
    color: DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  }
});
//# sourceMappingURL=DragCreateItem.js.map