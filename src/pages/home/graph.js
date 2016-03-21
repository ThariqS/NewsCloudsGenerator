import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React, { PropTypes } from 'react';
import ajax from 'superagent';


const styles = {
	inline: {
		display: 'inline-block',
		verticalAlign: 'middle'
	}
};

function formatData(data) {
    var i = 0;
    var formattedData = [];
    //name: date, pv: mentions amt: incremented by index
    for (var key in data){
        if (data[key] === parseInt(data[key], 10)){
            formattedData.push({name: key, pv: data[key], amt: i});
            i += 1;
        }};
    return formattedData;

}

const SimpleLineChart = React.createClass({
	componentWillReceiveProps(nextProps) {
		console.log(nextProps.title);

		if (!this.loading) {
			ajax
			.get('/graphData?title='+nextProps.title)
			.set('Content-Type', 'application/json')
			.end(function(err, res){
				if (err) {
					console.log(err);
				}
				this.loading = false;
				this.setState({graphData: formatData(res.body.split) });
			}.bind(this));
			this.loading = true;
		}

	},
	render () {
		return (
			<div style={styles.inline}>
				{ (this.state && this.state.graphData) ?
					<LineChart
						width={200}
						height={30}
						data={this.state.graphData}
						margin={{top: 3, right: 10, left: 10, bottom: 3}}>
							<CartesianGrid strokeDasharray="3 3"/>
							<Line type="monotone" dataKey="pv" dot={false} stroke="#8884d8" />
					</LineChart>
					:
					<span>Loading</span>
				}
			</div>
		);
	}
})

export default SimpleLineChart;
