import * as React from 'react';
import Ripple from '../Ripple';
import * as cssStyles from './Button.css';
/**
 * @render react
 * @name Button
 * @description A really cool button
 * @example
 * <Button>Click Me!</Button>
 */


interface ButtonProps {
    onClick?: () => void,
    children?: any,
    style?:string,
    activeStyle?:string,
    active?: boolean,
    primary?: boolean,
    buttonRef?: any,
    id?: string
}

interface ButtonState {
    hovering: boolean,
    active: boolean
}

export interface ActionButtonProps {
    children?:any,
    active?: boolean,
    onClick: () => void
}

export interface IconButtonProps {
    children?:any,
    active?: boolean,
    onClick: () => void
}

export interface CheckButtonProps {
    disabled?: boolean,
    index?: number,
    checked?: boolean,
    value?: string|number,
    onClick: (index:number) => void,
    singular: boolean,
    key:string|number, 
    styles?: string
}
export default class Button extends React.Component<ButtonProps, ButtonState> {
    public readonly state: ButtonState = {
        hovering: false,
        active: false
    }
    constructor(props: ButtonProps) {
        super(props);
    }


    onClick = (event) => {
        if(event.nativeEvent.which === 1) {
            this.setState({active:false})
            this.props.onClick();
        }
    }

    isHovering = (hovering: boolean) => {
        let active = this.state.active;
        if(!hovering) active = false;
        this.setState({hovering, active});
    }

    isActive = (active: boolean) => {
        this.setState({active});
    }

    renderChildren = () => {
        return React.Children.map(this.props.children,(child:any,index)=>{
            if(child.type === undefined) {
                // Text
                return <ButtonContent>{child}</ButtonContent>;
            } else {
                if(child.type.name === 'Icon') {
                    return React.cloneElement(child, {
                        styles: {
                            root: {
                                height: 17,
                                position:'relative' as 'relative',
                                top: '1px'
                            }
                        }
                    });
                }
            }
        });
    }

    render() {

        let rootPermActive = this.props.active ? this.props.activeStyle !== undefined ? this.props.activeStyle : cssStyles.rootActive : {};

        if(this.props.active !== undefined && this.props.active === false) {
            rootPermActive = cssStyles.rootInactive;
        }

        let rootStyles = this.props.primary ? cssStyles.rootPrimary : cssStyles.root;

        return (
            <button 
                type="button" 
                id={this.props.id}
                className={`${rootStyles} ${this.props.style} ${rootPermActive}`}
                onMouseEnter={()=>this.isHovering(true)} 
                onMouseLeave={()=>this.isHovering(false)}
                onMouseDown={()=>this.isActive(true)}
                onMouseUp={this.onClick}
                ref={this.props.buttonRef}
                >

                {this.props.children}
            </button>
        );
    }
}

export function ButtonContent(props) {
    let contentStyle = {
        root: {
            position:'relative' as 'relative', 
            top:'-2', 
            margin: '0px 5px 0px 5px',
            fontSize: '.8rem',
            fontWeight: 400 as 400,

        }
    }
    return (
        <span style={contentStyle.root}>{props.children}</span>
    );
}

export function ActionButton (props: ActionButtonProps) {

    return (
        <Button style={cssStyles.actionButtonRoot} active={props.active} onClick={props.onClick}>{props.children}</Button>
    );
}


interface IconButtonState {
    position: {x:number, y:number},
    ripple: {left: number, top:number}[],
    children?:any
}

let iconButtonElement;
let iconButtonContainerElement;

export class IconButton extends React.Component<IconButtonProps, IconButtonState> {
    public readonly state:IconButtonState = {
        position: {
            x: 0,
            y: 0
        },
        ripple: []
    }
    constructor(props:IconButtonProps){
        super(props);
    }

    componentDidMount(){

        let iconButtonPosition = {y:0, x:0, height:0, width: 0};
        let iconButtonContainerPosition = {y:0, x:0, height:0, width:0};


        iconButtonPosition = iconButtonElement.getBoundingClientRect();
        iconButtonContainerPosition = iconButtonContainerElement.getBoundingClientRect();        


        //console.log(iconButtonPosition.x-iconButtonContainerPosition.x)

        this.setState({
            position: {
                x: (iconButtonPosition.x-iconButtonContainerPosition.x)+(iconButtonPosition.width/2)-1,
                y: (iconButtonPosition.y-iconButtonContainerPosition.y)+(iconButtonPosition.height/2)
            }
        });
    }

    onClick = () => {
        this.props.onClick();
        this.doRipple(event);
    }

    doRipple = (event:any) => {
        this.setState({
            ripple: []
        }, ()=>{
            this.setState({
                ripple: [
                    {
                        left: this.state.position.x,
                        top: this.state.position.y
                    }
                ]
            })
        });
    }

    setButtonContainerRef = element => {
        iconButtonContainerElement = element;
    };

    render(){

        let Ripples = this.state.ripple.map((ripple,index)=>{
            return <Ripple key={`ripple-${index}`} top={ripple.top} left={ripple.left} size="small" onComplete={()=>{}} color="#aaa"/>
        });

        return (
            <span style={{position: 'relative'}} ref={this.setButtonContainerRef}>
                <Button style={cssStyles.iconButton} active={this.props.active} onClick={this.onClick} buttonRef={el => iconButtonElement = el}>{this.props.children}</Button>
                {Ripples}
            </span>
        );
    }
}
export class CheckButton extends React.Component<CheckButtonProps, any> {
    constructor (props:CheckButtonProps) {
        super(props);
    }

    onClick = () => {
        this.props.onClick(this.props.index);
    }

    render(){
        let {checked} = this.props;

        return(
            <Button active={checked} style={cssStyles.checkButton} onClick={this.onClick}>{this.props.children}</Button>
        );
    }
}
