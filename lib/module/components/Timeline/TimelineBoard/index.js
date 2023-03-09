import times from 'lodash/times';
import moment from 'moment-timezone';
import React, { memo, useMemo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { COLUMNS, SECONDS_IN_DAY } from '../../../constants';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
import HorizontalLine from './HorizontalLine';
import UnavailableMultipleDays from './UnavailableMultipleDays';
import VerticalBlock from './VerticalBlock';
import VerticalLine from './VerticalLine';
const TimelineBoard = _ref => {
  let {
    holidays,
    startDate,
    onPressBackgroundHandler,
    renderCustomUnavailableItem,
    renderHalfLineCustom,
    halfLineContainerStyle
  } = _ref;
  const {
    hours,
    viewMode,
    isShowHalfLine,
    unavailableHours,
    minDate,
    maxDate
  } = useTimelineCalendarContext();
  const _renderHorizontalLine = (_ref2, index) => {
    let {
      hourNumber
    } = _ref2;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: `line_${hourNumber}`
    }, /*#__PURE__*/React.createElement(HorizontalLine, {
      hourIndex: index
    }), isShowHalfLine && /*#__PURE__*/React.createElement(HorizontalLine, {
      hourIndex: index + 0.5,
      renderHalfLineCustom: renderHalfLineCustom,
      containerStyle: halfLineContainerStyle
    }), index === hours.length - 1 && /*#__PURE__*/React.createElement(HorizontalLine, {
      hourIndex: index + 1
    }));
  };
  const minDayUnix = useMemo(() => moment(minDate).unix(), [minDate]);
  const maxDayUnix = useMemo(() => moment(maxDate).unix(), [maxDate]);
  const startDayUnix = useMemo(() => moment(startDate).unix(), [startDate]);
  const _renderVerticalBlock = dayIndex => {
    if (!unavailableHours && !holidays) {
      return /*#__PURE__*/React.createElement(VerticalLine, {
        key: dayIndex,
        index: dayIndex
      });
    }
    const currentUnix = startDayUnix + dayIndex * SECONDS_IN_DAY;
    const isLtMin = currentUnix - minDayUnix < 0;
    const isGtMax = maxDayUnix - currentUnix < 0;
    let unavailableHour;
    if (unavailableHours) {
      if (Array.isArray(unavailableHours)) {
        unavailableHour = unavailableHours;
      } else {
        const current = moment.unix(currentUnix);
        const currentDateStr = current.format('YYYY-MM-DD');
        const currentWeekDay = current.day();
        unavailableHour = (unavailableHours === null || unavailableHours === void 0 ? void 0 : unavailableHours[currentDateStr]) || (unavailableHours === null || unavailableHours === void 0 ? void 0 : unavailableHours[currentWeekDay]);
      }
    }
    let isDayDisabled = false;
    if (holidays !== null && holidays !== void 0 && holidays.length) {
      const dateStr = moment.unix(currentUnix).format('YYYY-MM-DD');
      isDayDisabled = holidays.includes(dateStr);
    }
    return /*#__PURE__*/React.createElement(VerticalBlock, {
      key: dayIndex,
      dayIndex: dayIndex,
      isOutsideLimit: isLtMin || isGtMax,
      unavailableHour: unavailableHour,
      isDayDisabled: isDayDisabled,
      renderCustomUnavailableItem: renderCustomUnavailableItem
    });
  };
  const numOfDays = COLUMNS[viewMode];
  const _renderOutsideDateLimit = () => {
    if (numOfDays !== 1) {
      const diffDayMin = (minDayUnix - startDayUnix) / SECONDS_IN_DAY;
      const endDayUnix = startDayUnix + (numOfDays - 1) * SECONDS_IN_DAY;
      const diffDayMax = (endDayUnix - maxDayUnix) / SECONDS_IN_DAY;
      if (diffDayMin > 0 || diffDayMax > 0) {
        return /*#__PURE__*/React.createElement(UnavailableMultipleDays, {
          left: diffDayMin > 0 ? 0 : undefined,
          right: diffDayMax > 0 ? 0 : undefined,
          diffDays: diffDayMin > 0 ? diffDayMin : diffDayMax,
          renderCustomUnavailableItem: renderCustomUnavailableItem
        });
      }
    }
    return;
  };
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill
  }, _renderOutsideDateLimit(), times(numOfDays, _renderVerticalBlock), hours.map(_renderHorizontalLine), /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
    delayLongPress: 300,
    onPress: e => onPressBackgroundHandler('press', e),
    onLongPress: e => onPressBackgroundHandler('longPress', e),
    onPressOut: e => onPressBackgroundHandler('pressOut', e)
  }, /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill
  })));
};
export default /*#__PURE__*/memo(TimelineBoard);
//# sourceMappingURL=index.js.map