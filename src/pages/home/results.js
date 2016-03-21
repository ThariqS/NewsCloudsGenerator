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
	componentDidMount() {
		console.log('mounted!', this.props);

		if (this.props.sources && this.props.sources.length >= 1) {
			const sources = this.props.sources;
			const query = this.props.query;
			this.fetchSources(query, sources);
		}
	}
	componentWillReceiveProps(nextProps) {
		console.log('got new props', nextProps);

		if (nextProps.sources && nextProps.sources.length >= 1) {
			const sources = nextProps.sources;
			const query = nextProps.query;
			this.fetchSources(query, sources);
		}
	}
	fetchSources(query, sources) {
		const sourceFuncs = [];

		for (const source of sources) {
			sourceFuncs.push(this.fetchSource.bind(this, query, source));
		}
		async.series(sourceFuncs);
	}
	parseSource(sourceName, body) {
		return body.map((article) => {
			return { url: article.guid, source: sourceName, title: article.title };
		});
	}
	fetchSource(query, source, callback) {

		const newQ = `${query.q} AND ${source.value}`;
		console.log('fetching!', newQ);
		request
			.post('/stories')
			.send({ q: newQ, fq: query.fq })
			.end(function(err, res) {
				console.log('fetched!!');
				const articles = this.state.articles.concat(this.parseSource(source.label, res.body));
				this.setState({ articles });
				callback(null, articles);
			}.bind(this));
	}

	submitResults() {
		const story = this.props.name;
		const articles = this.state.articles;
		const sourceNames = this.props.sources.map((source) => source.label);

    request
			.post('http://localhost:8083/createStory')
      .send({ story, articles, sourceNames})
			.end(function(err, res) {
				console.log('fetched!!');
				console.log(res);
			}.bind(this));
	}
	render() {

		return (
			<div style={styles.overlay}>
				<h1 style={styles.title}>Results
          <span style={styles.button} onClick={this.submitResults.bind(this)}>Create</span>
        </h1>
				{
					this.state.articles.map((result, index) => {
						return (<div style={styles.block}>
							<span style={styles.button}>Yes</span>
							<span style={styles.button}>No</span>
							<a style={styles.link} href={result.url}>{result.title}</a>
						</div>);
					})
				}
			</div>
		);
	}
}

styles = {
	link: {
		color: '#222'
	},
	title: {
		color: '#666',
		marginBottom: '5vh',
		fontWeight: 300,
		fontSize: '2em'
	},
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
		left: '15%',
		top: '10vh',
		width: '70vw',
		height: '80vh',
		overflow: 'scroll',
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
