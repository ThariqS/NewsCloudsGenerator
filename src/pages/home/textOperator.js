import React, { PropTypes } from 'react';
import Radium from 'Radium';
import {SimpleSelect} from 'react-selectize';
import DatePicker from 'react-datepicker';

require('react-datepicker/dist/react-datepicker.css');

let styles = {};

class TextOperator extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.value };
	}
	value() {
		return this.props.value;
	}
	expand() {
		this.setState({ title: 'group', value: null });
	}
	onChange(value) {
		console.log(value);
		this.setState({field: value.value});
	}
	render() {
		const options = ["title", "date", "story"].map(function(fruit){
			return {label: fruit, value: fruit}
		});

		const stories = ["Elections", "Syrian Migrant Crisis", "Iran Nuclear Deal"].map(function(story){
			return {label: story, value: story}
		});

		let elem;
		if (this.state.field === 'title') {
			elem = (<span style={styles.inline}>contains <input style={styles.textInput} type="text"></input></span>);
		} else if (this.state.field === 'date') {
			elem = (<span style={styles.inline}>between
				<span style={styles.inline}>
				<DatePicker/>
				</span>
				and
				<span style={styles.inline}>
				<DatePicker/>
				</span>
				</span>);
		} else if (this.state.field === 'story') {
			elem = (<span style={styles.inline}>is part of the following story

				<SimpleSelect
					style={styles.inline}
					options={stories}
					placeholder="Select a field"/>

				</span>);
		}

		return (
			<div>
			<SimpleSelect
				style={styles.inline}
				onValueChange={this.onChange.bind(this)}
				options={options}
				placeholder="Select a field"/>
			{elem}
			</div>
		);
	}
}

styles = {
	inline: {
		display: 'inline-block',
		margin: '5px',
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


export default Radium(TextOperator);
