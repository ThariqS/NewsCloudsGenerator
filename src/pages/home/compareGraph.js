import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React, { PropTypes } from 'react';
import ajax from 'superagent';
import moment from 'moment';
import async from 'async';

const styles = {
    inline: {
        display: 'inline-block',
        verticalAlign: 'middle'
    }
};

function fetchGraphData(query, callback){
        ajax.get('/graphData?title=' + query)
        .set('Content-Type', 'application/json')
        .end(function(err, res){
            if(err){
                console.log(err);
            }
            //Need some sort of callback function
            callback(err,{"name": query, "data": res.body.split});
        
        })
    }


function formatData(dataList){
        var formattedData = [];
        //Initialize to the right size- can probs fins a better way to do this
        for (var key in dataList[0].data){
            if (dataList[0].data[key] === parseInt(dataList[0].data[key], 10)){
                formattedData.push({});
                }
        }
        var lines = [];
        for (var i = 0; i < dataList.length; i++){
            var object = dataList[i];
            var name = object.name;
            lines.push(name);
            var j = 0;
            for (var key in object.data){
                if (object.data[key] === parseInt(object.data[key], 10)){
                    formattedData[j]["name"] = key;
                    formattedData[j][name] = object.data[key];
                    formattedData[j]["amt"] = j;
                    j +=1;
                }
            }
        }
    return {data: formattedData, lines: lines};
}


const CompareLineChart = React.createClass({
    componentWillReceiveProps(nextProps){
        this.setState({unformattedData: []});
        let r = /title:(.*?)(?:AND|$|OR)/g;
        var str = nextProps.query.q;
        var match = r.exec(str);
        var titles = [];
        while(match != null){
            titles.push(match[1]);
            match = r.exec(str);
        }
        //TODO: date query shit (see bottom)
        var loading = false;
        async.map(titles,fetchGraphData, this.getAJAXResults);
        
                },
                
    getAJAXResults(err, results) {
        const {data, lines} = formatData(results);
        this.setState({graphData: data, lines: lines});
    },
    render() {
    
        return(
        <div style={styles.inline}>
                                                   
        {(this.state && this.state.graphData) ?
                                                   
            <LineChart width={900} height={250}
             data={this.state.graphData}
             margin={{top: 50, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="amt"/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />

            {this.state.lines.map((name, index) => (
                (<Line type = "monotone" dataKey= {name} stroke= {Strokes(index)}/>)))}
        
            </LineChart>
            :
            <span></span>
        }
                                                   
        </div>

        
        );
    }

})
function Strokes(index){
    let strokes = ["#8884d8", "#82ca9d", "#3334d8"]; //make more line colors/mod it
    var i = index % strokes.length;
    return strokes[i];
    
}


export default CompareLineChart;


/*
DATE PARSING:
var str = nextProps.query.fq;
fq looks like: publish_date:[2016-03-01T05:00:00Z TO 2016-03-10T05:00:00Z]
 ^assume ajax get includes this range
 */
