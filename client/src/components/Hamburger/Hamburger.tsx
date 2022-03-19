import * as React from 'react';

export interface IHamburgerProps {

}

export interface IHamburgerState {
}

export default class Hamburger extends React.Component<IHamburgerProps, IHamburgerState> {
    constructor(props: IHamburgerProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        return (
            <nav role="navigation" id='mobileNavigation'>
                <div id='toggle'>
                    <input type="checkbox" />
                    <span></span>
                    <span></span>
                    <span></span>
                    <ul id="mobileMenu">
                        <a href="/items"><li>My Items</li></a>
                        <a href="/recommendations"><li>Recommendations</li></a>
                        <a href="/deals"><li>Great Deals!</li></a>
                    </ul>
                </div>
            </nav>
        );
    }
}
