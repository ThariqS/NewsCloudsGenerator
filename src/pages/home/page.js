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
	onNameChange(event) {
		this.setState({name: event.target.value});
	}
	render() {
		return (
			<div>
				<h1 style={styles.header}>NewsClouds Generator</h1>
				<h2 style={styles.subHeader}>Name:
          <input onChange={this.onNameChange.bind(this)} style={styles.nameInput} type="text" placeholder="Name your Newscloud."/>
        </h2>
				<h2 style={styles.subHeader}>Query:</h2>
				<GroupOperator ref="group"/>
				<h2 style={styles.subHeader}>Sources:</h2>
				<SourceSelector ref="source"/>
				<button style={styles.button} onClick={this.submitButton.bind(this)}>Submit</button>
				<Portal isOpened={this.state.loaded} closeOnEsc closeOnOutsideClick>
					<Results name={this.state.name} sources={this.state.sources} query={this.state.query}/>
				</Portal>

			</div>
		);
	}
}

styles = {
	nameInput: {
		outline: 'none',
		padding: '5px',
		fontSize: '0.5em',
		fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
		width: '300px',
		verticalAlign: 'middle',
    color: '#222',
	},
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
