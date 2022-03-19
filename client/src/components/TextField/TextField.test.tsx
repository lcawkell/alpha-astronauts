import * as React from 'react';
import { shallow, ShallowWrapper, mount } from 'enzyme';

import { TextField } from './TextField';

import * as Enzyme from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter:new EnzymeAdapter()})

describe('TextField', ()=>{

    let baseControl = shallow(<TextField />);

    it('Renders exactly one input field', () => {
        expect(baseControl.find('input').length).toBe(1);
    });

    describe('When a value is given as a prop', ()=> {

        describe('When an onChange function is also given', ()=> {

            let value = 'Test Val';
            let onChange = jest.fn();
            let control = mount(<TextField value={value} onChange={onChange} />)

            it('Sets the input value to be the given value', ()=>{
                expect(control.find('input').prop('value')).toBe(value);
            });

            it('Sets calls the onChange function whenever the textbox value is changed', ()=>{
                control.find('input').simulate('change', { currentTarget: { value: 'Changed' } } );
                expect(onChange.mock.calls.length).toBe(1);
            })

        });

        describe('When an onChange function is not given', ()=> {
            let control = mount(<TextField value={'Test Value'} />)

            it('Sets the input value to be the internal default', ()=>{
                expect(control.find('input').prop('value')).toBe('Test Value');
            });

        });

    });

    describe('When a value is not given as a prop', () => {

        describe('When a defaultValue is given', ()=>{

            let defaultValue = 'I am a default value';
            let control = mount(<TextField defaultValue={defaultValue} />)

            it('Sets the input value to equal the given value', ()=>{
                expect(control.find('input').prop('value')).toBe(undefined);
            });

        });

        describe('When a defaultValue is not given', () => {

            let control = mount(<TextField />)

            it('Sets the input value to blank', ()=>{
                expect(control.find('input').prop('value')).toBe(undefined);
            });

        });

    });

    describe('When an onFocus function is given', ()=>{

        let onFocus = jest.fn();
        let control = mount(<TextField onFocus={onFocus} />)

        it('Calls the function when the input is focused', ()=>{
            control.find('input').simulate('focus');
            expect(onFocus.mock.calls.length).toBe(1);
        });

    });

});