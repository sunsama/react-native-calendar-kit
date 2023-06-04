"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTimelineCalendarContext = exports.default = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _useDeepCompare = _interopRequireDefault(require("../hooks/useDeepCompare"));
var _utils = require("../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TimelineCalendarContext = /*#__PURE__*/_react.default.createContext(undefined);
const TimelineProvider = props => {
  const {
    children,
    minDate = _constants.DEFAULT_PROPS.MIN_DATE,
    maxDate = _constants.DEFAULT_PROPS.MAX_DATE,
    viewMode = _constants.DEFAULT_PROPS.VIEW_MODE,
    firstDay = _constants.DEFAULT_PROPS.FIRST_DAY,
    initialDate: initDate = _constants.DEFAULT_PROPS.INITIAL_DATE,
    start = _constants.DEFAULT_PROPS.START,
    end = _constants.DEFAULT_PROPS.END,
    hourWidth = _constants.DEFAULT_PROPS.HOUR_WIDTH,
    timeInterval = _constants.DEFAULT_PROPS.TIME_INTERVAL,
    initialTimeIntervalHeight = _constants.DEFAULT_PROPS.INIT_TIME_INTERVAL_HEIGHT,
    minTimeIntervalHeight: initialMinTimeIntervalHeight,
    maxTimeIntervalHeight = _constants.DEFAULT_PROPS.MAX_TIME_INTERVAL_HEIGHT,
    onTimeIntervalHeightChange,
    syncedLists = true,
    theme: initTheme,
    spaceFromTop = _constants.DEFAULT_PROPS.SPACE_CONTENT,
    spaceFromBottom = _constants.DEFAULT_PROPS.SPACE_CONTENT,
    isShowHalfLine = true,
    allowPinchToZoom = false,
    allowDragToCreate = false,
    dragCreateInterval = _constants.DEFAULT_PROPS.DRAG_CREATE_INTERVAL,
    dragStep = _constants.DEFAULT_PROPS.DRAG_STEP,
    showNowIndicator = true,
    unavailableHours,
    overlapEventsSpacing = _constants.DEFAULT_PROPS.OVERLAP_EVENTS_SPACING,
    rightEdgeSpacing = _constants.DEFAULT_PROPS.RIGHT_EDGE_SPACING,
    scrollToNow = true,
    locale = 'en',
    isShowHeader = true,
    hourFormat,
    eventAnimatedDuration = _constants.DEFAULT_PROPS.EVENT_ANIMATED_DURATION,
    useHaptic = false,
    timeZone = _momentTimezone.default.tz.guess(),
    nowIndicatorInterval = _constants.DEFAULT_PROPS.NOW_INDICATOR_INTERVAL,
    navigateDelay = _constants.DEFAULT_PROPS.NAVIGATION_DELAY,
    calendarWidth
  } = props;
  const {
    width: windowWidth
  } = (0, _reactNative.useWindowDimensions)();
  const timelineWidth = calendarWidth || windowWidth;

  /** Refs */
  const dayBarListRef = (0, _react.useRef)(null);
  const timelineHorizontalListRef = (0, _react.useRef)(null);
  const timelineVerticalListRef = (0, _react.useRef)(null);
  const initialDate = (0, _react.useRef)(initDate);
  const timelineLayoutRef = (0, _react.useRef)({
    width: 0,
    height: 0
  });
  const isScrolling = (0, _react.useRef)(false);
  const pinchRef = (0, _react.useRef)();

  /** Prepare data*/
  const pages = (0, _react.useMemo)(() => (0, _utils.calculateDates)(firstDay, minDate, maxDate, initialDate.current, timeZone), [firstDay, minDate, maxDate, timeZone]);
  const firstDate = (0, _react.useRef)({
    week: pages.week.data[0],
    workWeek: pages.workWeek.data[0],
    day: pages.day.data[0],
    threeDays: pages.threeDays.data[0]
  });
  const hours = (0, _react.useMemo)(() => (0, _utils.calculateHours)(start, end, timeInterval, hourFormat), [end, start, timeInterval, hourFormat]);

  /** Animated value */
  const currentIndex = (0, _reactNativeReanimated.useSharedValue)(pages[viewMode].index);
  const startDate = (0, _reactNativeReanimated.useDerivedValue)(() => pages[viewMode].data[currentIndex.value]);
  const timeIntervalHeight = (0, _reactNativeReanimated.useSharedValue)(initialTimeIntervalHeight);
  const heightByTimeInterval = (0, _reactNativeReanimated.useDerivedValue)(() => timeIntervalHeight.value * (60 / timeInterval));
  const minTimeIntervalHeight = (0, _reactNativeReanimated.useSharedValue)(initialMinTimeIntervalHeight || 0);
  const isDragCreateActive = (0, _reactNativeReanimated.useSharedValue)(false);
  const hasOnTimeIntervalHeightChange = !!onTimeIntervalHeightChange;
  (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (hasOnTimeIntervalHeightChange) {
      (0, _reactNativeReanimated.runOnJS)(onTimeIntervalHeightChange)(timeIntervalHeight.value);
    }
  }, [hasOnTimeIntervalHeightChange, onTimeIntervalHeightChange, timeIntervalHeight]);
  const offsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const rHourWidth = (0, _react.useMemo)(() => _reactNative.PixelRatio.roundToNearestPixel(hourWidth), [hourWidth]);
  const theme = (0, _useDeepCompare.default)((0, _utils.getTheme)(initTheme));
  (0, _react.useEffect)(() => {
    if (initialMinTimeIntervalHeight) {
      minTimeIntervalHeight.value = initialMinTimeIntervalHeight;
    }
  }, [initialMinTimeIntervalHeight, minTimeIntervalHeight]);
  const [currentDate, setCurrentDate] = (0, _react.useState)(() => (0, _utils.getCurrentDate)(timeZone));
  const updateCurrentDate = (0, _react.useCallback)(() => {
    const newDate = (0, _utils.getCurrentDate)(timeZone);
    if (newDate === currentDate) {
      return;
    }
    setCurrentDate(newDate);
  }, [currentDate, timeZone]);
  const isPinchActive = (0, _reactNativeReanimated.useSharedValue)(false);
  const value = (0, _react.useMemo)(() => {
    const totalPages = {
      week: pages.week.data.length,
      workWeek: pages.workWeek.data.length,
      day: pages.day.data.length,
      threeDays: pages.threeDays.data.length
    };
    const totalHours = hours.length;
    const rightSideWidth = timelineWidth - rHourWidth;
    const numOfColumns = _constants.COLUMNS[viewMode];
    const columnWidth = rightSideWidth / numOfColumns;
    return {
      pages,
      hours,
      minDate,
      maxDate,
      initialDate,
      start,
      end,
      firstDay,
      viewMode,
      dayBarListRef,
      timelineHorizontalListRef,
      timelineVerticalListRef,
      timelineLayoutRef,
      timeIntervalHeight,
      minTimeIntervalHeight,
      maxTimeIntervalHeight,
      timeInterval,
      syncedLists,
      hourWidth: rHourWidth,
      rightSideWidth,
      timelineWidth,
      currentIndex,
      columnWidth,
      theme,
      spaceFromTop,
      spaceFromBottom,
      isShowHalfLine,
      totalPages,
      totalHours,
      isScrolling,
      offsetY,
      allowPinchToZoom,
      allowDragToCreate,
      dragCreateInterval,
      dragStep,
      unavailableHours,
      showNowIndicator,
      firstDate,
      overlapEventsSpacing,
      rightEdgeSpacing,
      isDragCreateActive,
      pinchRef,
      scrollToNow,
      locale,
      isShowHeader,
      hourFormat,
      eventAnimatedDuration,
      useHaptic,
      tzOffset: timeZone,
      currentDate,
      updateCurrentDate,
      nowIndicatorInterval,
      isPinchActive,
      navigateDelay,
      numOfColumns,
      initialTimeIntervalHeight,
      heightByTimeInterval
    };
  }, [pages, hours, timelineWidth, rHourWidth, viewMode, minDate, maxDate, start, end, firstDay, timeIntervalHeight, minTimeIntervalHeight, maxTimeIntervalHeight, timeInterval, syncedLists, currentIndex, theme, spaceFromTop, spaceFromBottom, isShowHalfLine, offsetY, allowPinchToZoom, allowDragToCreate, dragCreateInterval, dragStep, unavailableHours, showNowIndicator, overlapEventsSpacing, rightEdgeSpacing, isDragCreateActive, scrollToNow, locale, isShowHeader, hourFormat, eventAnimatedDuration, useHaptic, timeZone, currentDate, updateCurrentDate, nowIndicatorInterval, isPinchActive, navigateDelay, initialTimeIntervalHeight, heightByTimeInterval]);
  const mountedRef = (0, _react.useRef)(false);
  (0, _react.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    // Scroll to current date when viewMode is changed
    const numOfDays = viewMode === 'workWeek' ? _constants.COLUMNS.week : _constants.COLUMNS[viewMode];
    const currentDay = _momentTimezone.default.tz(startDate.value, timeZone);
    const firstDateMoment = _momentTimezone.default.tz(firstDate.current[viewMode], timeZone);
    const diffDays = currentDay.startOf('D').diff(firstDateMoment, 'd');
    const pageIndex = Math.floor(diffDays / numOfDays);
    setTimeout(() => {
      var _timelineHorizontalLi;
      (_timelineHorizontalLi = timelineHorizontalListRef.current) === null || _timelineHorizontalLi === void 0 ? void 0 : _timelineHorizontalLi.scrollToIndex({
        index: pageIndex,
        animated: false
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, timeZone]);
  return /*#__PURE__*/_react.default.createElement(TimelineCalendarContext.Provider, {
    value: value
  }, children);
};
var _default = TimelineProvider;
exports.default = _default;
const useTimelineCalendarContext = () => {
  const value = (0, _react.useContext)(TimelineCalendarContext);
  if (!value) {
    throw new Error('useTimelineCalendarContext must be called from within TimelineCalendarProvider!');
  }
  return value;
};
exports.useTimelineCalendarContext = useTimelineCalendarContext;
//# sourceMappingURL=TimelineProvider.js.map