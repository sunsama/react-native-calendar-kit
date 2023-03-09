import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
import UnavailableHourItem from './UnavailableHourItem';
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
  } = useTimelineCalendarContext();
  const _renderUnavailableHour = (hour, i) => {
    const startFixed = Math.max(hour.start, start);
    const endFixed = Math.min(hour.end, end);
    return /*#__PURE__*/React.createElement(UnavailableHourItem, {
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
        return /*#__PURE__*/React.createElement(UnavailableHourItem, {
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
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "box-none",
    style: [styles.verticalBlock, {
      left: columnWidth * dayIndex,
      width: columnWidth
    }]
  }, _renderUnavailableHours(), /*#__PURE__*/React.createElement(View, {
    style: [styles.verticalLine, {
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
export default /*#__PURE__*/memo(VerticalBlock);
const styles = StyleSheet.create({
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