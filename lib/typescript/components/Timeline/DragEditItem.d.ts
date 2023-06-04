import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import type { PackedEvent } from '../../types';
interface DragEditItemProps {
    selectedEvent: PackedEvent;
    onEndDragSelectedEvent?: (event: PackedEvent) => void;
    renderEventContent?: (event: PackedEvent, heightByTimeInterval: SharedValue<number>) => JSX.Element;
    isEnabled?: boolean;
    EditIndicatorComponent?: JSX.Element;
}
declare const _default: React.MemoExoticComponent<({ selectedEvent, onEndDragSelectedEvent, renderEventContent, isEnabled, EditIndicatorComponent, }: DragEditItemProps) => JSX.Element>;
export default _default;
//# sourceMappingURL=DragEditItem.d.ts.map