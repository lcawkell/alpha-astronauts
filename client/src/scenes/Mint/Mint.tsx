import css from './Mint.css';
import Web3 from 'web3';
import { Contract } from "web3-eth-contract";
import { AlphaAstroABI, AlphaStakeABI, MutantABI } from '../../contracts/ABI/AlphaAstroABI';
import { AlphaAstronaut as AlphaAstronaut } from '../../components/AlphaAstronaut/AlphaAstronaut';
import StakingContainer, { IStakingContainerAction } from '../../components/StakingContainer';
import Button from '../../components/Button';
import { Astronaut as Astronaut } from '../../types';

const MOONROCK_CONTRACT_ADDRESS = '0x30947d2Cc30335ecFb302115688a805487A2dD6F';
const ASTRO_CONTRACT_ADDRESS = '0x52e037160C70bE63c1f79dd507E4879C032207d0';
const MUTANT_CONTRACT_ADDRESS = '0x07eE7174C063E51D559906995A2FC1E2c05727EE';
const decimals = 1000000000000000000;

import React, { Component } from 'react'
import { Link } from 'react-router-dom';

type MintProps = {}

type MintState = {
    web3?:Web3;
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
    mutantsToMint: number;
    totalMinted: number;
    moonRockMintPrice: number;
}

declare let window:any;

