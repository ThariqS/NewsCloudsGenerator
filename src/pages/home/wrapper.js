import React, { PropTypes } from 'react';
import Radium from 'Radium';
import TextOperator from './textOperator';
import GroupOperator from './group';

let styles = {};

class Wrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = { type: props.type, value: props.value };
	}
	value() {
		return this.refs.val.value();
	}
	expand() {
		this.setState({ type: 'group', value: null });
	}
	render() {
		console.log(this.state);
		return (
			<div style={styles.wrapper}>
			<span style={styles.inline}>
			{ (this.state.type === 'title') ? <button style={[styles.inline, styles.button]} onClick={this.expand.bind(this)}>+</button> : null }
			{
				(this.state.type === 'title')
				? <TextOperator ref="val" value={this.state.value}/>
				: <GroupOperator ref="val" value={this.state.value}/>
			}
			</span>

			</div>
		);
	}
}

styles = {
	wrapper: {
		paddingLeft: '40px',
		maxWidth: '100%'
	},
	inline: {
		display: 'inline-block'
	},
	button: {
		display: 'inline-block',
		fontSize: '1em',
		padding: '3px',
		width: '30px',
		height: '30px',
		borderRadius: '4px',
		border: '#D8D8D8 solid 1px',
		backgroundColor: 'white',
		fontWeight: '300',
		color: 'gray',
		verticalAlign: 'middle',
	}
};

Wrapper.defaultProps = { title: PropTypes.string, value: PropTypes.any };


export default Radium(Wrapper);
