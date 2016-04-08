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
        var formattedData = {};
        var lines = [];
        var moments = [];
        for (var i = 0; i < dataList.length; i++){
            var object = dataList[i];
            var name = object.name;
            lines.push(name);
            
            for (var key in object.data){
                if (object.data[key] === parseInt(object.data[key], 10)){
                    var momenty = moment(key).valueOf();
                    if (!(momenty in formattedData)){
                        formattedData[momenty] = {};
                        formattedData[momenty]["name"]= moment(key).format('MM/DD/YY')
                        moments.push(momenty);
                        }
                    formattedData[momenty][name] = object.data[key];
                    formattedData[momenty]["amt"] = momenty;
                }
            }
        }
        moments.sort();
        var formattedList = [];
        for (var i = 0; i < moments.length; i++){
            formattedList.push(formattedData[moments[i]]);
        }
    return {data: formattedList, lines: lines};
}


const CompareLineChart = React.createClass({
    componentWillReceiveProps(nextProps){
        this.setState({unformattedData: []});
        let r = /title:(.*?)(?:AND|$|OR)/g;
        var str = nextProps.query.q;
        var match = r.exec(str);
        
        //Getting date range
        let reg = /publish_date:(.*?)(?:])/g
        console.log("DATE INPUT");
        var chunk = reg.exec(nextProps.query.fq)[1].substring(1);
        let getFirst = /(.*?) TO/g
        var startDate = moment(getFirst.exec(chunk)[1]);
        let getSecond = /TO (.*)/g
        var endDate = moment(getSecond.exec(chunk)[1]);
        console.log(startDate);
        console.log(endDate);

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
            <XAxis dataKey="name"/>
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
    let strokes = ["#8884d8", "#82ca9d", "#3334d8"]; //make more line colors!!!!!!
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
