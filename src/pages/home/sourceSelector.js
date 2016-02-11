import React, { PropTypes } from 'react';
import Radium from 'Radium';
import {MultiSelect} from 'react-selectize';


let styles = {};

class SourceSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.value };
	}
	value() {
		return this.props.value;
	}
	onChange(sources) {
		this.setState({sources: sources});
	}
	getSources() {
		return this.state.sources.map((source) => source.value);
	}
	render() {

		const options = [
			{label: 'Fox', value: 'media_sets_id:1'},
			{label: 'BBC', value: 'media_sets_id:1'},
			{label: 'New York Times', value: 'media_sets_id:1'},
			{label: 'Top 25 main stream', value: 'media_sets_id:1'},
		];

		return (
			<div>
			<MultiSelect
				style={styles.inline}
				onValueChange={this.onChange.bind(this)}
				options={options}
				maxValues={3}
				placeholder="Select up to 3 sources"/>

			</div>
		);
	}
}

styles = {
	inline: {
		display: 'inline-block',
		margin: '5px',
		width: '40vw'
	}
};


export default Radium(SourceSelector);
