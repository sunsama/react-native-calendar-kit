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
const calculateDates = (initialFirstDay, minDateStr, maxDateStr, initialDate, timeZone) => {
  const minDate = _momentTimezone.default.tz(minDateStr, timeZone);
  const maxDate = _momentTimezone.default.tz(maxDateStr, timeZone);
  const getStartOfWeekDate = date => {
    return date.clone().startOf(initialFirstDay === 0 ? 'week' : 'isoWeek');
  };
  const minWeekDate = getStartOfWeekDate(minDate);
  const maxWeekDate = getStartOfWeekDate(maxDate).add(6, 'd'); // End of week
  const totalDays = maxWeekDate.diff(minWeekDate, 'days');
  const createEmptyDateData = () => ({
    data: [],
    index: -1
  });
  const dateGroup = {
    day: createEmptyDateData(),
    week: createEmptyDateData(),
    threeDays: createEmptyDateData(),
    workWeek: createEmptyDateData()
  };
  const initialDates = {
    day: minDate.clone(),
    week: minWeekDate.clone(),
    threeDays: minDate.clone(),
    workWeek: minWeekDate.clone()
  };
  const increments = {
    day: 1,
    week: 7,
    threeDays: 3,
    workWeek: 7
  };
  for (let dayIndex = 0; dayIndex <= totalDays; dayIndex++) {
    const currentDate = minWeekDate.clone().add(dayIndex, 'd');
    if (currentDate.isAfter(maxDate)) {
      break;
    }
    const dateStr = currentDate.format('YYYY-MM-DD');
    Object.keys(dateGroup).forEach(key => {
      if (initialDates[key].isSameOrBefore(currentDate)) {
        dateGroup[key].data.push(dateStr);
        initialDates[key].add(increments[key], 'd');
        if (dateStr === initialDate) {
          dateGroup[key].index = dateGroup[key].data.length - 1;
        }
      }
    });
  }
  return dateGroup;
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
const convertPositionToISOString = (locationX, locationY, startDate, hourHeight, columnWidth) => {
  const dayIndex = Math.floor(locationX / columnWidth);
  const hourFromY = locationY / hourHeight;
  const dateMoment = (0, _momentTimezone.default)(startDate).add(dayIndex, 'd').add(hourFromY, 'hour');
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
      const dateStr = startEvent.clone().add(i, 'd').format('YYYY-MM-DD');
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
      start = diffCurrent - options.startHour;
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