declare namespace TextFieldCssNamespace {
  export interface ITextFieldCss {
    input: string;
    wrapperMinimal: string;
    wrapperReadOnly: string;
    wrapperStandard: string;
  }
}

declare const TextFieldCssModule: TextFieldCssNamespace.ITextFieldCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TextFieldCssNamespace.ITextFieldCss;
};

export = TextFieldCssModule;
