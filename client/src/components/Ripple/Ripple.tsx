import * as React from 'react';

let timeout:any;

export interface RippleProps {
    size?: "small" | "medium" | "large",
    top: number,
    left: number,
    color?: string,
    onComplete?: ()=>void
}

export interface RippleState {
    active: boolean,
    fading: boolean
}

export default class Ripple extends React.Component<RippleProps, RippleState> {
    public readonly state: RippleState = {
        active: false,
        fading: false
    }
    constructor(props: RippleProps) {
        super(props);
    }

    componentDidMount(){
       timeout = setTimeout(()=>{
            this.setActive();
        }, 50);
    }

    componentWillUnmount(){
        clearTimeout(timeout);
    }

    setActive = ()=>{
        this.setState({active:true}, ()=>{
            timeout = setTimeout(()=>{
                this.setFading();
            }, 200);
        });
    }

    setFading = ()=>{
        this.setState({fading: true}, ()=>{
            timeout = setTimeout(()=>{
                this.setComplete();
            }, 1000);
        });
    }

    setComplete = ()=>{
        this.props.onComplete();
    }

    render() {
        let sizeNum = 50;
        
        switch(this.props.size){
            case "small":
                sizeNum = 50;
                break;
            case "medium":
                sizeNum = 100;
                break;
            case "large":
                sizeNum = 200;
                break;
        }

        let styles = {
            root: {
                position: 'absolute' as 'absolute',
                opacity: .13,
                width: 0,
                height: 0,
                background: this.props.color !== undefined ? this.props.color : '#ccc',
                borderRadius: '50%',
                transition: 'width .2s, height .2s, left .2s, top .2s, opacity 1s',
                left:this.props.left,
                top:this.props.top,
                zIndex: -1
            },
            expanded: {
                height: sizeNum,
                width: sizeNum,
                left: this.props.left-(sizeNum/2),
                top: this.props.top-(sizeNum/2),
                opacity:0
            },
            faded: {
                opacity: 0
            }
        }

        let style = this.state.active ? this.state.fading? {...styles.expanded,...styles.faded} : {...styles.expanded} : {};

        return (
            <div style={{...styles.root, ...style}}></div>
        );
    }
}
