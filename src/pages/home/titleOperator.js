import React, { PropTypes } from 'react';
import Radium from 'Radium';
import Graph from './graph';
import Related from './related';

let styles = {};

class TitleOperator extends React.Component {
	constructor(props) {
		super(props);
		this.typeTimeout = null;
		this.value = this._value.bind(this);
		this.state = { graphData: null };
	}
	_value() {
		// publish_date:[2010-10-01T00:00:00Z TO 2010-11-01T00:00:00Z]
		const valueObj = this.refs.val.value;
		return { q: `${valueObj}` };
	}
	onChange() {
		if (this.refs.val.value.length !== 0) {
			if (!this.typeTimeout) clearTimeout(this.typeTimeout);
			this.typeTimeout = setTimeout(this.updateGraph.bind(this), 250);
		} else {
			this.setState({ graphData: null });
		}
	}
	updateGraph() {
		const title = this.refs.val.value;
		if (this.refs.val.value.length > 3) {
			this.setState({ graphData: [], title });
		}
	}
	render() {
		return (
			<span style={styles.inline}> contains
				<input ref="val" onChange={this.onChange.bind(this)} style={styles.textInput} type="text"></input>
				{ (this.state.graphData) ?
					<span> <Graph title={this.state.title}/> <span style={styles.related}>
                <Related title={this.state.title}/></span></span>
				: null }
			</span>
		);
	}
}

styles = {
	inline: {
		display: 'inline-block',
		margin: '5px',
	},
	related: {
		fontSize: '0.5em',
		width: '80px',
		height: '40px',
		verticalAlign: 'middle',
		display: 'inline-block',
	},
	textInput: {
		display: 'inline-block',
		fontSize: '1em',
		padding: '7px',
		borderRadius: '4px',
		border: '#D8D8D8 solid 1px',
		backgroundColor: 'white',
		fontWeight: '300',
		color: 'gray',
		verticalAlign: 'middle',
	}
};


export default Radium(TitleOperator);
