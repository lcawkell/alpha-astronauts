declare namespace HamburgerCssNamespace {
  export interface IHamburgerCss {
    mobileProfileLink: string;
  }
}

declare const HamburgerCssModule: HamburgerCssNamespace.IHamburgerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HamburgerCssNamespace.IHamburgerCss;
};

export = HamburgerCssModule;
