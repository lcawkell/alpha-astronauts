import * as React from 'react';
import Button from '../Button';
import * as css from './StakingContainer.css';

export interface IStakingContainerProps {
    title: string;
    details?: JSX.Element;
    children: JSX.Element[];
    loading: boolean;
    actions?: IStakingContainerAction[];
}

export interface IStakingContainerAction {
  name: string;
  action: () => void;
  visible?: boolean;
  enabled?:boolean;
}

export default function StakingContainer (props: IStakingContainerProps) {
    let loadingClass = props.loading? css.loadingContainer : css.loadedContainer;

    let content = props.loading ? <div className={css.pending}><div className={css.coverSpin}></div></div> : props.children;

    let actions = (props.actions !== undefined && props.actions.length > 0) ? props.actions.map(action =>  {

        let isVisible = (typeof action.visible) === 'undefined' ? true : action.visible;
        let isEnabled = (typeof action.enabled) === 'undefined' ? true : action.enabled;
        
        let buttonCss = isEnabled ? css.button : css.buttonDisabled;
        let buttonAction = isEnabled ? action.action : () => {console.log("dis be dis-abled")};
        
        return (isVisible ? <Button style={buttonCss} onClick={()=>buttonAction()}>{action.name}</Button> : '')
    
    }) : '';
  
  return (
    <div className={css.wrapper}>
      <div className={`${css.container} ${loadingClass} ${css.containerSizing}`}>
        <div className={css.stakingInfo}>
            <span className={css.titleContainer}><h3 className={css.title}>{props.title}</h3><span className={css.astroDisplay}>({props.children.length})</span></span>
            <span>{props.details}</span>
        </div>
        <div className={`${css.containerScroll} ${css.scrollbar}`}>
            <div className={`${css.containerInner}`}>
                {content}
            </div>
        </div>
      </div>
      <div className={css.actions}>
        {actions}
      </div>
    </div>
  );
}
