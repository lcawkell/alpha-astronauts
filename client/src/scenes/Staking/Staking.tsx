import * as React from 'react';
import Web3 from 'web3';
import { Contract } from "web3-eth-contract";
import { AlphaAstroABI, AlphaStakeABI } from '../../contracts/ABI/AlphaAstroABI';
import { AlphaAstronaut as AlphaAstronaut } from '../../components/AlphaAstronaut/AlphaAstronaut';
import css from './Staking.css';
import StakingContainer from '../../components/StakingContainer';
import Button from '../../components/Button';
import { Astronaut as Astronaut } from '../../types';

const MOONROCK_CONTRACT_ADDRESS = '0x30947d2Cc30335ecFb302115688a805487A2dD6F';
const ASTRO_CONTRACT_ADDRESS = '0x52e037160C70bE63c1f79dd507E4879C032207d0';

export interface IStakingProps {

}

export interface IStakingState {
    web3?:Web3;
    account: string;
    connected: boolean;
    astronauts: Astronaut[];
    stakedAstronauts: Astronaut[];
    selectedAstronauts: number[];
    selectedStakedAstronauts: number[];
    stakeContract?: Contract;
    astroContract?: Contract;
    isApproved: boolean;
    stakingValidationMessage: string;
    unstakingValidationMessage: string;
    totalRewards?: number;
    claimableRewards?: number;
    pendingActionAstros: number[];
    loading: boolean;
    stakedContainerLoading: boolean;
    astroContainerLoading: boolean;
}

declare let window:any;

export default class Home extends React.Component<IStakingProps, IStakingState> {
    constructor(props: IStakingProps) {
        super(props);

        this.state = {
            account: '',
            connected: false,
            astronauts: [],
            stakedAstronauts: [],
            selectedAstronauts: [],
            selectedStakedAstronauts: [],
            isApproved: true,
            stakingValidationMessage: '',
            unstakingValidationMessage: '',
            pendingActionAstros: [],
            loading: true,
            stakedContainerLoading: true,
            astroContainerLoading: true
        }
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.checkWeb3Connection();
        window.ethereum.on('accountsChanged', this.checkWeb3Connection);
    }

    async componentDidMount() {
        let stakeContract = new this.state.web3.eth.Contract(AlphaStakeABI, MOONROCK_CONTRACT_ADDRESS);
        let astroContract = new this.state.web3.eth.Contract(AlphaAstroABI, ASTRO_CONTRACT_ADDRESS);

        this.setState({stakeContract, astroContract},async ()=>{
            this.loadDAPP();
        });

        this.toggleAstronautSelected = this.toggleAstronautSelected.bind(this);
        this.toggleStakedAstronautSelected = this.toggleStakedAstronautSelected.bind(this);

        console.log(await this.state.web3.eth.getBlockNumber());
    }

    loadDAPP = async () => {
        if(this.state.connected) {
            await this.isApprovedForAll();
            await this.loadAstronauts();
            this.calculateTotalRewards();
            this.calculatePendingRewards();
            return;
        }
        setTimeout(()=>this.loadDAPP(), 500);
    }

    async isApprovedForAll() {
        let isApproved = await this.state.astroContract.methods.isApprovedForAll(this.state.account, MOONROCK_CONTRACT_ADDRESS).call();
        this.setState({isApproved});
    }

    async onClickApproveOrStake() {
        if(!this.state.isApproved) {
            this.approveAstros();
        }else {
            this.stakeSelectedAstros();
        }
    }

    async onClickHarvestAll() {
        try {
            await this.state.stakeContract.methods.harvestBatch(this.state.account).send({
                from: this.state.account
            });
        }catch(e) {
            console.log("Harvest Batch Failed");
        }
        let stakedAstronauts = this.state.stakedAstronauts.map(stakedAstronaut => stakedAstronaut);
        stakedAstronauts = await this.getAstronautHarvestTimes(stakedAstronauts);

        this.setState({stakedAstronauts});
    }

    async onClickUnstakeSelected() {
        this.setState({unstakingValidationMessage:'', pendingActionAstros: this.state.selectedStakedAstronauts});
        
        if(this.state.selectedStakedAstronauts.length <= 0) {
            this.setState({unstakingValidationMessage: 'Please select one or more astronauts to unstake'});
            return;
        }

        try {
            await this.state.stakeContract.methods.unstakeBatch(this.state.selectedStakedAstronauts).send({
                from: this.state.account
            });
        }catch(e) {
            // Unstaking failed
            this.setState({pendingActionAstros: []});
            return;
        }

        let stakedAstronauts = this.state.stakedAstronauts.map(stakedAstronaut => Object.assign({},stakedAstronaut));
        let astronauts = this.state.astronauts.map(astronaut => Object.assign({},astronaut));

        this.state.selectedStakedAstronauts.forEach(astronautEdition => {
            astronauts.push(this.state.stakedAstronauts.filter(astronaut => astronaut.edition === astronautEdition)[0]);
            stakedAstronauts = stakedAstronauts.filter(astronaut => astronaut.edition !== astronautEdition);
        });
        

        this.setState({
            selectedStakedAstronauts: [],
            stakedAstronauts: stakedAstronauts,
            astronauts: astronauts,
            pendingActionAstros: []
        });
    }

