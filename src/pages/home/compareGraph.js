import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React, { PropTypes } from 'react';
import ajax from 'superagent';


const styles = {
inline: {
display: 'inline-block',
verticalAlign: 'middle'
}
};

function formatData() {
    console.log("running compare graph");
    const formattedData =  [
                            {name: '2015-12-29T00:00:00Z', trump: 6305, cruz: 1726, amt: 0, rubio: 1540},
                            {name: '2015-12-29T00:00:00Z', trump: 5313, cruz: 1319, amt: 1, rubio: 1042},
                            {name: '2015-12-29T00:00:00Z', trump: 4595, cruz: 1004, amt: 2, rubio: 976},
                            {name: '2015-12-29T00:00:00Z', trump: 16620, cruz: 4137, amt: 3, rubio: 1977},
                            {name: '2015-12-29T00:00:00Z', trump: 6497, cruz: 2512, amt: 4, rubio: 1360},
                            {name: '2015-09-01T00:00:00Z', trump: 6786, cruz: 701, amt: 5, rubio: 517},
                            {name: '2016-01-12T00:00:00Z', trump: 10416, cruz: 7609, amt: 6, rubio: 2936},
                            {name: '2015-12-15T00:00:00Z', trump: 11208, cruz: 5068, amt: 7, rubio: 3285},
                            {name: '2015-12-22T00:00:00Z', trump: 5501, cruz: 1815, amt: 8, rubio: 837},
                            {name: '2015-09-22T00:00:00Z', trump: 6862, cruz: 1432, amt: 9, rubio: 1346},
                            {name: '2015-11-03T00:00:00Z', trump: 5948, cruz: 1319, amt: 10, rubio: 2448},
                            {name: '2016-02-16T00:00:00Z', trump: 13773, cruz: 6735, amt: 11, rubio: 5880},
                            {name: '2015-10-27T00:00:00Z', trump: 5705, cruz: 2124, amt: 12, rubio: 4258},
                            {name: '2015-10-27T00:00:00Z', trump: 5826, cruz: 1896, amt: 13, rubio: 1467},
                            {name: '2016-01-19T00:00:00Z', trump: 11859, cruz: 6136, amt: 14, rubio: 1926},
                            {name: '2016-01-05T00:00:00Z', trump: 7936, cruz: 4157, amt: 15, rubio: 2155},
                            {name: '2016-01-05T00:00:00Z', trump: 8740, cruz: 1661, amt: 16, rubio: 466},
                            {name: '2016-02-23T00:00:00Z', trump: 23886, cruz: 7178, amt: 17, rubio: 8886},
                            {name: '2016-02-09T00:00:00Z', trump: 11807, cruz: 5190, amt: 18, rubio: 4355},
                            {name: '2016-02-09T00:00:00Z', trump: 11875, cruz: 8109, amt: 19, rubio: 7586},
                            {name: '2015-09-15T00:00:00Z', trump: 12856, cruz: 1563, amt: 20, rubio: 1368},
                            {name: '2015-09-15T00:00:00Z', trump: 5084, cruz: 948, amt: 21, rubio: 1008},
                            {name: '2015-10-06T00:00:00Z', trump: 4329, cruz: 891, amt: 22, rubio: 1102},
                            {name: '2015-11-10T00:00:00Z', trump: 5956, cruz: 2995, amt: 23, rubio: 3330},
                            {name: '2016-01-26T00:00:00Z', trump: 18525, cruz: 8561, amt: 24, rubio: 4214},
                            {name: '2015-10-20T00:00:00Z', trump: 5418, cruz: 901, amt: 25, rubio: 1170},
    
                                      ];
    return formattedData;
    
}

const CompareLineChart = React.createClass({
                                          //componentWillReceiveProps(nextProps) {
                                          //console.log(nextProps.title);
                                          
                                          //this.setState({graphData: formatData()});
                                          
                                          //},
                                          render () {
                                          return (
                                                  <div style={styles.inline}>
                                                  
                                                  <LineChart width={900} height={250}
                                                  data={formatData()}
                                                  margin={{top: 50, right: 30, left: 20, bottom: 5}}>
                                                  <XAxis dataKey="amt"/>
                                                  <YAxis/>
                                                  <CartesianGrid strokeDasharray="3 3"/>
                                                  <Tooltip/>
                                                  <Legend />
                                                  <Line type="monotone" dataKey="trump" stroke="#8884d8" />
                                                  <Line type="monotone" dataKey="cruz" stroke="#82ca9d" />
                                                  <Line type="monotone" dataKey="rubio" stroke="#FFC0CB" />
                                                  </LineChart>
                                                  
                                                  </div>
                                                  );
                                          }
                                          })


export default CompareLineChart;
