import * as React from 'react';
import * as styles from './TextField.css';
import {debounce} from 'lodash';

export interface ITextFieldProps {
    value?:string|number,
    defaultValue?:string,
    readOnly?:boolean,
    name?:string,
    id?:string,
    placeHolder?:string,
    length?: number,
    required?: boolean,
    autoComplete?: 'on' | 'off' | undefined,
    onChange?: (newValue:string|number) => void,
    onFocus?: () => void,
    onBlur?: (newValue:string, valid:boolean) => void,
    onClick?: () => void,
    Ref?: any,
    type?: 'text' | 'number',
    restrictCharacters?: boolean,
    restrictedCharactersArray?: number[],
    minimal?: boolean,
    wrapperClass?: string,
    inputClass?: string,
    onEnter?: () => void
}

export interface ITextFieldState {
    value:string|number,
    restrictCharacters: boolean,
    restrictedCharactersArray: number[]
}

export class TextField extends React.Component<ITextFieldProps, ITextFieldState> {

    public readonly state:ITextFieldState = {
        value: '',
        restrictCharacters: false,
        // unicode html characters
        // 43: + , 45: - , 46: . , 101: e
        restrictedCharactersArray: [43, 45, 46, 101], 
    }

    constructor(props: ITextFieldProps) {
        super(props);
    
        let value = '';

        // If default value is defined then set that value
        value = this.props.defaultValue !== undefined ? this.props.defaultValue : '';
        const restrictCharacters: boolean = this.props.restrictCharacters !== undefined ? this.props.restrictCharacters : false;
        const restrictedCharactersArray: number[] = this.props.restrictedCharactersArray !== undefined ? this.props.restrictedCharactersArray : [43, 45, 46, 101];

        this.state = {
            value,
            restrictCharacters,
            restrictedCharactersArray
        };

        this.onChange = this.onChange.bind(this);
        
    }

    componentDidMount() {
        this.setState({value:this.props.value});
        this.setState({
            restrictCharacters:this.props.restrictCharacters,
            restrictedCharactersArray:this.props.restrictedCharactersArray
        });
    }

    componentWillReceiveProps(newProps:ITextFieldProps) {

        if(newProps.value !== this.state.value) {
            this.setState({value:newProps.value});
        }

        if(newProps.restrictCharacters !== this.state.restrictCharacters) {
            this.setState({restrictCharacters:newProps.restrictCharacters});
        }

        if(newProps.restrictedCharactersArray !== this.state.restrictedCharactersArray) {
            this.setState({restrictedCharactersArray:newProps.restrictedCharactersArray});
        }

    }

    onChange(caller:React.FormEvent<HTMLInputElement>) {

        let type: 'text' | 'number' = this.props.type !== undefined ? this.props.type : 'text';
        let value:string|number = caller.currentTarget.value;


        if(type === 'number' && value !== "" && Object.keys(value).length <= this.props.length) {
             value = Number(value);
             this.setState({value});
         }
         if(type === 'text' && value !== "" ) {
            this.setState({value});
        }
        if (Object.keys(value).length == 0 ) { 
            this.setState({value});
        } 

        if(this.props.value !== undefined && this.props.onChange !== undefined) {
            this.props.onChange(value);
        }

    }

    onBlur(val:React.FormEvent<HTMLInputElement>) {
        let valid = this.isValid(val.currentTarget.value, this.props.required);
        this.props.onBlur && this.props.onBlur(val.currentTarget.value, valid);
    }

    onKeyPress(event:React.KeyboardEvent<HTMLInputElement>){
        if(event.key === "Enter") this.props.onEnter && this.props.onEnter();

        const restrictCharacters: boolean = this.props.restrictCharacters !== undefined ? this.props.restrictCharacters : false;
        const restrictedCharactersArray: number[] = this.props.restrictedCharactersArray !== undefined ? this.props.restrictedCharactersArray : [43, 45, 46, 101];
        
        // restricts type 'number' from using characters from restrictedCharactersArray
        if (this.props.type === 'number' && (restrictCharacters && restrictedCharactersArray.indexOf(event.charCode) > -1)) {
            event.preventDefault();
        }
    }

    isValid(value:string, required?:boolean) {
        let valid = true;

        // If required then check the field length
        if(required) valid = value.length > 0 ? true : false;
        
        return valid;
    }

    public render() {

        // If value and onChange props are given we use those otherwise we will use internally defined variables
        let { readOnly, name, onFocus, required, id, onClick, Ref, minimal} = this.props;
        let setLength = this.props.length !== undefined ? this.props.length : null;
        let autoComplete = this.props.autoComplete === undefined ? 'on' : this.props.autoComplete;
        let inputRef = Ref !== undefined ? Ref : '';
        let type: 'text' | 'number' = this.props.type !== undefined ? this.props.type : 'text';
        let style = minimal ? styles.wrapperMinimal : readOnly ? styles.wrapperReadOnly : styles.wrapperStandard;
        let wrapperClass = this.props.wrapperClass !== undefined ? this.props.wrapperClass : '';
        let inputClass = this.props.inputClass !== undefined ? this.props.inputClass : '';
 
        return (
            <div className={`${style} ${wrapperClass}`}>
                {!readOnly ? 
                    <input
                        style={{background:'rgb(0,0,0,0)'}}
                        id={id}
                        name = {name}
                        className={`${styles.input} ${inputClass}`} 
                        value={this.state.value}
                        placeholder={this.props.placeHolder}
                        onChange={this.onChange}
                        onFocus={onFocus}
                        onBlur={this.onBlur.bind(this)}
                        maxLength={setLength}
                        required={required}
                        autoComplete={autoComplete}
                        onClick={onClick}
                        ref={inputRef}
                        type={type}
                        onKeyPress={this.onKeyPress.bind(this)}
                    />
                :   <span id={name} >{this.state.value}</span>}
            </div>
        );
    }
}