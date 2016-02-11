import React from 'react';
import Radium from 'Radium';

let styles = {};

export default class Results extends React.Component {
  render() {
    return (
      <div>
        {this.props.results.map((result, index) =>
          <div>
           {result.title} - {result.url}
          </div>
        )}
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

export default Radium(Results);
