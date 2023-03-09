import type { DayBarItemProps, HighlightDates } from '../../../types';
interface TimelineHeaderProps {
    renderDayBarItem?: (props: DayBarItemProps) => JSX.Element;
    onPressDayNum?: (date: string) => void;
    isLoading?: boolean;
    highlightDates?: HighlightDates;
    selectedEventId?: string;
}
declare const TimelineHeader: ({ renderDayBarItem, onPressDayNum, isLoading, highlightDates, selectedEventId, }: TimelineHeaderProps) => JSX.Element;
export default TimelineHeader;
//# sourceMappingURL=index.d.ts.map