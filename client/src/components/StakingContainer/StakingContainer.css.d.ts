declare namespace StakingContainerCssNamespace {
  export interface IStakingContainerCss {
    container: string;
    containerInner: string;
    containerScroll: string;
    containerSizing: string;
    coverSpin: string;
    loadedContainer: string;
    loadingContainer: string;
    pending: string;
    scrollbar: string;
    spin: string;
    stakingInfo: string;
    title: string;
    wrapper: string;
  }
}

declare const StakingContainerCssModule: StakingContainerCssNamespace.IStakingContainerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingContainerCssNamespace.IStakingContainerCss;
};

export = StakingContainerCssModule;
