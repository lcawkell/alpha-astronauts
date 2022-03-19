export interface IStakingContainerProps {
    title: string;
    details?: JSX.Element;
    children: JSX.Element[];
    loading: boolean;
}
export default function StakingContainer(props: IStakingContainerProps): JSX.Element;
