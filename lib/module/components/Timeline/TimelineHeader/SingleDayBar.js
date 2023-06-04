import moment from 'moment-timezone';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_PROPS } from '../../../constants';
import { getDayBarStyle } from '../../../utils';
const SingleDayBar = _ref => {
  let {
    width,
    startDate,
    theme,
    locale,
    highlightDates,
    onPressDayNum,
    currentDate,
    tzOffset
  } = _ref;
  const _renderDay = () => {
    const dateByIndex = moment.tz(startDate, tzOffset);
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const [dayNameText, dayNum] = dateByIndex.locale(locale).format('ddd,DD').split(',');
    const highlightDate = highlightDates === null || highlightDates === void 0 ? void 0 : highlightDates[dateStr];
    const {
      dayName,
      dayNumber,
      dayNumberContainer
    } = getDayBarStyle(currentDate, dateByIndex, theme, highlightDate);
    return /*#__PURE__*/React.createElement(View, {
      style: styles.dayItem
    }, /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayName, dayName]
    }, dayNameText), /*#__PURE__*/React.createElement(TouchableOpacity, {
      activeOpacity: 0.6,
      disabled: !onPressDayNum,
      onPress: () => onPressDayNum === null || onPressDayNum === void 0 ? void 0 : onPressDayNum(dateStr),
      style: [styles.dayNumBtn, dayNumberContainer]
    }, /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      style: [styles.dayNumber, dayNumber]
    }, dayNum)));
  };
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, {
      width,
      height: DEFAULT_PROPS.DAY_BAR_HEIGHT
    }]
  }, _renderDay());
};
export default SingleDayBar;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  dayItem: {
    alignItems: 'center',
    flex: 1
  },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginTop: 2,
    width: 28,
    height: 28,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR
  },
  dayName: {
    color: DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 12
  },
  dayNumber: {
    color: DEFAULT_PROPS.SECONDARY_COLOR,
    fontSize: 16
  }
});
//# sourceMappingURL=SingleDayBar.js.map