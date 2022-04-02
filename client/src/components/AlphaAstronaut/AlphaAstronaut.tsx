import * as React from 'react';
import { Astronaut } from '../../types';
import * as css from './AlphaAstronaut.css';

export interface IAlphaAstronautProps extends Astronaut {
  selected?: boolean;
  onClick?: (edition:number) => void;
  isStaked: boolean;
  isPending: boolean;
  isMutant?: boolean;
}

export function AlphaAstronaut (props: IAlphaAstronautProps) {

  let selectedCSS = props.selected ? css.selected : css.notSelected;
  let selectedMutant = props.selected ? css.selectedMutant : css.notSelectedMutant;

  function onClick() {
      props.onClick(props.edition);
  }

  let isStakedClass = props.isStaked ? '' : '';
  let isPendingLoading = props.isPending ? <div className={css.pending}><div className={css.coverSpin}></div></div> : '';
  let isMutant = props.isMutant ? <img className={`${css.mutant} ${selectedMutant}`} src='mutant-frame.png' /> : '';

  return (
    <div className={css.imageContainer}>
        <div className={`${css.imageContainerInner} ${selectedCSS}`} onClick={()=>onClick()}>
            {isMutant}
            <img src={props.image} className={css.img} />
            {isPendingLoading}
            <p className={css.description}>#{props.edition}</p>
        </div>
    </div>
  );
}

function StakingInfo(props:{isStaked:boolean, lastClaimedBlock:number}) {
    return (
        props.isStaked && 
        <div>
             Staked: {props.lastClaimedBlock}
        </div>
    );
}