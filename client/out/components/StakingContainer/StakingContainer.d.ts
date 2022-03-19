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
export default function StakingContainer(props: IStakingContainerProps): JSX.Element;
