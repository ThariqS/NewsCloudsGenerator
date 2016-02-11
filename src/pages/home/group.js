import React, { PropTypes } from 'react';
import Radium from 'Radium';
import OperatorWrapper from './wrapper'
import {SimpleSelect} from 'react-selectize';

let styles = {};

class Group extends React.Component {
	constructor(props) {
		super(props);
		this.state = { operators: [
			{ type: 'title', value: '' },
			{ type: 'title', value: '' },
		] };
	}
	value() {
		let qs = [];
    let fqs = [];
		for (const valueRef of this.values) {
      const valResult = valueRef.value();
      if (valResult.q) {
        qs.push(valResult.q);
      }
      if (valResult.fq) {
        qs.push(valResult.fq);
      }
		}
    const q = qs.join(" AND ");
    const fq = fqs.join(" AND ");

		return {q: q, fq: fq};
	}
	render() {

		return (
			<div style={styles.box}>
      <div>
			{this.state.operators.map((operator, index) =>
        <span>
         <OperatorWrapper type={operator.type} value={operator.value}/>
         {(index === 0) ?
           <select>
           <option value="volvo">AND</option>
           <option value="saab">OR</option>
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
    marginTop: '10px'
  },
  join: {
    float: 'left',
    marginLeft: '7px',
  }
}


export default Radium(Group);
