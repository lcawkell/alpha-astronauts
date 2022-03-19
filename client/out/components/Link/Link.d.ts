import * as React from 'react';
export interface LinkProps {
    url?: string;
    children?: any;
}
export interface LinkState {
    hovering: boolean;
    underline: boolean;
}
export default class Link extends React.Component<LinkProps, LinkState> {
    readonly state: LinkState;
    constructor(props: LinkProps);
    startHover: () => void;
    endHover: () => void;
    render(): JSX.Element;
}
export interface UnderlineProps {
    expand: boolean;
}
export declare function Underline(props: UnderlineProps): JSX.Element;
