declare namespace StakingCssNamespace {
  export interface IStakingCss {
    actions: string;
    bigConnectButton: string;
    button: string;
    container: string;
    headingContainer: string;
    hiddenContainer: string;
    rewards: string;
    root: string;
    validationMessage: string;
    walletConnector: string;
  }
}

declare const StakingCssModule: StakingCssNamespace.IStakingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingCssNamespace.IStakingCss;
};

export = StakingCssModule;
