import React from 'react';
import GroupOperator from './group';
import request from 'superagent';
import SourceSelector from './sourceSelector';
import Results from './results';
import Portal from 'react-portal';

let styles = {};

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false, results: []};
  }
  submitButton() {

    let query = this.refs.group.value();
    let sources = this.refs.source.getSources();
    // query.q = `${query.q} AND ${this.refs.source.getSources()[0]}`;
    this.setState({query, sources, loaded: true, results: []});

  }
  render() {
    return (
      <div>
        <h1 style={styles.header}>NewsClouds Generator</h1>
        <h2 style={styles.subHeader}>Query:</h2>
        <GroupOperator ref="group"/>
        <h2 style={styles.subHeader}>Sources:</h2>
        <SourceSelector ref="source"/>
        <button style={styles.button} onClick={this.submitButton.bind(this)}>Submit</button>
        <Portal isOpened={this.state.loaded} closeOnEsc closeOnOutsideClick>
          <Results sources={this.state.sources} query={this.state.query}/>
        </Portal>

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
