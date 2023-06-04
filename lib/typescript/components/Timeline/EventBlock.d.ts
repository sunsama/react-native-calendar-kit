import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import type { PackedEvent, ThemeProperties } from '../../types';
export interface EventBlockProps {
    event: PackedEvent;
    dayIndex: number;
    columnWidth: number;
    onPressEvent?: (eventItem: PackedEvent) => void;
    onLongPressEvent?: (eventItem: PackedEvent) => void;
    timeIntervalHeight: SharedValue<number>;
    renderEventContent?: (event: PackedEvent, timeIntervalHeight: SharedValue<number>) => JSX.Element;
    selectedEventId?: string;
    theme: ThemeProperties;
    eventAnimatedDuration?: number;
    isPinchActive: SharedValue<boolean>;
    heightByTimeInterval: SharedValue<number>;
}
declare const _default: React.MemoExoticComponent<({ event, dayIndex, columnWidth, onPressEvent, onLongPressEvent, renderEventContent, theme, selectedEventId, eventAnimatedDuration, isPinchActive, timeIntervalHeight, heightByTimeInterval, }: EventBlockProps) => JSX.Element>;
export default _default;
//# sourceMappingURL=EventBlock.d.ts.map