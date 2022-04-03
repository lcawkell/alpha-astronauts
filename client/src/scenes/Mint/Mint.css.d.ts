declare namespace MintCssNamespace {
  export interface IMintCss {
    actions: string;
    bigConnectButton: string;
    button: string;
    container: string;
    coverSpin: string;
    headingContainer: string;
    hiddenContainer: string;
    mint: string;
    rewards: string;
    root: string;
    spin: string;
    validationMessage: string;
    walletConnector: string;
  }
}

declare const MintCssModule: MintCssNamespace.IMintCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MintCssNamespace.IMintCss;
};

export = MintCssModule;
