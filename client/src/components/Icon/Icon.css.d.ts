declare namespace IconCssNamespace {
  export interface IIconCss {
    rotate: string;
  }
}

declare const IconCssModule: IconCssNamespace.IIconCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IconCssNamespace.IIconCss;
};

export = IconCssModule;
