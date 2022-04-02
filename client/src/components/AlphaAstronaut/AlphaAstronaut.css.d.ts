declare namespace AlphaAstronautCssNamespace {
  export interface IAlphaAstronautCss {
    coverSpin: string;
    description: string;
    imageContainer: string;
    imageContainerInner: string;
    img: string;
    mutant: string;
    notSelected: string;
    notSelectedMutant: string;
    pending: string;
    selected: string;
    selectedMutant: string;
    spin: string;
  }
}

declare const AlphaAstronautCssModule: AlphaAstronautCssNamespace.IAlphaAstronautCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AlphaAstronautCssNamespace.IAlphaAstronautCss;
};

export = AlphaAstronautCssModule;
