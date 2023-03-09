import React from 'react';
import { GestureResponderEvent, ViewStyle } from 'react-native';
import type { UnavailableItemProps } from '../../../types';
interface TimelineBoardProps {
    startDate: string;
    onPressBackgroundHandler: (type: 'longPress' | 'press' | 'pressOut', event: GestureResponderEvent) => void;
    holidays?: string[];
    renderCustomUnavailableItem?: (props: UnavailableItemProps) => JSX.Element;
    renderHalfLineCustom?: (width: number) => JSX.Element;
    halfLineContainerStyle?: ViewStyle;
}
declare const _default: React.MemoExoticComponent<({ holidays, startDate, onPressBackgroundHandler, renderCustomUnavailableItem, renderHalfLineCustom, halfLineContainerStyle, }: TimelineBoardProps) => JSX.Element>;
export default _default;
//# sourceMappingURL=index.d.ts.map