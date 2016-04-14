import { ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
        var maxVal = 0;
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
                    formattedData[momenty]["box"] = 0;
                    if (object.data[key] > maxVal){
                        maxVal = object.data[key];
                    }
                }
            }
        }
        moments.sort();
        var formattedList = [];
        for (var i = 0; i < moments.length; i++){
            formattedList.push(formattedData[moments[i]]);
        }
    return {data: formattedList, lines: lines, maxValue: maxVal};
}

function formatBox(data, start, end, maxVal){
    var starty = start.valueOf();
    var endy = end.valueOf();
    for (var i = 0; i < data.length; i++){
        if (data[i].amt >= starty && data[i].amt <= endy){
            data[i]["box"] = maxVal;
        }
    }
    
    return data;
}


const CompareLineChart = React.createClass({
    componentWillReceiveProps(nextProps){
        this.setState({unformattedData: []});
        let r = /title:(.*?)(?:AND|$|OR)/g;
        var str = nextProps.query.q;
        var match = r.exec(str);

        //Getting date range
        let reg = /publish_date:(.*?)(?:])/g
        var dateReg = reg.exec(nextProps.query.fq);
        if (dateReg != null){
                                           console.log(dateReg);
                                           var chunk = dateReg[1].substring(1);
                                           
                                           let getFirst = /(.*?) TO/g
                                           var startDate = moment(getFirst.exec(chunk)[1]);
                                           let getSecond = /TO (.*)/g
                                           var endDate = moment(getSecond.exec(chunk)[1]);
                                           this.setState({start: startDate, end: endDate});
                                           
        }

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
        const {data, lines, maxValue} = formatData(results);
        this.setState({graphData: data, lines: lines});
        if (this.state.end && this.state.start){
            var box_data = formatBox(data, this.state.start, this.state.end, maxValue);
            this.setState({graphData: box_data});
        }
        
    },
    render() {
        
    
        return(
        <div style={styles.inline}>
                                                   
        {(this.state && this.state.graphData) ?
                                                   
            <ComposedChart width={900} height={250}
             data={this.state.graphData}
             margin={{top: 50, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="name"/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            

            {this.state.lines.map((name, index) => (
                (<Line type = "monotone" dataKey= {name} stroke= {Strokes(index)}/>)))}
               
            <Area type ='stepBefore' dataKey = 'box' fill = 'rgba(50,50,50,0.1)' stroke='rgba(50,50,50,.0.1)'/>

            </ComposedChart>
            :
            <span></span>
        }
                                                   
        </div>

        
        );
    }

})
function Strokes(index){
    let strokes = ["#8884d8", "#d88884", "#D7BF2E", "#4b4b47", "#2A83D4"];
    var i = index % strokes.length;
    return strokes[i];
    
}


export default CompareLineChart;

