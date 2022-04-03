import React, { Component } from 'react'
import { Link } from 'react-router-dom'

type Props = {}

type State = {}

export default class Home extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>
          I want to go to
          <div><Link to={'/Mint'}><button>Mint Mutants</button></Link></div>
          <div><Link to={'/Staking'}><button>Staking App</button></Link></div>
      </div>
    )
  }
}