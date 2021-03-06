import React from 'react';
import Radium from 'radium';
import urlParse from 'url';
import request from 'superagent';
import async from 'async';
import Tabs from 'react-simpletabs';
import moment from 'moment';
import Loader from 'halogen/PulseLoader';
import outlier from 'outlier';
import _ from 'lodash';

let styles = {};

export default class Results extends React.Component {

	constructor(props) {
		super(props);
		this.state = { sources: {}, fetched: false };
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
			return { url: article.guid, source: sourceName, title: article.title, date: article.publish_date};
		});
	}
	fetchSource(query, source, callback) {

		const newQ = `${query.q} AND ${source.value}`;
		console.log('fetching!', newQ);
		request
			.post('/stories')
			.query({ q: newQ, fq: query.fq })
			.send({ q: newQ, fq: query.fq })
			.end(function(err, res) {
				console.log('fetched!!', source);
				// const articles = this.state.articles.concat(this.parseSource(source.label, res.body));
				const reqdata = JSON.parse(res.text).data;
				const articles = this.parseSource(source.label, reqdata);
				const sourceObj = this.state.sources;
				sourceObj[source.label] = { articles, fetched: true, name: source.label };
				this.setState({sources: sourceObj, fetched: true});
				this.forceUpdate();
				callback(null, articles);
			}.bind(this));
	}

	submitResults() {
		const story = this.props.name;
		const sourceNames = this.props.sources.map((source) => source.label);

		const flattenedArticles = Object.values(this.state.sources).map((source) => source.articles).reduce(function(a, b) { return a.concat(b); }, []);

		const newscloudURL = (document.location.hostname == "localhost") ? 'http://localhost:8083' :  'https://newsclouds.herokuapp.com';

    request
			.post(`${newscloudURL}/createStory`)
      .send({ story, articles: flattenedArticles, sourceNames })
			.end(function(err, res) {
				console.log('fetched!!');
				console.log(res);
				this.setState({saved: true});
			}.bind(this));
	}

	processOutliers() {
		const flattenedArticles = Object.values(this.state.sources).map((source) => source.articles).reduce(function(a, b) { return a.concat(b); }, []);
		const minDate = _.min(flattenedArticles, 'date').date;
		const dateDistribution = flattenedArticles.map((article) => moment(minDate).diff(moment(article.date),'days'));
		console.log(dateDistribution);

		const outliers = outlier(dateDistribution).findOutliers(); // [51]

		console.log(outliers);

		// dateSpread = moment(dateEnd).diff(moment(momentStart),'days')


	}

	render() {

		const newscloudURL = (document.location.hostname == "localhost") ? 'http://localhost:8083' :  'https://newsclouds.herokuapp.com';

		if (this.state.fetched) {
			this.processOutliers();
		}
		return (
			<div style={styles.overlay}>
				{(!this.state.saved) ?

				<span>

				<h1 style={styles.title}>Results
          <span style={[styles.button, styles.createButton]} onClick={this.submitResults.bind(this)}>Create</span>
        </h1>

				{
					(this.state.fetched) ?
					<Tabs key="tab">
						{
							Object.values(this.state.sources).map((sourceObj, index) => {
								const articleSources = sourceObj.articles;

								return (<Tabs.Panel key={sourceObj.name} title={`${sourceObj.name} (${sourceObj.articles.length})`}>
									<div key={`${sourceObj.name}-wrapper`}>
										{articleSources.map((article, articleIndex) => {
											return (<div key={article.url} style={styles.block}>
												<span key={`${article.title}button`} style={styles.button}>Use</span>
												<span>{moment(article.date).format("MMM Do YY")}</span>
												<a style={styles.link} href={article.url}>{article.title}</a>
											</div>);
										})}
								</div>
				        </Tabs.Panel>);
							})
						}
		      </Tabs>
					:
					<span key="loader" style={styles.loader}>
				 		<Loader color="#666" size="16px" margin="4px"/>
				 </span>
			}

				</span>

				: <div>
					<h2 style={styles.title}>Saved your NewsCloud "{this.props.name}"!</h2>
						<div>It may take 1-2 minutes for processing of the cloud to complete. <a style={{color:'#666'}} href={`${newscloudURL}/?story=${this.props.name}`}>See it here.</a></div>
				</div>}

			</div>
		);
	}
}

styles = {
	loader: {
		width: '100%',
		textAlign: 'center',
	},
	link: {
		color: '#222'
	},
	title: {
		color: '#666',
		marginBottom: '75px',
		fontWeight: 300,
		fontSize: '2em'
	},
	createButton: {
		float: 'right',
    fontSize: '0.50em',
		borderColor: '#666',
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
		left: '12%',
		top: 'calc(4em + 5vh)',
		width: '75vw',
		height: '85vh',
		overflow: 'scroll',
		backgroundColor: 'white',
		padding: '20px',
		boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)',
		zIndex: 1000,
	},
	block: {
		marginTop: '20px',
		whiteSpace: 'nowrap',
	}
};

export default Radium(Results);