    async onClickStakeAll() {
        let selectedAstros = this.state.selectedAstronauts.map(selected => selected);

        selectedAstros = this.state.astronauts.map(astro => astro.edition);

        this.setState({selectedAstronauts:selectedAstros},()=>this.stakeSelectedAstros());
    }

    async approveAstros() {
        await this.state.astroContract.methods.setApprovalForAll(MOONROCK_CONTRACT_ADDRESS, 1).send({
            from: this.state.account
        });
    }

    async stakeSelectedAstros() {
        let currentBlock = await this.state.web3.eth.getBlockNumber();

        this.setState({stakingValidationMessage:'', pendingActionAstros:this.state.selectedAstronauts});

        if(this.state.selectedAstronauts.length <= 0) {
            this.setState({stakingValidationMessage: 'Please select one or more astronauts to stake'});
            return;
        }

        try {
            await this.state.stakeContract.methods.stakeBatch(this.state.selectedAstronauts).send({
                from: this.state.account
            });
        }catch(e) {
            // Staking failed
            this.setState({pendingActionAstros: []});
            return;
        }

        let stakedAstronauts = this.state.stakedAstronauts.map(stakedAstronaut => Object.assign({},stakedAstronaut));
        let astronauts = this.state.astronauts.map(astronaut => Object.assign({},astronaut));

        this.state.selectedAstronauts.forEach(astronautEdition => {
            let movingAstro = this.state.astronauts.filter(astronaut => astronaut.edition === astronautEdition)[0];
            
            movingAstro.claimedOnBlock = currentBlock;
            movingAstro.stakedOnBlock = currentBlock;

            stakedAstronauts.push(movingAstro);
            astronauts = astronauts.filter(astronaut => astronaut.edition !== astronautEdition);
        });
        

        this.setState({
            selectedAstronauts: [],
            stakedAstronauts: stakedAstronauts,
            astronauts: astronauts,
            pendingActionAstros: []
        });
    }

    async loadAstronauts() {
        let astronautsToLoad = await this.state.astroContract.methods.walletOfOwner(this.state.account).call();
        let stakedAstronautsToLoad = await this.state.stakeContract.methods.stakedNFTSByUser(this.state.account).call();

        let allAstronauts:Astronaut[] = await Promise.all(astronautsToLoad.map(async (astronaut) => this.loadAstronaut(astronaut)));
        let stakedAstronauts:Astronaut[] = await Promise.all(stakedAstronautsToLoad.filter(astronaut => astronaut > 0).map(async (astronaut) => this.loadAstronaut(astronaut)));

        stakedAstronauts = await this.getAstronautHarvestTimes(stakedAstronauts);

        this.setState({astronauts:allAstronauts, stakedAstronauts: stakedAstronauts}, ()=> {
            this.setState({stakedContainerLoading: false, astroContainerLoading: false});
        });
    }

    async getAstronautHarvestTimes(stakedAstronauts:Astronaut[]):Promise<Astronaut[]> {
        return await Promise.all(stakedAstronauts.map(async (stakedAstronaut) => {
            let stakeLog = await this.state.stakeContract.methods.stakeLog(this.state.account, stakedAstronaut.edition).call();
            stakedAstronaut.stakedOnBlock = stakeLog.stakedAtBlock;
            stakedAstronaut.claimedOnBlock = stakeLog.lastHarvestBlock;
            return stakedAstronaut;
        }));
    }

