import React, { PropTypes } from 'react';
import Radium from 'Radium';
import {MultiSelect} from 'react-selectize';


let styles = {};

class SourceSelector extends React.Component {
	constructor(props) {
		super(props);
		this.getSources = this._getSources.bind(this);
		this.state = { value: props.value, sources: [] };
	}
	value() {
		return this.props.value;
	}
	onChange(sources) {
		this.setState({sources: sources});
	}
	_getSources() {
		return this.state.sources.map((source) => source.value);
	}
	render() {

		// title:trump AND title:rubio AND tags_id_media:8875027
		// title:trump AND title:rubio AND tags_id_media:8875027 AND tags_id_media:8875027
		// tags_id_media:8875027

		// 1092

		const options = [
			{label: 'NYTimes', value: 'media_id:1'},
			{label: 'Fox News', value: 'media_id:1092'},
			{label: 'CNN', value: 'media_id:1095'},
			{label: 'BBC', value: 'media_id:1094'},
			{label: 'BBC', value: 'media_id:1096'},
			{label: 'ABC', value: 'media_id:1091'},
			{label: 'Atlantic', value: 'media_id:1110'},
			{label: 'Info Tech Blogs', value: 'tags_id_media:8875034'},
			{label: 'European Media', value: 'tags_id_media:8876474'},
			{label: 'Popular US Blogs', value: 'tags_id_media:8875028'},
			{label: 'US Political Blogs - Conservative', value: 'tags_id_media:8875115'},
			{label: 'US Political Blogs - Liberal', value: 'tags_id_media:8875114'},
			{label: 'Top 25 main stream', value: 'tags_id_media:8875027'},
		];

		return (
			<div>
			<MultiSelect
				style={styles.inline}
				onValuesChange={this.onChange.bind(this)}
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
