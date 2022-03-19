import * as React from 'react';
import { JsxAttributeLike } from 'typescript';
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
}

export default function StakingContainer (props: IStakingContainerProps) {;
  let loadingClass = props.loading? css.loadingContainer : css.loadedContainer;

  let content = props.loading ? <div className={css.pending}><div className={css.coverSpin}></div></div> : props.children;

  let actions = (props.actions !== undefined && props.actions.length > 0) ? props.actions.map(action => <Button style={css.button} onClick={()=>action.action()}>{action.name}</Button>) : '';
  
  return (
    <div className={css.wrapper}>
      <div className={`${css.container} ${loadingClass} ${css.containerSizing}`}>
        <div className={css.stakingInfo}>
            <h3 className={css.title}>{props.title}</h3>
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
