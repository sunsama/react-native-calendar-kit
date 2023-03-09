"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _flashList = require("@shopify/flash-list");
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _TimelineProvider = require("../../context/TimelineProvider");
var _DragEditItem = _interopRequireDefault(require("./DragEditItem"));
var _TimelineHours = _interopRequireDefault(require("./TimelineHours"));
var _TimelinePage = _interopRequireDefault(require("./TimelinePage"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const TimelineSlots = _ref => {
  let {
    onDateChanged,
    isDragging,
    isLoading,
    holidays,
    events,
    selectedEvent,
    onEndDragSelectedEvent,
    editEventGestureEnabled = true,
    renderEventContent,
    renderSelectedEventContent,
    EditIndicatorComponent,
    ...other
  } = _ref;
  const {
    timelineVerticalListRef,
    spaceFromBottom,
    spaceFromTop,
    timeIntervalHeight,
    totalHours,
    timelineWidth,
    viewMode,
    timelineHorizontalListRef,
    maxTimeIntervalHeight,
    pages,
    syncedLists,
    dayBarListRef,
    currentIndex,
    rightSideWidth,
    offsetY,
    isScrolling,
    allowDragToCreate,
    pinchRef,
    currentDate
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const contentContainerStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const containerHeight = totalHours * timeIntervalHeight.value + spaceFromTop + spaceFromBottom;
    return {
      height: containerHeight
    };
  });
  const scrollX = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  (0, _react.useEffect)(() => {
    if (!syncedLists) {
      scrollX.removeAllListeners();
      return;
    }
    scrollX.addListener(ev => {
      var _dayBarListRef$curren;
      (_dayBarListRef$curren = dayBarListRef.current) === null || _dayBarListRef$curren === void 0 ? void 0 : _dayBarListRef$curren.scrollToOffset({
        offset: ev.value,
        animated: false
      });
    });
  });
  const _onHorizontalScroll = _reactNative.Animated.event([{
    nativeEvent: {
      contentOffset: {
        x: scrollX
      }
    }
  }], {
    useNativeDriver: true,
    listener: e => {
      const x = e.nativeEvent.contentOffset.x;
      const width = e.nativeEvent.layoutMeasurement.width;
      const pageIndex = Math.round(x / width);
      if (currentIndex.value !== pageIndex) {
        currentIndex.value = pageIndex;
      }
    }
  });
  const extraValues = (0, _react.useMemo)(() => ({
    allowDragToCreate,
    isLoading,
    holidays,
    events,
    selectedEventId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id,
    currentDate
  }), [allowDragToCreate, isLoading, holidays, events, selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id, currentDate]);
  const _renderPage = _ref2 => {
    let {
      item,
      extraData
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement(_TimelinePage.default, _extends({
      startDate: item,
      isLoading: extraData === null || extraData === void 0 ? void 0 : extraData.isLoading,
      holidays: extraData === null || extraData === void 0 ? void 0 : extraData.holidays,
      events: extraData === null || extraData === void 0 ? void 0 : extraData.events,
      selectedEventId: extraData === null || extraData === void 0 ? void 0 : extraData.selectedEventId,
      renderEventContent: renderEventContent,
      currentDate: extraData.currentDate
    }, other));
  };
  const _viewabilityConfig = (0, _react.useRef)({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 99
  }).current;
  const prevIndex = (0, _react.useRef)(-1);
  const _onViewableItemsChanged = (0, _react.useRef)(info => {
    if (info.viewableItems.length === 0) {
      var _info$changed$;
      prevIndex.current = ((_info$changed$ = info.changed[0]) === null || _info$changed$ === void 0 ? void 0 : _info$changed$.index) ?? -1;
    } else {
      var _info$viewableItems$;
      const isPressNavigator = info.changed.length === 2;
      const isDragList = prevIndex.current !== -1 && prevIndex.current !== ((_info$viewableItems$ = info.viewableItems[0]) === null || _info$viewableItems$ === void 0 ? void 0 : _info$viewableItems$.index);
      if (isPressNavigator || isDragList) {
        var _info$viewableItems$2;
        onDateChanged === null || onDateChanged === void 0 ? void 0 : onDateChanged((_info$viewableItems$2 = info.viewableItems[0]) === null || _info$viewableItems$2 === void 0 ? void 0 : _info$viewableItems$2.item);
        prevIndex.current = -1;
      }
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  }).current;
  const _onVerticalScroll = _ref3 => {
    let {
      nativeEvent: {
        contentOffset
      }
    } = _ref3;
    offsetY.value = contentOffset.y;
  };
  const _renderSlots = () => {
    const listProps = {
      ref: timelineHorizontalListRef,
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      data: pages[viewMode].data,
      initialScrollIndex: pages[viewMode].index,
      pagingEnabled: true,
      scrollEventThrottle: 16,
      bounces: false,
      disableHorizontalListHeightMeasurement: true,
      extraData: extraValues,
      scrollEnabled: !isDragging && !(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id),
      viewabilityConfig: _viewabilityConfig,
      onViewableItemsChanged: _onViewableItemsChanged,
      renderItem: _renderPage,
      keyExtractor: item => item,
      onScroll: _onHorizontalScroll
    };
    const listSize = {
      height: totalHours * maxTimeIntervalHeight + spaceFromTop + spaceFromBottom,
      width: viewMode === 'day' ? timelineWidth : rightSideWidth
    };
    if (viewMode === 'day') {
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: listSize
      }, /*#__PURE__*/_react.default.createElement(_flashList.AnimatedFlashList, _extends({
        estimatedItemSize: timelineWidth,
        estimatedListSize: listSize
      }, listProps)));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_TimelineHours.default, null), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
      style: listSize
    }, /*#__PURE__*/_react.default.createElement(_flashList.AnimatedFlashList, _extends({
      estimatedItemSize: rightSideWidth,
      estimatedListSize: listSize
    }, listProps))));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.ScrollView, {
    ref: timelineVerticalListRef,
    waitFor: _reactNative.Platform.OS === 'android' ? pinchRef : undefined,
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 16,
    style: styles.container,
    onScroll: _onVerticalScroll,
    scrollEnabled: !isDragging
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.contentContainer, {
      width: timelineWidth
    }, contentContainerStyle]
  }, _renderSlots()), !!(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id) && /*#__PURE__*/_react.default.createElement(_DragEditItem.default, {
    selectedEvent: selectedEvent,
    onEndDragSelectedEvent: onEndDragSelectedEvent,
    isEnabled: editEventGestureEnabled,
    EditIndicatorComponent: EditIndicatorComponent,
    renderEventContent: renderSelectedEventContent || renderEventContent
  }));
};
var _default = TimelineSlots;
exports.default = _default;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row'
  }
});
//# sourceMappingURL=TimelineSlots.js.map