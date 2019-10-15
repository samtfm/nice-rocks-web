import React from 'react'

class RockList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rocks: [] };
    this.fetchRocks();

  }

  fetchRocks = () => {
    fetch(location.protocol + "/rocks",)
      .then(res => res.json())
      .then(res => {
        window.res = res;
        this.setState({ rocks: res.rocks });
      });
  }

  render() {
    const { rocks } = this.state;
    console.log(rocks)
    window.rocks = rocks
    return (
      <div>
        Hello, hongo!
        <ul>
          {rocks.map((rock, index) =>
            <li key={index}>{rock}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default RockList;
