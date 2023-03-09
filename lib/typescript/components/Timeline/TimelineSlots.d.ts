import { GestureResponderEvent } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import type { EventItem, PackedEvent, UnavailableItemProps } from '../../types';
interface TimelineSlotsProps {
    isDragging: boolean;
    onPressBackground?: (date: string, event: GestureResponderEvent) => void;
    onLongPressBackground?: (date: string, event: GestureResponderEvent) => void;
    onPressOutBackground?: (date: string, event: GestureResponderEvent) => void;
    onDateChanged?: (date: string) => void;
    isLoading?: boolean;
    holidays?: string[];
    events?: {
        [date: string]: EventItem[];
    };
    onPressEvent?: (eventItem: PackedEvent) => void;
    onLongPressEvent?: (eventItem: PackedEvent) => void;
    renderEventContent?: (event: PackedEvent, timeIntervalHeight: SharedValue<number>) => JSX.Element;
    renderSelectedEventContent?: (event: PackedEvent, timeIntervalHeight: SharedValue<number>) => JSX.Element;
    selectedEvent?: PackedEvent;
    onEndDragSelectedEvent?: (event: PackedEvent) => void;
    renderCustomUnavailableItem?: (props: UnavailableItemProps) => JSX.Element;
    editEventGestureEnabled?: boolean;
    EditIndicatorComponent?: JSX.Element;
}
declare const TimelineSlots: ({ onDateChanged, isDragging, isLoading, holidays, events, selectedEvent, onEndDragSelectedEvent, editEventGestureEnabled, renderEventContent, renderSelectedEventContent, EditIndicatorComponent, ...other }: TimelineSlotsProps) => JSX.Element;
export default TimelineSlots;
//# sourceMappingURL=TimelineSlots.d.ts.map