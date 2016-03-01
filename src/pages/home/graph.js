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
	return [
		{ name: 'Page A', pv: 2400, amt: 2400 },
		{ name: 'Page B', pv: 1398, amt: 2210 },
		{ name: 'Page C', pv: 9800, amt: 2290 },
		{ name: 'Page D', pv: 3908, amt: 2000 },
		{ name: 'Page E', pv: 4800, amt: 2181 },
		{ name: 'Page F', pv: 3800, amt: 2500 },
		{ name: 'Page G', pv: 4300, amt: 2100 },
	];
}

const SimpleLineChart = React.createClass({
	componentWillReceiveProps(nextProps) {
		console.log(nextProps.title);

		if (!this.loading) {
			console.log('Fetching data!');
			ajax
			.get('/graphData?title='+nextProps.title)
			.set('Content-Type', 'application/json')
			.end(function(err, res){
				if (err) {
					console.log(err);
				}
				this.loading = false;
				console.log('Got Data!', res.body);
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
