import * as React from 'react';
import * as css from './Icon.css';
import { Icons } from './Icon.fn';

/**
 * @render react
 * @name Icon
 * @description Easy to use SVG Icons
 * @example
 * <Icon icon="sync-regular"></Icon>
 */

export enum IconTypes {
    plusLight = 'plus-light',
    plus = 'plus',
    plusSolid = 'plus-solid',
    spinner = 'spinner',
    cog = 'cog',
    editLight = 'edit-light',
    pencilLight = 'pencil-light',
    pencil = 'pencil',
    pencilSolid = 'pencil-solid',
    syncLight = 'sync-light',
    sync = 'sync',
    syncSolid = 'sync-solid',
    checkLight = 'check-light',
    check = 'check',
    trash = 'trash',
    ban = 'ban'
}



export interface IIconStyles {
    root?: {

    }
}

export interface IconProps {
    icon: string|{svgCode:string, viewBox:string},
    rotate?: boolean,
    styles?: IIconStyles,
    color?: string,
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'extraLarge',
    iconRef?: any,
    title?: string,
    className?: string,
    onClick?: (event:React.MouseEvent)=>void
}

export interface IconState {
}


export default class Icon extends React.Component<IconProps, IconState> {
    constructor(props: IconProps) {
        super(props);
        

        this.state = {
        }
    }

    render() {
        let { icon, color, size, className } = this.props;
        let height = 30;
        let width = 30;
        
        switch(size){
            case 'mini':
                height = 12;
                width = 12;
            case 'tiny':
                height = 14;
                width = 14;
                break;
            case 'small':
                height = 16;
                width = 16;
                break;
            case 'medium':
                height = 22;
                width = 22;
                break;
            case 'large':
                height = 28;
                width = 28;
                break;
            case 'extraLarge':
                height = 50;
                width = 50;
                break;
        }

        let defaultStyles:IIconStyles = {
            root: {
                height:height,
                width:width,
                strokeWidth: 3,
                fill: 'currentColor',
                position: 'relative' as 'relative',
                top: '1px'
            }
        }

        let oSvg = (typeof icon === 'string') ? Icons[icon] : icon;

        let styles:any = Object.assign(defaultStyles, this.props.styles);

        color!=undefined?styles.root.fill = color : null;

        let rotate = this.props.rotate ? css.rotate : '';

        return (
            <span title={this.props.title} className={className} onClick={this.props.onClick}>
                <svg className={rotate} style={styles.root} xmlns="http://www.w3.org/2000/svg" viewBox={oSvg.viewBox} ref={this.props.iconRef}>
                    <path d={oSvg.svgCode}/>
                </svg>
            </span>
        );
    }
}
