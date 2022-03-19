declare namespace AlphaAstronautCssNamespace {
  export interface IAlphaAstronautCss {
    coverSpin: string;
    description: string;
    imageContainer: string;
    imageContainerInner: string;
    img: string;
    notSelected: string;
    pending: string;
    selected: string;
    spin: string;
  }
}

declare const AlphaAstronautCssModule: AlphaAstronautCssNamespace.IAlphaAstronautCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AlphaAstronautCssNamespace.IAlphaAstronautCss;
};

export = AlphaAstronautCssModule;
