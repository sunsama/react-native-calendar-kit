import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
const VerticalLine = _ref => {
  let {
    index
  } = _ref;
  const {
    columnWidth,
    theme
  } = useTimelineCalendarContext();
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.verticalLine, {
      backgroundColor: theme.cellBorderColor,
      right: columnWidth * index
    }]
  });
};
export default /*#__PURE__*/memo(VerticalLine);
const styles = StyleSheet.create({
  verticalLine: {
    width: 1,
    backgroundColor: '#E8E9ED',
    position: 'absolute',
    height: '100%'
  }
});
//# sourceMappingURL=VerticalLine.js.map