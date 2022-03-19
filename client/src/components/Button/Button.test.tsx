import * as React from 'react';
import {HTMLAttributes, shallow, ShallowWrapper} from 'enzyme';

import Button from './Button';

import * as Enzyme from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

let control:ShallowWrapper<undefined, undefined>;
let myMock = jest.fn();
let buttonText = "Click Me!";

beforeEach(()=>

    control = shallow(<Button onClick={myMock}>{buttonText}</Button>)

);

describe("Button", () => {
it("Should render without error", ()=>{
    expect(control.length).toBe(1);
});

// it("Should render as a single button control", ()=>{
//     expect(control.find('button').length).toBe(1);
// });

// it("Should show the passed text", ()=>{
//     expect(control.find('button').text().length).toBe(buttonText.length);
// });

// it("Should call a function on click", ()=>{
//     control.find('button').simulate('click');
//     expect(myMock.mock.calls.length).toBe(1);
// });

// it("Should be clickable more than once", ()=>{
//     control.find('button').simulate('click');
//     expect(myMock.mock.calls.length).toBe(2);
// });
});