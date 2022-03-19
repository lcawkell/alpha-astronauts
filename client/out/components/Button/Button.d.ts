import * as React from 'react';
/**
 * @render react
 * @name Button
 * @description A really cool button
 * @example
 * <Button>Click Me!</Button>
 */
interface ButtonProps {
    onClick?: () => void;
    children?: any;
    style?: string;
    activeStyle?: string;
    active?: boolean;
    primary?: boolean;
    buttonRef?: any;
    id?: string;
}
interface ButtonState {
    hovering: boolean;
    active: boolean;
}
export interface ActionButtonProps {
    children?: any;
    active?: boolean;
    onClick: () => void;
}
export interface IconButtonProps {
    children?: any;
    active?: boolean;
    onClick: () => void;
}
export interface CheckButtonProps {
    disabled?: boolean;
    index?: number;
    checked?: boolean;
    value?: string | number;
    onClick: (index: number) => void;
    singular: boolean;
    key: string | number;
    styles?: string;
}
export default class Button extends React.Component<ButtonProps, ButtonState> {
    readonly state: ButtonState;
    constructor(props: ButtonProps);
    onClick: (event: any) => void;
    isHovering: (hovering: boolean) => void;
    isActive: (active: boolean) => void;
    renderChildren: () => any;
    render(): JSX.Element;
}
export declare function ButtonContent(props: any): JSX.Element;
export declare function ActionButton(props: ActionButtonProps): JSX.Element;
interface IconButtonState {
    position: {
        x: number;
        y: number;
    };
    ripple: {
        left: number;
        top: number;
    }[];
    children?: any;
}
export declare class IconButton extends React.Component<IconButtonProps, IconButtonState> {
    readonly state: IconButtonState;
    constructor(props: IconButtonProps);
    componentDidMount(): void;
    onClick: () => void;
    doRipple: (event: any) => void;
    setButtonContainerRef: (element: any) => void;
    render(): JSX.Element;
}
export declare class CheckButton extends React.Component<CheckButtonProps, any> {
    constructor(props: CheckButtonProps);
    onClick: () => void;
    render(): JSX.Element;
}
export {};
