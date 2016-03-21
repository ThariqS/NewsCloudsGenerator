import React, { PropTypes } from 'react';
import Radium from 'Radium';
import {SimpleSelect} from 'react-selectize';
import DateRange from './dateRangeOperator';
import TitleOperator from './titleOperator';

let styles = {};

class TextOperator extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.value };
	}
	value() {
		const valueObj = this.refs.val.value;
		if (typeof valueObj === 'function') {
			const val = valueObj();
			if (val.q) {
				val.q =  `${this.state.field.value}:${val.q}`
			} else if (val.fq) {
				val.fq =  `${this.state.field.value}:${val.fq}`
			}
			return val;
		}
		return { q: `${this.state.field.value}:${valueObj}` };
	}
	expand() {
		this.setState({ title: 'group', value: null });
	}
	onChange(value) {
		console.log(value);
		this.setState({field: value});
	}
	render() {

		const selectOptions = [
			{ label: 'title', value: 'sentence' },
			{ label: 'date', value: 'publish_date' },
			{ label: 'story', value: 'story' },
		];

		const stories = ["Elections", "Syrian Migrant Crisis", "Iran Nuclear Deal"].map(function(story){
			return {label: story, value: story}
		});

		let elem;
		if (!this.state.field) {
			elem = null;
		} else if (this.state.field.label === 'title') {
			elem = (<TitleOperator ref="val"/>);
		} else if (this.state.field.label === 'date') {
			elem = (<DateRange ref="val"/>);
		} else if (this.state.field.label === 'story') {
			elem = (<span style={styles.inline}>is part of the following story
				<SimpleSelect
					ref="val"
					style={styles.inline}
					options={stories}
					placeholder="Select a field"/>
				</span>);
		}

		return (
			<div style={styles.inline}>
			<SimpleSelect
				style={styles.inline}
				onValueChange={this.onChange.bind(this)}
				options={selectOptions}
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
};


export default Radium(TextOperator);
