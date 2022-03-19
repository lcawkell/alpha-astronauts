import * as React from 'react';

export interface LinkProps {
    url?: string,
    children?: any
}

export interface LinkState {
    hovering: boolean,
    underline: boolean
}

export default class Link extends React.Component<LinkProps, LinkState> {
    public readonly state: LinkState = {
        hovering: false,
        underline: false
    }
    constructor(props: LinkProps) {
        super(props);
    }

  startHover = () => {
      this.setState({underline:true});
  }

  endHover = () => {
      this.setState({underline:false});
  }

  render() {

    const styles = {
        link: {
            fontSize: '1em',
            textDecoration: 'none',
            position: 'relative' as 'relative',
            fontFamily: 'Arial',
            padding: '3px',
            color: '#4183C4',
            cursor: 'pointer'
        }
    }
    
    let { url, children } = this.props;

    return (
        <a style={{padding: '5px',...styles.link}} href={url} onMouseEnter={this.startHover} onMouseLeave={this.endHover}>
            <span style={{position:'relative'}}>
                {children}
                <Underline expand={this.state.underline} />
            </span>
        </a>  
    );
  }
}

export interface UnderlineProps {
    expand: boolean
}

export function Underline (props:UnderlineProps) {

        let styles = {
            normal: {
                position: 'absolute' as 'absolute',
                bottom: '-2px',
                left: '50%',
                width: '0%',
                height: '1px',
                backgroundColor: '#4183C4',
                transition: 'all .2s'
            },
            expanded: {
                position: 'absolute' as 'absolute',
                bottom: '-2px',
                left: '0px',
                width: '100%',
                height: '1px',
                backgroundColor: '#4183C4',
                transition: 'all .2s'
            }
        }

        let style = props.expand ? styles.expanded : styles.normal;

        return (
            <span style={style}> </span>
        );
}

