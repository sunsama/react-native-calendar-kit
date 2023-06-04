import { GestureResponderEvent, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import type { EventItem, PackedEvent, UnavailableItemProps } from '../../types';
interface TimelinePageProps {
    startDate: string;
    isLoading?: boolean;
    onPressBackground?: (date: string, event: GestureResponderEvent) => void;
    onLongPressBackground?: (date: string, event: GestureResponderEvent) => void;
    onPressOutBackground?: (date: string, event: GestureResponderEvent) => void;
    holidays?: string[];
    events?: {
        [date: string]: EventItem[];
    };
    onPressEvent?: (eventItem: PackedEvent) => void;
    onLongPressEvent?: (eventItem: PackedEvent) => void;
    renderEventContent?: (event: PackedEvent, timeIntervalHeight: SharedValue<number>) => JSX.Element;
    selectedEventId?: string;
    renderCustomUnavailableItem?: (props: UnavailableItemProps) => JSX.Element;
    renderHalfLineCustom?: (width: number) => JSX.Element;
    halfLineContainerStyle?: ViewStyle;
    currentDate: string;
}
declare const TimelinePage: ({ startDate, onPressBackground, onLongPressBackground, onPressOutBackground, isLoading, holidays, events, onPressEvent, onLongPressEvent, renderEventContent, selectedEventId, renderCustomUnavailableItem, renderHalfLineCustom, halfLineContainerStyle, currentDate, }: TimelinePageProps) => JSX.Element;
export default TimelinePage;
//# sourceMappingURL=TimelinePage.d.ts.map