"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _TimelineProvider = require("../context/TimelineProvider");
const useTimelineScroll = () => {
  const {
    timelineHorizontalListRef,
    currentIndex,
    totalPages,
    isScrolling,
    timelineVerticalListRef,
    viewMode
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const goToNextPage = (0, _react.useCallback)(animated => {
    var _timelineHorizontalLi;
    const nextIndex = currentIndex.value + 1;
    if (nextIndex > totalPages[viewMode]) {
      return;
    }
    isScrolling.current = animated || false;
    (_timelineHorizontalLi = timelineHorizontalListRef.current) === null || _timelineHorizontalLi === void 0 ? void 0 : _timelineHorizontalLi.scrollToIndex({
      index: nextIndex,
      animated: animated
    });
  }, [currentIndex.value, isScrolling, timelineHorizontalListRef, totalPages, viewMode]);
  const goToPrevPage = (0, _react.useCallback)(animated => {
    var _timelineHorizontalLi2;
    const nextIndex = currentIndex.value - 1;
    if (nextIndex < 0) {
      return;
    }
    isScrolling.current = animated || false;
    (_timelineHorizontalLi2 = timelineHorizontalListRef.current) === null || _timelineHorizontalLi2 === void 0 ? void 0 : _timelineHorizontalLi2.scrollToIndex({
      index: nextIndex,
      animated: animated
    });
  }, [currentIndex, isScrolling, timelineHorizontalListRef]);
  const goToOffsetY = (0, _react.useCallback)((target, animated) => {
    var _timelineVerticalList;
    (_timelineVerticalList = timelineVerticalListRef.current) === null || _timelineVerticalList === void 0 ? void 0 : _timelineVerticalList.scrollTo({
      y: target,
      animated
    });
  }, [timelineVerticalListRef]);
  return {
    goToPrevPage,
    goToNextPage,
    goToOffsetY
  };
};
var _default = useTimelineScroll;
exports.default = _default;
//# sourceMappingURL=useTimelineScroll.js.map