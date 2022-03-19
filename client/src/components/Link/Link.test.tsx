import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Link from './Link';

import * as Enzyme from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter:new EnzymeAdapter()})

let control:ShallowWrapper<undefined, undefined>;
beforeEach(()=>{
    control = shallow(<Link url="#">Click me!</Link>);
});

describe('Link', ()=>{

    it("Renders a single 'a' element", ()=>{
        expect(control.find('a').length).toBe(1);
    });

});