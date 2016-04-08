import React, { PropTypes } from 'react';
import Radium from 'radium';
import DatePicker from 'react-datepicker';

require('react-datepicker/dist/react-datepicker.css');

let styles = {};

function pad(number) {
	if (number < 10) {
		return '0' + number;
	}
	return number;
}


function toISOString(d) {
	console.log(d);
	return d.getUTCFullYear() +
		'-' + pad(d.getUTCMonth() + 1) +
		'-' + pad(d.getUTCDate()) +
		'T' + pad(d.getUTCHours()) +
		':' + pad(d.getUTCMinutes()) +
		':' + pad(d.getUTCSeconds()) +
		'Z';
}


class DateRangeOperator extends React.Component {
	constructor(props) {
		super(props);
		this.state = { firstDate: null, secondDate: null };
		this.value = this._value.bind(this);
	}
	_value() {
		// publish_date:[2010-10-01T00:00:00Z TO 2010-11-01T00:00:00Z]
		return { fq: `[${toISOString(this.state.firstDate._d)} TO ${toISOString(this.state.secondDate._d)}]` };
	}
	expand() {
		this.setState({ title: 'group', value: null });
	}
	handleFirstChange(date) {
		this.setState({ firstDate: date });
	}
	handleSecondChange(date) {
		this.setState({ secondDate: date });
	}
	render() {
		return (
			<span>
			<span style={styles.inline}>between
				<span style={styles.inline}>
				<DatePicker selected={this.state.firstDate} onChange={this.handleFirstChange.bind(this)}/>
				</span>
				and
				<span style={styles.inline}>
				<DatePicker selected={this.state.secondDate} onChange={this.handleSecondChange.bind(this)}/>
				</span>
				</span>
			</span>
		);
	}
}

styles = {
	inline: {
		display: 'inline-block',
		margin: '5px',
	}
};


export default Radium(DateRangeOperator);
