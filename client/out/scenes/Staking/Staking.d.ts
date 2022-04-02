import * as React from 'react';
import Web3 from 'web3';
import { Contract } from "web3-eth-contract";
import { IStakingContainerAction } from '../../components/StakingContainer';
import { Astronaut as Astronaut } from '../../types';
export interface IStakingProps {
}
export interface IStakingState {
    web3?: Web3;
    account: string;
    connected: boolean;
    astronauts: Astronaut[];
    stakedAstronauts: Astronaut[];
    selectedAstronauts: number[];
    selectedStakedAstronauts: number[];
    stakeContract?: Contract;
    astroContract?: Contract;
    mutantContract?: Contract;
    isApproved: boolean;
    stakingValidationMessage: string;
    unstakingValidationMessage: string;
    totalRewards?: number;
    claimableRewards?: number;
    pendingActionAstros: number[];
    loading: boolean;
    stakedContainerLoading: boolean;
    astroContainerLoading: boolean;
    moonRockBalance?: number;
}
export default class Home extends React.Component<IStakingProps, IStakingState> {
    constructor(props: IStakingProps);
    componentWillMount(): Promise<void>;
    componentDidMount(): Promise<void>;
    init(): Promise<void>;
    loadDAPP: () => Promise<void>;
    isApprovedForAll(): Promise<void>;
    onClickApproveOrStake(): Promise<void>;
    onClickHarvestAll(): Promise<void>;
    onClickUnstakeSelected(): Promise<void>;
    onClickStakeAll(): Promise<void>;
    approveAstros(): Promise<void>;
    stakeSelectedAstros(): Promise<void>;
    stakeOneSelected(): Promise<void>;
    loadAstronauts(): Promise<void>;
    getAstronautHarvestTimes(stakedAstronauts: Astronaut[]): Promise<Astronaut[]>;
    loadAstronaut(tokenId: string): Promise<Astronaut>;
    loadMutant(tokenId: string): Promise<Astronaut>;
    calculatePendingRewards(): Promise<void>;
    calculateReward(astronaut: Astronaut): Promise<number>;
    requestReward(astronaut: Astronaut): Promise<any>;
    toggleAstronautSelected(edition: number): void;
    toggleStakedAstronautSelected(edition: number): void;
    loadWeb3(): Promise<void>;
    connectToWallet(): Promise<void>;
    checkWeb3Connection: () => Promise<void>;
    loadBlockchainData(account: string): Promise<void>;
    switchNetwork(): Promise<void>;
    calculateMRBalance(): Promise<void>;
    getMRBalance(): JSX.Element;
    getPendingRewards(): JSX.Element;
    getStakingContainerActions(): IStakingContainerAction[];
    getAstroContainerActions(): IStakingContainerAction[];
    renderDAPP(): JSX.Element;
    renderWalletPrompt(connectToWallet: any): JSX.Element;
    render(): JSX.Element;
}
