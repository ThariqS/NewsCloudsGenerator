import React from 'react';
import GroupOperator from './group';
import request from 'superagent';
import SourceSelector from './sourceSelector';
import Results from './results';
import CompareGraph from './compareGraph';

let styles = {};

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, results: []};
  }
  submitButton() {

    const query = this.refs.group.value();
    this.setState({query, loaded: true, results: []});
    return;

    request
      .post('/stories')
      .send({ q: query.q, fq: query.fq })
      .end(function(err, res){
        console.log("Got result!");
        console.log(err);
        console.log(res.body);
        this.setState({loaded: true, results: res.body});
      }.bind(this));

  }
  render() {
    return (
      <div>
        <h1 style={styles.header}>NewsClouds Generator</h1>
        <h2 style={styles.subHeader}>Query:</h2>
        <GroupOperator ref="group"/>
        <CompareGraph query={this.state.query} title ="Graph"/>
        <h2 style={styles.subHeader}>Sources:</h2>
        <SourceSelector ref="source"/>
        <button style={styles.button} onClick={this.submitButton.bind(this)}>Submit</button>
        {/* (this.state.loaded === true) ? <Results results={this.state.results}/> : null */}

      </div>
    );
  }
}

styles = {
  header: {
    color: '#666',
    marginBottom: '5vh',
    fontWeight: 300,
    fontSize: '4em'
  },
  subHeader: {
    color: '#666',
    fontWeight: 300,
    fontSize: '2em'
  },
  button: {
    marginTop: '5vh',
    display: 'inline-block',
    fontSize: '1.25em',
    padding: '8px',
    borderRadius: '4px',
    border: '#D8D8D8 solid 1px',
    backgroundColor: 'white',
    fontWeight: '300',
    color: 'gray',
    verticalAlign: 'middle',
  }
};
