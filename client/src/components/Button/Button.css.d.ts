declare namespace ButtonCssNamespace {
  export interface IButtonCss {
    actionButtonRoot: string;
    checkButton: string;
    checkButtonActive: string;
    iconButton: string;
    root: string;
    rootActive: string;
    rootInactive: string;
    rootPrimary: string;
  }
}

declare const ButtonCssModule: ButtonCssNamespace.IButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonCssNamespace.IButtonCss;
};

export = ButtonCssModule;