export default class Mint extends Component<MintProps, MintState> {
    constructor(props: MintProps) {
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
            astroContainerLoading: true,
            mutantsToMint: 1,
            totalMinted: 0,
            moonRockMintPrice: -1
        }
    }

    async componentWillMount() {
        await this.init();
    }

    async componentDidMount() {
        let stakeContract = new this.state.web3.eth.Contract(AlphaStakeABI, MOONROCK_CONTRACT_ADDRESS);
        let astroContract = new this.state.web3.eth.Contract(AlphaAstroABI, ASTRO_CONTRACT_ADDRESS);
        let mutantContract = new this.state.web3.eth.Contract(MutantABI, MUTANT_CONTRACT_ADDRESS);

        this.setState({stakeContract, astroContract, mutantContract},async ()=>{
            this.loadDAPP();
        });

        this.toggleAstronautSelected = this.toggleAstronautSelected.bind(this);
        this.toggleStakedAstronautSelected = this.toggleStakedAstronautSelected.bind(this);
        this.isApprovedForMoonrocks = this.isApprovedForMoonrocks.bind(this);
    }

    async init() {
        await this.loadWeb3();
        await this.checkWeb3Connection();
        window.ethereum.on('accountsChanged', this.checkWeb3Connection);
    }

    loadDAPP = async () => {
        if(this.state.connected) {
            this.getMoonRockMintPrice()
            this.isApprovedForMoonrocks();
            this.getMutantsMinted();
            return;
        }
        setTimeout(()=>this.loadDAPP(), 500);
    }

    async getMoonRockMintPrice() {
        let moonRockMintPrice = await this.state.mutantContract.methods.tokenPrices(MOONROCK_CONTRACT_ADDRESS).call();
        this.setState({moonRockMintPrice:moonRockMintPrice/decimals});
    }

    async isApprovedForAll() {
        let isApproved = await this.state.astroContract.methods.isApprovedForAll(this.state.account, MOONROCK_CONTRACT_ADDRESS).call();
        this.setState({isApproved});
    }

    async isApprovedForMoonrocks() {
        let isApproved = await this.state.stakeContract.methods.allowance(this.state.account, MUTANT_CONTRACT_ADDRESS).call();
        console.log(isApproved);
        this.setState({isApproved:isApproved>=200000000000000000000});
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
                from: this.state.account,
                gas: 4000000
            });
        }catch(e) {
            console.log("Harvest Batch Failed");
        }
        let stakedAstronauts = this.state.stakedAstronauts.map(stakedAstronaut => Object.assign({},stakedAstronaut));
        stakedAstronauts = await this.getAstronautHarvestTimes(stakedAstronauts);

        this.setState({stakedAstronauts}, ()=> {
            this.calculatePendingRewards();
            this.calculateMRBalance();
        });
    }

    async onClickUnstakeSelected() {
        this.setState({unstakingValidationMessage:'', pendingActionAstros: this.state.selectedStakedAstronauts});
        
        if(this.state.selectedStakedAstronauts.length <= 0) {
            this.setState({unstakingValidationMessage: 'Please select one or more astronauts to unstake'});
            return;
        }

        try {
            await this.state.stakeContract.methods.unstakeBatch(this.state.selectedStakedAstronauts).send({
                from: this.state.account,
                gas: 4000000
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
            from: this.state.account,
            gas: 1000000
        });
    }

    async approveMoonrock() {
        await this.state.stakeContract.methods.approve(MUTANT_CONTRACT_ADDRESS, '100000000000000000000000').send({
            from: this.state.account,
            gas: 1000000
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
                from: this.state.account,
                gas: 4000000
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

    async stakeOneSelected() {
        this.setState({stakingValidationMessage:'', pendingActionAstros:this.state.selectedAstronauts});

        let movingAstro = this.state.selectedAstronauts[0];

        try {
            await this.state.stakeContract.methods.stake(movingAstro).send({
                from: this.state.account,
                gas: 1000000
            });
        }catch(e) {
            // Staking failed
            this.setState({pendingActionAstros: []});
            return;
        }

        let stakedAstronauts = this.state.stakedAstronauts.map(stakedAstronaut => Object.assign({},stakedAstronaut));
        let astronauts = this.state.astronauts.map(astronaut => Object.assign({},astronaut));

        stakedAstronauts.push(this.state.astronauts.filter(astro => astro.edition === movingAstro)[0]);
        astronauts = astronauts.filter(astronaut => astronaut.edition !== movingAstro);

        this.setState({
            selectedAstronauts: [],
            stakedAstronauts: stakedAstronauts,
            astronauts: astronauts,
            pendingActionAstros: []
        });
    }

    async loadAstronauts() {
        let astronautsToLoad = await this.state.astroContract.methods.walletOfOwner(this.state.account).call();
        // let mutantsToLoad = await this.state.mutantContract.methods.walletOfOwner(this.state.account).call();
        let stakedAstronautsToLoad = await this.state.stakeContract.methods.stakedNFTSByUser(this.state.account).call();
        // let stakedMutantsToLoad = await this.state.stakeContract.methods.stakedNFTSByUser(this.state.account).call();

        let allAstronauts:Astronaut[] = await Promise.all(astronautsToLoad.map(async (astronaut) => this.loadAstronaut(astronaut)));
        // let allMutants:Astronaut[] = await Promise.all(mutantsToLoad.map(async (mutant) => this.loadMutant(mutant)));
        let stakedAstronauts:Astronaut[] = await Promise.all(stakedAstronautsToLoad.filter(astronaut => astronaut > 0).map(async (astronaut) => this.loadAstronaut(astronaut)));
        // let stakedMutants:Astronaut[] = await Promise.all(stakedMutantsToLoad.filter(mutant => mutant > 0).map(async (mutant) => this.loadMutant(mutant)));

        stakedAstronauts = await this.getAstronautHarvestTimes(stakedAstronauts);

        this.setState({astronauts:allAstronauts, stakedAstronauts: stakedAstronauts}, ()=> {
            this.setState({stakedContainerLoading: false, astroContainerLoading: false});
        });
    }

    async getAstronautHarvestTimes(stakedAstronauts:Astronaut[]):Promise<Astronaut[]> {
        return await Promise.all(stakedAstronauts.map(async (stakedAstronaut) => {
            let stakeLog = null;

            stakeLog = await this.state.stakeContract.methods.stakeLog(this.state.account, stakedAstronaut.edition).call();

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
                isMutant: false,
                date: content.date,
                attributes: content.attributes,
                dna: content.dna,
                image: image
            });
        });
    }

    // async loadMutant(tokenId:string):Promise<Astronaut> {
    //     return new Promise(async (resolve) => {
    //         let uri:string = await this.state.mutantContract.methods.tokenURI(tokenId).call();
    //         let content:Astronaut = await(await fetch(uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))).json();
    //         let image = await content.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
    //         resolve({
    //             name: content.name,
    //             description: content.description,
    //             edition: content.edition,
    //             isMutant: true,
    //             date: content.date,
    //             attributes: content.attributes,
    //             dna: content.dna,
    //             image: image
    //         });
    //     });
    // }

    // Claimable, as give by the contract
    async calculatePendingRewards() {
        if(this.state.stakedAstronauts.length === 0) {
            this.setState({claimableRewards:0});
            return;
        }
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

    async mintMutantWithMoonrocks() {
        if(this.state.mutantsToMint > 10) return;
        if(this.state.mutantsToMint < 1) return;
        await this.state.mutantContract.methods.altMint(this.state.mutantsToMint, MOONROCK_CONTRACT_ADDRESS).send({
            from: this.state.account,
            gas: 1000000
        });
        this.getMutantsMinted();
    }

    async mintMutantWithMatic() {
        if(this.state.mutantsToMint > 10) return;
        if(this.state.mutantsToMint < 1) return;
        await this.state.mutantContract.methods.mint(this.state.mutantsToMint).send({
            from: this.state.account,
            gas: 1000000,
            value: (5*this.state.mutantsToMint)*decimals
        });
        this.getMutantsMinted();
    }

    updateMutantsToMint = (value) => this.setState({mutantsToMint:value});

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
            alert(`Metamask doesn't appear to be loaded. Please make sure you are using a web3 capable browser with metamask installed.`)
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

    getMutantsMinted = async () => {
        let totalMinted = await this.state.mutantContract.methods.totalSupply().call();
        this.setState({totalMinted});
    }

    async loadBlockchainData(account:string) {
        this.setState({account: account})
        const networkId = await this.state.web3.eth.net.getId()
        console.log("Network ID: " + networkId);
        if(networkId !== 137) {
            await this.switchNetwork();
        }
    }

    async switchNetwork() {
        // workaround because TypeScript doesn't seem to think request exists on currentProvider
        let currentProvider = (this.state.web3.currentProvider) as any;

        try{
            await currentProvider.request({ 
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }]
            });
        } catch {
            alert(`Unable to switch your network. Please change to the polygon network to use this app.`)
            return;
        }

        await this.init();
        await this.loadDAPP();
    }

    async calculateMRBalance() {
        let moonRockBalance = await this.state.stakeContract.methods.balanceOf(this.state.account).call() / 1000000000000000000;
        this.setState({moonRockBalance});
    }

    getAstroContainerActions():IStakingContainerAction[] {
        return [
            {
                name: this.state.isApproved? 'Stake Selected' : 'Approve Use Of Astros',
                action: ()=>this.onClickApproveOrStake()
            },
            {
                name: 'Stake One Selected',
                action: ()=>this.stakeOneSelected(),
                visible: this.state.isApproved,
                enabled: this.state.selectedAstronauts.length === 1
            },
            {
                name: 'Stake All',
                action: ()=>this.onClickStakeAll(),
                visible: this.state.isApproved
            }
        ];
    }


    public renderDAPP() {
        let mintText = this.state.moonRockMintPrice > -1 ? `Mint for ${this.state.moonRockMintPrice} MR` : 'Mint';
        let containerHideCss = (!this.state.loading && this.state.connected) ? '' : css.hiddenContainer;
        let MintButton = (this.state.isApproved ? <div className={css.mintContainer}>
                <div style={{color:'white', fontSize:'20px', fontWeight:700}}>{`${this.state.totalMinted}/7777`}</div>
                <br />
                <div style={{display:'flex', justifyItems: 'center', flexDirection:'column', color:'#fff'}}>How many do you want to mint? (max 10)
                    <br/>
                    <input className={css.input} type='number' max='10' value={this.state.mutantsToMint} onChange={(event)=>this.updateMutantsToMint(event.target.value)} />
                </div>
                <br/>
                <button className={css.button} onClick={()=>this.mintMutantWithMoonrocks()}>{mintText}</button>
                <button style={{marginTop: '10px'}} className={css.button} onClick={()=>this.mintMutantWithMatic()}>Mint for 5 MATIC</button>
            </div> 
            : <button className={css.button} onClick={()=>this.approveMoonrock()}>Approve Moonrocks</button>
            
            )
        return (
        
        <div className={`${css.container} ${containerHideCss}`}>
            <img id="logo" alt="logo" src="/logo-mutant.png"></img>
            <Link to={'/'}><button className={css.button}>Astronaut Staking</button></Link>
            <WalletConnector account={this.state.account} />

            {MintButton}

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