import React from 'react';
import { SharedValue } from 'react-native-reanimated';
interface NowIndicatorProps {
    dayIndex: number;
    width: number;
    timeIntervalHeight: SharedValue<number>;
    nowIndicatorColor?: string;
    tzOffset: string;
    start: number;
    updateCurrentDate: () => void;
    nowIndicatorInterval: number;
}
declare const _default: React.MemoExoticComponent<({ width, dayIndex, timeIntervalHeight, nowIndicatorColor, tzOffset, start, updateCurrentDate, nowIndicatorInterval, }: NowIndicatorProps) => JSX.Element>;
export default _default;
//# sourceMappingURL=NowIndicator.d.ts.map