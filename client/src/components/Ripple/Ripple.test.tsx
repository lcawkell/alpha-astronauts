import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Ripple from './Ripple';

import * as Enzyme from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter:new EnzymeAdapter()})

let control:ShallowWrapper<undefined, undefined>;
beforeEach(()=>{
    control = shallow(<Ripple top={0} left={0} />);
});

describe('Ripple', ()=>{

    it("Renders the ripple div", ()=>{
        expect(control.find("div").length).toBe(1);
    });

});