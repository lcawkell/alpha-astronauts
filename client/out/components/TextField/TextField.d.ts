import * as React from 'react';
export interface ITextFieldProps {
    value?: string | number;
    defaultValue?: string;
    readOnly?: boolean;
    name?: string;
    id?: string;
    placeHolder?: string;
    length?: number;
    required?: boolean;
    autoComplete?: 'on' | 'off' | undefined;
    onChange?: (newValue: string | number) => void;
    onFocus?: () => void;
    onBlur?: (newValue: string, valid: boolean) => void;
    onClick?: () => void;
    Ref?: any;
    type?: 'text' | 'number';
    restrictCharacters?: boolean;
    restrictedCharactersArray?: number[];
    minimal?: boolean;
    wrapperClass?: string;
    inputClass?: string;
    onEnter?: () => void;
}
export interface ITextFieldState {
    value: string | number;
    restrictCharacters: boolean;
    restrictedCharactersArray: number[];
}
export declare class TextField extends React.Component<ITextFieldProps, ITextFieldState> {
    readonly state: ITextFieldState;
    constructor(props: ITextFieldProps);
    componentDidMount(): void;
    componentWillReceiveProps(newProps: ITextFieldProps): void;
    onChange(caller: React.FormEvent<HTMLInputElement>): void;
    onBlur(val: React.FormEvent<HTMLInputElement>): void;
    onKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void;
    isValid(value: string, required?: boolean): boolean;
    render(): JSX.Element;
}
