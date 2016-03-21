import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React, { PropTypes } from 'react';
import ajax from 'superagent';
import moment from 'moment';

const styles = {
inline: {
display: 'inline-block',
verticalAlign: 'middle'
}
};

function formatData(dataList) {
    var formattedData = [];
    for (var key in dataList[0].data){
        if (dataList[0].data[key] === parseInt(dataList[0].data[key], 10)){
        formattedData.push({});
        }
    }
    var namesList = [];
    for (var item in dataList){
        var object = dataList[item];
        var name = object.name;
        namesList.push(name);
        var i = 0;
        for (var key in object.data){
            if (object.data[key] === parseInt(object.data[key], 10)){
                formattedData[i]["name"] = key;
                formattedData[i][name] = object.data[key];
                formattedData[i]["amt"] = i;
                i += 1;
                
            }
        }
        
    }
    
    return formattedData;
    
    
}

const CompareLineChart = React.createClass({
                                          componentWillReceiveProps(nextProps) {
                                           
                                           this.state = {
                                           names: []
                                           };
                                           
                                           console.log(nextProps.query);
                                                let r = /title:(.*?)(?:AND|$|OR)/g;
                                                var str = nextProps.query.q;
                                                var match = r.exec(str);
                                                var titles = [];
                                                while(match != null){
                                                    titles.push(match[1]);
                                                    match = r.exec(str);
                                                }
                                           
                                           /*
                                            DATE PARSING:
                                            var str = nextProps.query.fq;
                                            fq looks like: publish_date:[2016-03-01T05:00:00Z TO 2016-03-10T05:00:00Z]
                                            ^assume ajax get includes this range
                                            */
                                           
                                           
                                           var unformattedData = [];
                                           var counter = 0;
                                           
                                           for(var title in titles){
                                                ajax
                                                .get('/graphData?title='+titles[title])
                                                .set('Content-Type', 'application/json')
                                                .end(function(err, res){
                                                if (err) {
                                                console.log(err);
                                                }
                                                unformattedData.push({name: titles[counter], data: res.body.split});
                                                    this.setState({names: titles});
                                                    this.setState({graphData: formatData(unformattedData)});
                                                     console.log("DEBUGGG");
                                                     console.log(unformattedData);
                                                     counter += 1;
                                                    
                                                     }.bind(this));
                                           
                                          
                                           }
                                          
                                           
                                           
                                                     
                                           },
                                          render () {
                                          return (
                                                  <div style={styles.inline}>
                                                  
                                                  {(this.state && this.state.graphData && this.state.names.length ==2) ?
                                                  
                                                    <LineChart width={900} height={250}
                                                    data={this.state.graphData}
                                                    margin={{top: 50, right: 30, left: 20, bottom: 5}}>
                                                    <XAxis dataKey="amt"/>
                                                    <YAxis/>
                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                    <Tooltip/>
                                                    <Legend />
                                                  <Line type="monotone" dataKey={this.state.names[0]} stroke="#8884d8" />
                                                  <Line type="monotone" dataKey={this.state.names[1]} stroke="#82ca9d" />
                                  
                                                    </LineChart>
                                                  :
                                                  <span></span>
                                                  }
                                                  
                                                  </div>
                                                  );
                                          }
                                          })


export default CompareLineChart;
