"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerHaptic = exports.shallowEqual = exports.roundTo = exports.populateEvents = exports.groupEventsByDate = exports.getTheme = exports.getDayBarStyle = exports.getCurrentDate = exports.divideEventsByColumns = exports.convertPositionToISOString = exports.clampValues = exports.calculateHours = exports.calculateDates = void 0;
var _lodash = require("lodash");
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _reactNative = require("react-native");
var _constants = require("./constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const calculateDates = (initialFirstDay, minDateStr, maxDateStr, initialDateStr, tzOffset) => {
  let day = {
      data: [],
      index: -1
    },
    week = {
      data: [],
      index: -1
    },
    threeDays = {
      data: [],
      index: -1
    },
    workWeek = {
      data: [],
      index: -1
    };
  const initialDate = _momentTimezone.default.tz(initialDateStr, tzOffset);
  const minDate = _momentTimezone.default.tz(minDateStr, tzOffset);
  const maxDate = _momentTimezone.default.tz(maxDateStr, tzOffset);
  const minDateUnix = minDate.unix();
  const maxDateUnix = maxDate.unix();
  const minWeekDay = minDate.day();
  const maxWeekDay = maxDate.day();
  const fDow = (7 + initialFirstDay) % 7;
  const diffBefore = (minWeekDay + 7 - fDow) % 7;
  const minWeekDateUnix = minDateUnix - diffBefore * _constants.SECONDS_IN_DAY;
  let minWorkWorkDateUnix = minWeekDateUnix;
  if (diffBefore === 5) {
    minWorkWorkDateUnix = minDateUnix + 2 * _constants.SECONDS_IN_DAY;
  } else if (diffBefore === 6) {
    minWorkWorkDateUnix = minDateUnix + _constants.SECONDS_IN_DAY;
  }
  const lDow = (fDow + 6) % 7;
  const diffAfter = (lDow + 7 - maxWeekDay) % 7;
  const maxWeekDateUnix = maxDateUnix + diffAfter * _constants.SECONDS_IN_DAY;
  const totalDays = (maxWeekDateUnix - minWeekDateUnix) / _constants.SECONDS_IN_DAY + 1;
  let startWorkWeekDate = minWorkWorkDateUnix,
    startWeekDate = minWeekDateUnix,
    startThreeDays = minDateUnix,
    startDay = minDateUnix;
  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const currentUnix = minWeekDateUnix + dayIndex * _constants.SECONDS_IN_DAY;
    const dateFromUnix = _momentTimezone.default.unix(currentUnix);
    const dateStr = dateFromUnix.format('YYYY-MM-DD');
    if (startDay === currentUnix) {
      if (currentUnix <= maxDateUnix) {
        day.data.push(dateStr);
      }
      startDay = currentUnix + _constants.SECONDS_IN_DAY;
    }
    if (startWorkWeekDate === currentUnix) {
      workWeek.data.push(dateStr);
      startWorkWeekDate = currentUnix + 7 * _constants.SECONDS_IN_DAY;
    }
    if (startWeekDate === currentUnix) {
      week.data.push(dateStr);
      startWeekDate = currentUnix + 7 * _constants.SECONDS_IN_DAY;
    }
    if (startThreeDays === currentUnix && startThreeDays <= maxDateUnix) {
      threeDays.data.push(dateStr);
      startThreeDays = currentUnix + 3 * _constants.SECONDS_IN_DAY;
    }
    if (dateFromUnix.isSame(initialDate, 'day')) {
      day.index = day.data.length - 1;
      threeDays.index = threeDays.data.length - 1;
      week.index = week.data.length - 1;
      workWeek.index = workWeek.data.length - 1;
    }
  }
  return {
    day,
    week,
    threeDays,
    workWeek
  };
};
exports.calculateDates = calculateDates;
const calculateHours = (start, end, step, hourFormat) => {
  const hours = [];
  let tempStart = start;
  while (tempStart < end) {
    const roundHour = Math.floor(tempStart);
    const minutes = (tempStart - roundHour) * 60;
    const rMinutes = Math.round(minutes);
    const hourStr = ('0' + roundHour).slice(-2);
    const minuteStr = ('0' + rMinutes).slice(-2);
    let time = `${hourStr}:${minuteStr}`;
    if (hourFormat) {
      time = (0, _momentTimezone.default)(`1970/1/1 ${hourStr}:${minuteStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    hours.push({
      text: time,
      hourNumber: tempStart
    });
    tempStart += step / 60;
  }
  return hours;
};
exports.calculateHours = calculateHours;
const convertPositionToISOString = (locationX, locationY, startDate, hourHeight, columnWidth, tzOffset) => {
  const dayIndex = Math.floor(locationX / columnWidth);
  const hourFromY = locationY / hourHeight;
  const dateMoment = _momentTimezone.default.tz(startDate, tzOffset).add(dayIndex, 'd').add(hourFromY, 'hour');
  return dateMoment.toISOString();
};
exports.convertPositionToISOString = convertPositionToISOString;
const groupEventsByDate = function () {
  let events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let tzOffset = arguments.length > 1 ? arguments[1] : undefined;
  let groupedEvents = {};
  events.forEach(event => {
    const startEvent = _momentTimezone.default.tz(event.start, tzOffset).startOf('d');
    const endEvent = _momentTimezone.default.tz(event.end, tzOffset).startOf('d');
    const diffDays = endEvent.diff(startEvent, 'd');
    for (let i = 0; i <= diffDays; i++) {
      const dateStr = startEvent.add(i, 'd').format('YYYY-MM-DD');
      const prevEvents = groupedEvents[dateStr] || [];
      groupedEvents[dateStr] = [...prevEvents, event];
    }
  });
  return groupedEvents;
};
exports.groupEventsByDate = groupEventsByDate;
const hasCollision = (a, b) => {
  return a.end > b.start && a.start < b.end;
};
const calcColumnSpan = (event, columnIndex, columns) => {
  let colSpan = 1;
  for (let i = columnIndex + 1; i < columns.length; i++) {
    const column = columns[i];
    const foundCollision = column.find(ev => hasCollision(event, ev));
    if (foundCollision) {
      return colSpan;
    }
    colSpan++;
  }
  return colSpan;
};
const buildEvent = (event, left, width, options) => {
  const eventStart = _momentTimezone.default.tz(event.start, options.tzOffset);
  const eventEnd = _momentTimezone.default.tz(event.end, options.tzOffset);
  const timeToHour = eventStart.hour() + eventStart.minute() / 60;
  let start = timeToHour - options.startHour;
  const diffHour = eventEnd.diff(eventStart, 'm') / 60;
  const isSameDate = eventStart.isSame(eventEnd, 'd');
  if (!isSameDate) {
    const currentDate = _momentTimezone.default.tz(options.startDate, options.tzOffset).add(options.dayIndex, 'd');
    const diffCurrent = eventStart.diff(currentDate, 'm') / 60;
    if (diffCurrent < 0) {
      start = 0 + diffCurrent - options.startHour;
    }
  }
  return {
    ...event,
    startHour: start,
    duration: diffHour,
    left,
    width
  };
};
const packOverlappingEventGroup = (columns, calculatedEvents, populateOptions) => {
  const {
    columnWidth,
    rightEdgeSpacing,
    overlapEventsSpacing
  } = populateOptions;
  columns.forEach((column, columnIndex) => {
    column.forEach(event => {
      const totalWidth = columnWidth - rightEdgeSpacing;
      const columnSpan = calcColumnSpan(event, columnIndex, columns);
      const eventLeft = columnIndex / columns.length * totalWidth;
      let eventWidth = totalWidth * (columnSpan / columns.length);
      if (columnIndex + columnSpan <= columns.length - 1) {
        eventWidth -= overlapEventsSpacing;
      }
      calculatedEvents.push(buildEvent(event, eventLeft, eventWidth, populateOptions));
    });
  });
};
const populateEvents = (events, options) => {
  let lastEnd = null;
  let columns = [];
  let calculatedEvents = [];
  const cloneEvents = [...events];
  const sortedEvents = cloneEvents.sort((a, b) => {
    if (a.start < b.start) {
      return -1;
    }
    if (a.start > b.start) {
      return 1;
    }
    if (a.end < b.end) {
      return -1;
    }
    if (a.end > b.end) {
      return 1;
    }
    return 0;
  });
  sortedEvents.forEach(function (ev) {
    if (lastEnd !== null && ev.start >= lastEnd) {
      packOverlappingEventGroup(columns, calculatedEvents, options);
      columns = [];
      lastEnd = null;
    }
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!hasCollision(col[col.length - 1], ev)) {
        col.push(ev);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([ev]);
    }
    if (lastEnd === null || ev.end > lastEnd) {
      lastEnd = ev.end;
    }
  });
  if (columns.length > 0) {
    packOverlappingEventGroup(columns, calculatedEvents, options);
  }
  return calculatedEvents;
};
exports.populateEvents = populateEvents;
const divideEventsByColumns = props => {
  const {
    events = {},
    startDate,
    columns,
    ...other
  } = props;
  let eventsByColumns = [];
  const startUnix = (0, _momentTimezone.default)(startDate).unix();
  for (let i = 0; i < columns; i++) {
    const currentUnix = startUnix + i * _constants.SECONDS_IN_DAY;
    const dateStr = _momentTimezone.default.unix(currentUnix).format('YYYY-MM-DD');
    let eventsInDate = [];
    const eventInDate = events[dateStr];
    if (eventInDate) {
      eventsInDate = eventInDate;
    }
    eventsByColumns[i] = eventsInDate;
  }
  return eventsByColumns.map((event, index) => populateEvents(event, {
    ...other,
    dayIndex: index,
    startDate
  }));
};
exports.divideEventsByColumns = divideEventsByColumns;
const getTheme = theme => {
  let defaultTheme = {
    cellBorderColor: _constants.DEFAULT_PROPS.CELL_BORDER_COLOR,
    backgroundColor: _constants.DEFAULT_PROPS.WHITE_COLOR,
    loadingBarColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    unavailableBackgroundColor: _constants.DEFAULT_PROPS.UNAVAILABLE_BACKGROUND_COLOR,
    editIndicatorColor: _constants.DEFAULT_PROPS.BLACK_COLOR,
    nowIndicatorColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR,
    dragCreateItemBackgroundColor: _constants.DEFAULT_PROPS.CREATE_ITEM_BACKGROUND_COLOR,
    //Header
    todayName: {
      color: _constants.DEFAULT_PROPS.PRIMARY_COLOR
    },
    todayNumber: {
      color: _constants.DEFAULT_PROPS.WHITE_COLOR
    },
    todayNumberContainer: {
      backgroundColor: _constants.DEFAULT_PROPS.PRIMARY_COLOR
    }
  };
  if (theme) {
    defaultTheme = (0, _lodash.merge)(defaultTheme, theme);
  }
  return defaultTheme;
};
exports.getTheme = getTheme;
const getDayBarStyle = function (currentDate, date, theme) {
  let highlightDate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const dateStr = date.format('YYYY-MM-DD');
  const isToday = dateStr === currentDate;
  const weekDay = date.day();
  const isSunday = weekDay === 0;
  const isSaturday = weekDay === 6;
  let styleKey = 'day';
  if (isToday) {
    styleKey = 'today';
  } else if (isSunday) {
    styleKey = 'sunday';
  } else if (isSaturday) {
    styleKey = 'saturday';
  }
  let style = {
    dayName: {
      ...theme[`${styleKey}Name`]
    },
    dayNumber: {
      ...theme[`${styleKey}Number`]
    },
    dayNumberContainer: {
      ...theme[`${styleKey}NumberContainer`]
    }
  };
  if (!isToday) {
    if (highlightDate.dayNameColor) {
      style.dayName.color = highlightDate.dayNameColor;
    }
    if (highlightDate.dayNumberColor) {
      style.dayNumber.color = highlightDate.dayNumberColor;
    }
    if (highlightDate.dayNumberBackgroundColor) {
      style.dayNumberContainer.backgroundColor = highlightDate.dayNumberBackgroundColor;
    }
  }
  return style;
};
exports.getDayBarStyle = getDayBarStyle;
const triggerHaptic = () => {
  try {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    const hapticFeedback = require('react-native-haptic-feedback').default;
    const type = _reactNative.Platform.select({
      ios: 'selection',
      default: 'soft'
    });
    hapticFeedback.trigger(type, options);
  } catch (ex) {}
};
exports.triggerHaptic = triggerHaptic;
const getCurrentDate = (tzOffset, date) => {
  return _momentTimezone.default.tz(date, tzOffset).format('YYYY-MM-DD');
};
exports.getCurrentDate = getCurrentDate;
const clampValues = (value, min, max) => {
  'worklet';

  return Math.max(min, Math.min(value, max));
};
exports.clampValues = clampValues;
const shallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
};
exports.shallowEqual = shallowEqual;
const roundTo = (hour, step, type) => {
  'worklet';

  const totalMinutes = hour * 60;
  if (type === 'up') {
    const nextMinutes = Math.ceil(totalMinutes / step) * step;
    return nextMinutes / 60;
  }
  const nextMinutes = Math.floor(totalMinutes / step) * step;
  return nextMinutes / 60;
};
exports.roundTo = roundTo;
//# sourceMappingURL=utils.js.map