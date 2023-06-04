import type { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ScrollView } from 'react-native';
import type { GestureType } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
import type { CalendarViewMode, TimelineProviderProps, UnavailableHour } from '../types';
declare type CustomTimelineProviderProps = Required<Omit<TimelineProviderProps, 'initialDate' | 'minTimeIntervalHeight' | 'maxTimeIntervalHeight' | 'unavailableHours' | 'hourFormat' | 'timeZone' | 'calendarWidth' | 'onTimeIntervalHeightChange'>>;
interface TimelineCalendarContextValue extends CustomTimelineProviderProps {
    pages: {
        [key in CalendarViewMode]: {
            data: string[];
            index: number;
        };
    };
    hours: {
        text: string;
        hourNumber: number;
    }[];
    initialDate: React.MutableRefObject<string>;
    dayBarListRef: React.RefObject<FlashList<string>>;
    timelineHorizontalListRef: React.RefObject<FlashList<string>>;
    timelineVerticalListRef: React.RefObject<ScrollView>;
    timelineLayoutRef: React.MutableRefObject<{
        width: number;
        height: number;
    }>;
    timeIntervalHeight: SharedValue<number>;
    minTimeIntervalHeight: SharedValue<number>;
    maxTimeIntervalHeight: number;
    timelineWidth: number;
    rightSideWidth: number;
    currentIndex: SharedValue<number>;
    columnWidth: number;
    totalHours: number;
    totalPages: {
        [key in CalendarViewMode]: number;
    };
    isScrolling: React.MutableRefObject<boolean>;
    offsetY: SharedValue<number>;
    unavailableHours?: UnavailableHour[] | {
        [weekDay: string]: UnavailableHour[];
    };
    firstDate: React.MutableRefObject<{
        [key in CalendarViewMode]?: string;
    }>;
    isDragCreateActive: SharedValue<boolean>;
    pinchRef: React.MutableRefObject<GestureType | undefined>;
    hourFormat?: string;
    tzOffset: string;
    currentDate: string;
    updateCurrentDate: () => void;
    isPinchActive: SharedValue<boolean>;
    numOfColumns: number;
    heightByTimeInterval: Readonly<SharedValue<number>>;
}
declare const TimelineProvider: React.FC<TimelineProviderProps>;
export default TimelineProvider;
export declare const useTimelineCalendarContext: () => TimelineCalendarContextValue;
//# sourceMappingURL=TimelineProvider.d.ts.map