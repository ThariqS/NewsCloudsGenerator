import React from 'react';
import Radium from 'Radium';
import urlParse from 'url';
import request from 'superagent';
import async from 'async';

let styles = {};

export default class Results extends React.Component {

	constructor(props) {
		super(props);
		this.state = { articles: [] };
	}
	componentWillReceiveProps(nextProps) {
		console.log('got new props', nextProps);

		if (nextProps.sources && nextProps.sources.length >= 1) {
			const sources = nextProps.sources;
			const query = nextProps.query;

			const sourceFuncs = [];

			for (const source of sources) {
				sourceFuncs.push(this.fetchSource.bind(this, query, source));
			}
			async.series(sourceFuncs);
			debugger;
		}
	}
	parseSource(sourceName, body) {
		return body.map((article) => {
			return { url: article.guid, source: article.source, title: article.title };
		});
	}
	fetchSource(query, source, callback) {

		const newQ = `${query.q} AND ${source.value}`;
		console.log('fetching!', newQ);
		request
			.post('/stories')
			.send({ q: newQ, fq: query.fq })
			.end(function(err, res){
				console.log('fetched!!');
				const articles = this.state.articles.concat(this.parseSource(source.label, res.body));
				this.setState({articles: articles});
				callback(null, articles);
			}.bind(this));
	}
	render() {

		return (
			<div style={styles.overlay}>
				<h1>Results</h1>
				{
					this.state.articles.map((result, index) => {
						return (<div style={styles.block}>
							<span style={styles.button}>Yes</span>
							<span style={styles.button}>No</span>
							{hostName} - <a href={result.url}>{result.title}</a>
						</div>);
					})
				}
			</div>
		);
	}
}

styles = {
	button: {
		display: 'inline-block',
		color: '#666',
		border: '2px solid black',
		margin: '0px 5px',
		padding: '3px',
		minWidth: '50px',
		textAlign: 'center',
		cursor: 'pointer',
	},
	overlay: {
		position: 'fixed',
		left: '25%',
		top: '25%',
		width: '50vw',
		height: 'auto',
		backgroundColor: 'white',
		padding: '20px',
		boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)',
		zIndex: 1000,
	},
	block: {
		marginTop: '20px',
	}
};

export default Radium(Results);
