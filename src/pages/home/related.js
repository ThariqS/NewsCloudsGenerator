import React, { PropTypes } from 'react';
import ajax from 'superagent';


const styles = {
inline: {
display: 'inline-block',
verticalAlign: 'middle'
}
};
function formatData(data) {
    var relatedWords = [];
    for (var chunk in data){
        relatedWords.push(data[chunk].term);
            }
    relatedWords.shift();
    return relatedWords
    
}


const RelatedData = React.createClass({
                                          componentWillReceiveProps(nextProps) {
                                          console.log(nextProps.title);
                                          
                                          if (!this.loading) {
                                          console.log('Fetching data!');
                                          ajax
                                          .get('/relatedTerms?title='+nextProps.title)
                                          .set('Content-Type', 'application/json')
                                          .end(function(err, res){
                                               if (err) {
                                               console.log(err);
                                               }
                                               this.loading = false;
                                               console.log('Got Data!', res.body);
                                           
                                               this.setState({relatedData: formatData(res.body) });
                                               }.bind(this));
                                          this.loading = true;
                                          }
                                          
                                          },
                                          render () {
                                          return (
                                                  <div style={styles.inline}>
                                                  <strong>Related:</strong>
                                                  {(this.state && this.state.relatedData) ?
                                                  <span>

                                                  {this.state.relatedData.map((person, index) =>
                                                                              <span> {person},</span>)}
                                                  </span>
                                                  : <span>Loading</span>
                                                  }
                                                  </div>
                                                  );
                                          }
                                          })

export default RelatedData;
