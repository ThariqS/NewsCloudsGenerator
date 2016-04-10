import React, { PropTypes } from 'react';
import Radium from 'radium';
import OperatorWrapper from './wrapper';

let styles = {};

class Group extends React.Component {
	constructor(props) {
		super(props);
		this.operators = {};
		this.state = { operators: [
			{ type: 'title', value: '' },
			{ type: 'title', value: '' },
		] };
	}
	value() {
		const qs = [];
		const fqs = [];
		const joinOperator = this.refs.select.value;
		for (const operatorKey in this.operators) {
			const valueRef = this.operators[operatorKey];
			const valResult = valueRef.value();
			if (valResult.q) {
				qs.push(valResult.q);
			}
			if (valResult.fq) {
				fqs.push(valResult.fq);
			}
		}
		const q = qs.join(` ${joinOperator} `);
		const fq = fqs.join(` ${joinOperator} `);

		return { q, fq };
	}
	render() {

		return (
			<div style={styles.box}>
			<div>
			{this.state.operators.map((operator, index) =>
				<span>
					<OperatorWrapper ref={(ref) => this.operators[index] = ref} type={operator.type} value={operator.value}/>
					{(index === 0) ?
						<select style={styles.select} ref="select">
							<option value="AND">AND</option>
							<option value="OR">OR</option>
					</select>
					: null}
				</span>
			)}
		</div>
			</div>
		);
	}
}

styles = {
	box: {
		borderLeft: '#A5A5A5 solid 1px',
		marginLeft: '5px',
		marginTop: '10px'4
	},
	select: {
		marginLeft: '5px',
	},
	join: {
		float: 'left',
		marginLeft: '7px',
	}
};


export default Radium(Group);
