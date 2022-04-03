import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Staking from './scenes/Staking';
import Mint from './scenes/Mint/Mint';
import Home from './scenes/Home/Home';
import * as css from './AlphaAstronauts.css'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link as RouteLink
  } from "react-router-dom";

class AlphaAstronauts extends React.Component<{}, {}> {

    constructor(props){
        super(props);

        this.state = {

        }
    }
    
    render() {
        return (
            <div className={css.root}>
                <Router>
                    <Switch>
                        <Route path='/' exact={true} component={()=><Staking />} />
                        <Route path='/Staking' exact={true} component={() => <Staking />} />
                        <Route path='/Mint' exact={true} component={() => <Mint />} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

ReactDOM.render(
    <AlphaAstronauts />,
    document.getElementById('alpha-astronauts')
);