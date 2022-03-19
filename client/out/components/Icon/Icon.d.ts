import * as React from 'react';
/**
 * @render react
 * @name Icon
 * @description Easy to use SVG Icons
 * @example
 * <Icon icon="sync-regular"></Icon>
 */
export declare enum IconTypes {
    plusLight = "plus-light",
    plus = "plus",
    plusSolid = "plus-solid",
    spinner = "spinner",
    cog = "cog",
    editLight = "edit-light",
    pencilLight = "pencil-light",
    pencil = "pencil",
    pencilSolid = "pencil-solid",
    syncLight = "sync-light",
    sync = "sync",
    syncSolid = "sync-solid",
    checkLight = "check-light",
    check = "check",
    trash = "trash",
    ban = "ban"
}
export interface IIconStyles {
    root?: {};
}
export interface IconProps {
    icon: string | {
        svgCode: string;
        viewBox: string;
    };
    rotate?: boolean;
    styles?: IIconStyles;
    color?: string;
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'extraLarge';
    iconRef?: any;
    title?: string;
    className?: string;
    onClick?: (event: React.MouseEvent) => void;
}
export interface IconState {
}
export default class Icon extends React.Component<IconProps, IconState> {
    constructor(props: IconProps);
    render(): JSX.Element;
}
