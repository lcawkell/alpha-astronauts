declare namespace AlphaAstronautsCssNamespace {
  export interface IAlphaAstronautsCss {
    root: string;
  }
}

declare const AlphaAstronautsCssModule: AlphaAstronautsCssNamespace.IAlphaAstronautsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AlphaAstronautsCssNamespace.IAlphaAstronautsCss;
};

export = AlphaAstronautsCssModule;
