import React from 'react';
import type { UnavailableHour, UnavailableItemProps } from '../../../types';
interface VerticalBlockProps {
    dayIndex: number;
    isOutsideLimit: boolean;
    unavailableHour?: UnavailableHour[];
    isDayDisabled?: boolean;
    renderCustomUnavailableItem?: (props: UnavailableItemProps) => JSX.Element;
}
declare const _default: React.NamedExoticComponent<VerticalBlockProps>;
export default _default;
//# sourceMappingURL=VerticalBlock.d.ts.map