    async loadAstronaut(tokenId:string):Promise<Astronaut> {
        return new Promise(async (resolve) => {
            let uri:string = await this.state.astroContract.methods.tokenURI(tokenId).call();
            let content:Astronaut = await(await fetch(uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))).json();
            let image = await content.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
            resolve({
                name: content.name,
                description: content.description,
                edition: content.edition,
                date: content.date,
                attributes: content.attributes,
                dna: content.dna,
                image: image
            });
        });
    }

    async calculateTotalRewards() {
        let rewardsArray = await Promise.all(this.state.stakedAstronauts.map(async (astronaut) => await this.calculateReward(astronaut)));
        let totalRewards = Number(rewardsArray.reduce((curr, nxt) => curr+nxt).toFixed(2));
        this.setState({totalRewards});
        setTimeout(()=>this.calculateTotalRewards(), 5000);
    }

    // Claimable, as give by the contract
    async calculatePendingRewards() {
        let rewardsArray = await Promise.all(this.state.stakedAstronauts.map(async (astronaut) => await this.requestReward(astronaut)));
        let pendingRewards = rewardsArray.reduce((curr, nxt) => Number(curr)+Number(nxt));
        pendingRewards = pendingRewards / 1000000000000000000;
        this.setState({claimableRewards:pendingRewards});
    }

    async calculateReward(astronaut: Astronaut) {
        let currentBlock = await this.state.web3.eth.getBlockNumber();
        let reward = (currentBlock - astronaut.claimedOnBlock) / 20571 -1;
        return (reward * 10);
    }

    async requestReward(astronaut: Astronaut) {
        return await this.state.stakeContract.methods.pendingRewards(this.state.account, astronaut.edition).call();
    }

    toggleAstronautSelected(edition:number) {
        let selectedAstronauts = this.state.selectedAstronauts.map(selectedAstronaut => selectedAstronaut);
        let selectedIndex = this.state.selectedAstronauts.indexOf(edition);
        if(selectedIndex === -1) {
            selectedAstronauts.push(edition);
        }else {
            selectedAstronauts.splice(selectedIndex,1);
        }
        this.setState({selectedAstronauts: selectedAstronauts});
    }

    toggleStakedAstronautSelected(edition:number) {
        let selectedStakedAstronauts = this.state.selectedStakedAstronauts.map(selectedAstronaut => selectedAstronaut);
        let selectedIndex = this.state.selectedStakedAstronauts.indexOf(edition);
        if(selectedIndex === -1) {
            selectedStakedAstronauts.push(edition);
        }else {
            selectedStakedAstronauts.splice(selectedIndex,1);
        }
        this.setState({selectedStakedAstronauts});
    }

    async loadWeb3() {
        if(window.ethereum) {
            this.setState({web3:new Web3(window.ethereum)});
        }
        else {
            window.alert('Non ethereum browser detected. You should consider Metamask!')
        }
    }

    async connectToWallet() {
        await window.ethereum.enable();
        this.state.web3.eth.getAccounts().then(accounts => {
            if(accounts.length > 0){
                this.loadBlockchainData(accounts[0]);
                this.setState({connected:true, loading: false});
            }
        });
    }

     checkWeb3Connection = async () => {
        this.state.web3.eth.getAccounts().then(accounts => {
            if(accounts.length > 0){
                this.loadBlockchainData(accounts[0]);
                this.setState({connected:true, loading: false});
            } else {
                this.setState({connected:false, loading: false});
            }
        });

    }

    async loadBlockchainData(account:string) {
        this.setState({account: account})
        const networkId = await this.state.web3.eth.net.getId()
    }


    public renderDAPP() {
        let containerHideCss = (!this.state.loading && this.state.connected) ? '' : css.hiddenContainer;
        return (<div className={`${css.container} ${containerHideCss}`}>

            <WalletConnector account={this.state.account} />

            <StakingContainer title='STAKED ASTRONAUTS' details={<span>Pending Rewards: <span>{this.state.claimableRewards}</span></span>} loading={this.state.stakedContainerLoading}>
                {this.state.stakedAstronauts.map(astronaut => <AlphaAstronaut {...astronaut} isPending={this.state.pendingActionAstros.indexOf(astronaut.edition) > -1} selected={this.state.selectedStakedAstronauts.indexOf(astronaut.edition) > -1} onClick={this.toggleStakedAstronautSelected} isStaked={true} />)}
            </StakingContainer>

            <div className={css.actions}>
                <Button style={css.button} onClick={()=>this.onClickUnstakeSelected()}>Unstake Selected</Button>
                <Button style={css.button} onClick={()=>this.onClickHarvestAll()}>Harvest All</Button>
                <div className={css.validationMessage}>{this.state.unstakingValidationMessage}</div>
            </div>

            <div id='spacer' style={{height:'35px'}}></div>

            <StakingContainer title='UNSTAKED ASTRONAUTS' loading={this.state.astroContainerLoading} >
                {this.state.astronauts.map(astronaut => <AlphaAstronaut {...astronaut} isPending={this.state.pendingActionAstros.indexOf(astronaut.edition) > -1} selected={this.state.selectedAstronauts.indexOf(astronaut.edition) > -1} onClick={this.toggleAstronautSelected} isStaked={false} />)}
            </StakingContainer>

            <div className={css.actions}>
                <Button style={css.button} onClick={()=>this.onClickApproveOrStake()}>{this.state.isApproved? 'Stake Selected' : 'Approve Use Of Astros'}</Button>
                <Button style={css.button} onClick={()=>this.onClickStakeAll()}>Stake All</Button>
                <div className={css.validationMessage}>{this.state.stakingValidationMessage}</div>
            </div>

        </div>);
    }

    renderWalletPrompt(connectToWallet) {
        return (
            <div className={css.bigConnectButton}><button onClick={()=>connectToWallet()}>Connect Wallet</button></div>
        );
    }

    public render() {
        if(!this.state.loading && !this.state.connected) {
            return this.renderWalletPrompt(this.connectToWallet);
        }else {
            return this.renderDAPP();
        }
    }
}

function WalletConnector(props:{account:string}) {
    return (
        <span className={css.walletConnector}><Button>{`${props.account.substring(0,6).toUpperCase()}...${props.account.substring(props.account.length-4).toUpperCase()}`}</Button></span>
    );
}