import { Astronaut } from '../../types';
export interface IAlphaAstronautProps extends Astronaut {
    selected?: boolean;
    onClick?: (edition: number) => void;
    isStaked: boolean;
    isPending: boolean;
    isMutant?: boolean;
}
export declare function AlphaAstronaut(props: IAlphaAstronautProps): JSX.Element;
