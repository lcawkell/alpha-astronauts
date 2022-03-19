import * as React from 'react';
export interface RippleProps {
    size?: "small" | "medium" | "large";
    top: number;
    left: number;
    color?: string;
    onComplete?: () => void;
}
export interface RippleState {
    active: boolean;
    fading: boolean;
}
export default class Ripple extends React.Component<RippleProps, RippleState> {
    readonly state: RippleState;
    constructor(props: RippleProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    setActive: () => void;
    setFading: () => void;
    setComplete: () => void;
    render(): JSX.Element;
}
