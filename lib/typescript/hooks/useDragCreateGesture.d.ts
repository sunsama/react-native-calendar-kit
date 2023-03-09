/// <reference types="react-native-reanimated" />
import type { GestureResponderEvent } from 'react-native';
interface useDragCreateGesture {
    onDragCreateEnd?: (data: {
        start: string;
        end: string;
    }) => void;
}
declare const useDragCreateGesture: ({ onDragCreateEnd }: useDragCreateGesture) => {
    dragCreateGesture: import("react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture").PanGesture;
    dragXPosition: import("react-native-reanimated").SharedValue<number>;
    dragYPosition: import("react-native-reanimated").SharedValue<number>;
    isDraggingCreate: boolean;
    currentHour: import("react-native-reanimated").SharedValue<number>;
    onLongPress: (e: GestureResponderEvent) => void;
};
export default useDragCreateGesture;
//# sourceMappingURL=useDragCreateGesture.d.ts.map