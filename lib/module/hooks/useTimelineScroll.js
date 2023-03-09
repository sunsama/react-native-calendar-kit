import { useCallback } from 'react';
import { useTimelineCalendarContext } from '../context/TimelineProvider';
const useTimelineScroll = () => {
  const {
    timelineHorizontalListRef,
    currentIndex,
    totalPages,
    isScrolling,
    timelineVerticalListRef,
    viewMode
  } = useTimelineCalendarContext();
  const goToNextPage = useCallback(animated => {
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
  const goToPrevPage = useCallback(animated => {
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
  const goToOffsetY = useCallback((target, animated) => {
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
export default useTimelineScroll;
//# sourceMappingURL=useTimelineScroll.js.map