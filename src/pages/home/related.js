import React, { PropTypes } from 'react';
import ajax from 'superagent';

class RelatedTerms extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
        title: props.title,
        relatedData: []
        };
        
        
    }
    getData(){
        console.log("in get related data");
        ajax.get('/relatedTerms')
        .set('Content-Type', 'application/json')
        .end((error, response) => { console.log("this is running");
                                                                                                                                                                                                                          if (!error, response) => {
                                                                                                                                                                                                                          this.setState({relatedData: response.body});
                                                                                                                                                                                                                          console.log("Related Data", response.body);
                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                          console.log("Error", error);
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                          
                                                                                                                                                                                                                          });
    }
    
    render(){
        
        getData();
        return (
                <div>
                {(this.state) ?
                <strong>Related: {this.state.title}</strong>
                : <span></span>
                }
                </div>
                );
    }
}
export default RelatedTerms;
