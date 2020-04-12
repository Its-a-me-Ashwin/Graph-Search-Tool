import React, { Component } from 'react';
import Canvas from './canvas'
import { Link } from 'react-router-dom';
//import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import Graph from 'vis-react';

var Background = "../backgroundPic.jpg";
var sectionStyle = {
    width: "100%",
    height: "400px",
    backgroundImage: `url(${Background})`,
    color : "black"
};


class Counter extends Component {
    state = { 
        nodeData : [], /*
                        {"name" : name,
                        "huristic" : huri,
                        "x_pos" : x,added 
                        "y_pos" : y}*/
        weightData : [], /*
                        {"name": src +dst, 
                        "src" : src,  // key = src + dst
                        "dst" : dst,
                        "weight" : weight
                        }*/
        graph : {
            nodes : [],
            edges : []
                },
        serverStatus : false,
        step : [],
        dfsInfo : '',
        ucsInfo : '',
        dksInfo : '',
        default : {
            layout: {
                hierarchical: true
            },
            edges: {
                color: 'red'
            },
            interaction: { hoverEdges: true }
                }
    };
    styleCenter = {textAlign : "center"}
    styleLeft = {textAlign : "left"}
    styleBg = {color : "blue"}
    cloneTags
    constructor (){
        super();
        this.addNode = this.addNode.bind(this); 
        this.addEdge = this.addEdge.bind(this); 
        this.resetGraph = this.resetGraph.bind(this);
        this.displayGraph = this.displayGraph.bind(this);
        this.task = this.task.bind(this);
        this.sendTestApiCall = this.sendTestApiCall.bind(this);
        this.sendDfsApiCall = this.sendDfsApiCall.bind(this);
        this.sendDijkstraApiCall = this.sendDijkstraApiCall.bind(this);
        //this.getInfo = this.getInfo.bind(this);
        this.getInfoApi = this.getInfoApi.bind(this);

    }

    getInfoApi(algo)
    {
        var url = "http://127.0.0.1:8081/api/v1/info/" + algo;
        console.log(url)
        if (typeof(url) == undefined)
            return;
        var result;
        fetch(url, {
        method: 'POST',
        body: {},
        }).then((response) => response.json()).then(
            (responseJson) => 
            {
                result = responseJson;
                switch(algo)
                {
                    case "dfs": 
                                if (this.state.dfsInfo.length === 0)
                                {
                                    this.setState({dfsInfo : result["data"]}); 
                                    break;
                                }
                                else
                                {
                                    this.setState({dfsInfo : ''});
                                    break;
                                }
                    case "ucs": 
                                if (this.state.ucsInfo.length === 0)
                                {
                                    this.setState({ucsInfo : result["data"]}); 
                                    break;
                                }
                                else
                                {
                                    this.setState({ucsInfo : ''});
                                    break;
                                }
                    case "dks": 
                                if (this.state.dksInfo.length === 0)
                                {
                                    this.setState({dksInfo : result["data"]}); 
                                    break;
                                }
                                else
                                {
                                    this.setState({dksInfo : ''});
                                    break;
                                }
                    default:
                        alert("Client Error pls refresh")
                }
            }
        );
    }

    task(delay) { 
        var d = new Date();
        var n =  d.getSeconds();
        while (Math.abs(new Date().getSeconds() - n)<delay);
      } 

    checkPostion(arr,a)
    {
        for (let i =0;i < arr.length; ++i)
        {
            if (arr[i] == a) return true;
        }
        return false;
    }
    findId (list,label)
    {
        for (let i =0; i < list.length; ++i)
        {
            if (list[i]['label'] == label)
                return list[i]['id'];
        }
        return 'NO';
    }

    /*
        api to test if server is up
    */
    sendTestApiCall (url,bodyJson)
    {
        if (typeof(url) == undefined || typeof(bodyJson) == undefined)
            return;

        var result;
        fetch(url, {
        method: 'POST',
        body: bodyJson,
        }).then((response) => response.json()).then(
            (responseJson) => 
            {
                result = responseJson;
                //console.log("Status:",result["Status"]);
                if (result["Status"] === "Online"){ this.setState({serverStatus :true})}
                else alert("Server Offline!!!");
            }
        );
    }
    /*
        function to call the test API
    */
    testApi ()
    {
        var bodyData = {}
        this.sendTestApiCall('http://127.0.0.1:8080/api/v1/test',bodyData);
    }

    sendDijkstraApiCall (url,bodyJson)
    {
        
        if (typeof(url) == undefined || typeof(bodyJson) == undefined)
            return;
        var result;
        fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
                },
        body: JSON.stringify(bodyJson),
        }).then((response) => response.json()).then(
            (responseJson) => 
            {
                result = responseJson;
                console.log("Return Data :",result["Result"]);
                if (result["Result"] === "Yes")
                {
                    console.log("Path")
                }
                else
                {
                    console.log("No Path")
                }
                var items = Object.keys(result).map(function(key) {
                    return [key, result[key]];
                });  
                // Sort the array based on the second element
                items.sort(function(first, second) {
                    return first[1] - second[1];
                });
                console.log(items)
                for (let i =0; i < items.length; ++i)
                {
                   if (items[i][0] === "Result") continue;
                   this.setState({step : items[i][0]});
                   /// ADD THE GAY DELAY
                }
            }
        );   
    }

    // fx this shit
    DijkstraApi (src,dst)
    {
        var bodyData = {
            "nodes" : [],
            "weights" : [],
            "edges": [],
            "src" : src,
            "dst": dst
        }
        for (let i = 0;i < this.state.nodeData.length; ++i)
        {
            bodyData["nodes"].push(this.state.nodeData[i]["name"]); // Name
        }
        for (let i = 0;i < this.state.weightData.length; ++i)
        {
            bodyData["edges"].push([this.state.weightData[i]["src"],this.state.weightData[i]["dst"]]); // Name
            bodyData["weights"].push(this.state.weightData[i]["weight"]);
        }
        //console.log(bodyData);
        return this.sendDijkstraApiCall('http://127.0.0.1:8080/api/v1/dijkstra',bodyData);
    }

    sendDfsApiCall (url,bodyJson)
    {
        if (typeof(url) == undefined || typeof(bodyJson) == undefined)
            return;
        var result;
        fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
                },
        body: JSON.stringify(bodyJson),
        }).then((response) => response.json()).then(
            (responseJson) => 
            {
                result = responseJson;
                console.log("Return Data :",result);
                {this.renderGraph()}              
                if (result["Result"] === "Yes")
                {
                    console.log("Path")
                }
                else
                {
                    console.log("No Path")
                }
                var items = result["Graph"];
                console.log(items);
                for (let i =0; i < items.length; ++i)
                {
                    this.setState({step: items[i]});
                }
            }
        );   
    }

    DfsApi (src,dst)
    {
        var bodyData = {
            "nodes" : [],
            "weights" : [],
            "edges": [],
            "src" : src,
            "dst": dst
        }
        for (let i = 0;i < this.state.nodeData.length; ++i)
        {
            bodyData["nodes"].push(this.state.nodeData[i]["name"]); // Name
        }
        for (let i = 0;i < this.state.weightData.length; ++i)
        {
            bodyData["edges"].push([this.state.weightData[i]["src"],this.state.weightData[i]["dst"]]); // Name
            bodyData["weights"].push(this.state.weightData[i]["weight"]);
        }
        //console.log(bodyData);
        return this.sendDfsApiCall('http://127.0.0.1:8080/api/v1/dfs',bodyData);
    }

    sendUcsApiCall (url,bodyJson)
    {
        if (typeof(url) == undefined || typeof(bodyJson) == undefined)
            return;
        var result;
        fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
                },
        body: JSON.stringify(bodyJson),
        }).then((response) => response.json()).then(
            (responseJson) => 
            {
                result = responseJson;
                console.log("Return Data :",result);
                {this.renderGraph()}              
                if (result["Result"] === "Yes")
                {
                    console.log("Path")
                }
                else
                {
                    console.log("No Path")
                }
                var items = result["Graph"];
                console.log(items);
                for (let i =0; i < items.length; ++i)
                {
                    this.setState({step: items[i]});
                }
            }
        );   
    }

    UniformApi (src,dst)
    {
        var bodyData = {
            "nodes" : [],
            "weights" : [],
            "edges": [],
            "src" : src,
            "dst": dst
        }
        for (let i = 0;i < this.state.nodeData.length; ++i)
        {
            bodyData["nodes"].push(this.state.nodeData[i]["name"]); // Name
        }
        for (let i = 0;i < this.state.weightData.length; ++i)
        {
            bodyData["edges"].push([this.state.weightData[i]["src"],this.state.weightData[i]["dst"]]); // Name
            bodyData["weights"].push(this.state.weightData[i]["weight"]);
        }
        //console.log(bodyData);
        return this.sendUcsApiCall('http://127.0.0.1:8081/api/v1/Uniform',bodyData);
    }


    renderNodesList () {
        if (this.state.nodeData.length === 0) return <p> No nodes added </p>;
        else return <ul> {this.state.nodeData.map ( tag => <li key = {tag["name"]}> {"Name: " + tag["name"] + "  Huristic:  " +tag["huristic"]} </li> )} </ul>
    }

    renderEdgesList () {
        if (this.state.weightData.length === 0) return <p> No Edges added </p>;
        else return <ul> {this.state.weightData.map ( tag => <li key = {tag["name"]}> {"Source:" + tag["src"] + " Destination:" +  tag["dst"] + "Weight" + tag["weight"]} </li> )} </ul>
    }

    makeNode (name,huri,x,y){
        return {"name" : name,
                "huristic" : huri,
                "x_pos" : x,
                "y_pos" : y}
    }

    makeEdge (src,dst,weight)
    {
        return {
                "name": src + dst,
                "src" : src,  // key = src + dst
                "dst" : dst,
                "weight" : weight
        };
    }

    addNode(name,huri,x=0,y=0){
        let data = name;
        if (typeof(data) == undefined || typeof(huri) == undefined || typeof(x) == undefined || typeof(y) == undefined) 
            return ; // no data given
        var check = [];
        for (let i =0; i < this.state.nodeData.length; ++i)
        {
            check.push(this.state.nodeData[i]["name"]);
        }
        if (check.indexOf(data) < 0)
        {
            var nodeDatal = this.makeNode(name,huri,x,y)
            let clonenodeData = Array.from(this.state.nodeData)
            this.state.nodeData = clonenodeData;
            this.setState({tag : clonenodeData})
            clonenodeData.push(nodeDatal);
        }
    }


    addEdge (src,dst,weight)
    {
        if (typeof(src) == undefined || typeof(dst) == undefined || typeof(weight) == undefined)
        {
            return; // invalid
        }
        else
        {
            var checkData = [];
            for (let i =0; i < this.state.nodeData.length; ++i)
            {
                checkData.push(this.state.nodeData[i]["name"]);
            }

            if (checkData.indexOf(src) < 0 || checkData.indexOf(dst) < 0)
            {
                return ;
            }

            var check = [];
            for (let i =0; i < this.state.weightData.length; ++i)
            {
                check.push(this.state.weightData[i]["name"]);
            } 
            if (check.indexOf(src+dst) < 0)
            {
                var weightDatal = this.makeEdge(src,dst,weight);
                let cloneweightDatal = Array.from(this.state.weightData)
                this.state.weightData = cloneweightDatal;
                this.setState({tag : cloneweightDatal})
                cloneweightDatal.push(weightDatal);
            }
        }
    }


    renderGraph()
    {
        return <div>
            <Graph
                    graph={this.displayGraph()}
                    options={this.state.default}
                />     
        </div>
    }

    displayGraph ()
    {
        var graph = {
            nodes : [],
            edges : []
        };
        console.log("In display",this.state.step);
        var j = 1;
        var color;
        var visited = this.state.step;
        for (let i =0; i < this.state.nodeData.length; ++i)
        {
            if (this.checkPostion(visited,this.state.nodeData[i]["name"]))
            {
                color = "red";
            }
            else
            {
                color = "green";
            }
            //console.log(this.state.nodeData[i]["name"],visited);
            graph.nodes.push(
                {
                    id : j,
                    label : this.state.nodeData[i]["name"],
                    color : color
                }
            );
            j = j+1;
        }
        for (let i =0; i < this.state.weightData.length; ++i)
        {
            let source = this.findId(graph.nodes,this.state.weightData[i]["src"]);
            let dest = this.findId(graph.nodes,this.state.weightData[i]["dst"]);
            //console.log(this.state.weightData[i]["src"],this.state.weightData[i]["dst"],this.state.nodeData);
            if (source === 'NO' || dest === 'NO')
            {
                console.log("Client Error");
                return {};
            }
            if (this.checkPostion(visited,this.state.nodeData[i]["name"]))
            {
                color = "red";
            }
            else
            {
                color = "green";
            }
            graph.edges.push(
                {
                    color : color,
                    from : source,
                    to : dest
                }
            );
        }
        return JSON.parse(JSON.stringify(graph));
    }
    

    getBadge()
    {
        let classes = "badge m-2 badge-";
        classes += (this.state.serverStatus) ? "primary" : "warning";
        return classes;
    }

    getBtn ()
    {
        let classes = "btn btn-sm btn-";
        if (this.state.nodeData.length === 0 && this.state.weightData.length === 0)
        {
            classes += "success";
        } 
        else{
            classes += "danger  ";
        }
        return classes;
    }

    resetGraph()
    {
        this.setState({nodeData : []});
        this.setState({weightData : []});
    }

    renderInfo (algo)
    {
        switch(algo)
        {
                    case "dfs": 
                                console.log("dfs info render");
                                return (
                                    <div>
                                        <p> {this.state.dfsInfo} </p>
                                        <hr/>
                                    </div>
                                );
                    case "ucs": return (
                        <div>
                            <p> {this.state.ucsInfo} </p>
                            <hr/>
                            </div>
                        );
                    case "dks": return (
                        <div>
                            <p> {this.state.dksInfo} </p>
                            <hr/>
                                </div>
                            );
                    default:
                        alert("Client Error pls refresh")
        }
    }

    lessMore (algo)
    {
        switch (algo)
        {
            case 'dfs':
                if (this.state.dfsInfo.length === 0)
                    return "More Info";
                else
                    return "Less Info";
            case 'dks':
                if (this.state.dksInfo.length === 0)
                    return "More Info";
                else
                    return "Less Info";
            case 'ucs':
                if (this.state.dfsInfo.length === 0)
                    return "More Info";
                else
                    return "Less Info";
        }
    }
    render() { 
        return (
            <div style = {sectionStyle} className = "bg-bl"> 
                <h1 style = {this.styleCenter} className = "shadow-sm p-3 mb-5 bg-white rounded bg-dark"> Graph Search Tool </h1>
                <h2 style = {this.styleLeft} > Add the Nodes </h2>
                <input type = "text" ref = "nodeName" placeholder = "Enter Node Name"/>
                <input type = "text" ref = "nodeHuri" placeholder = "Enter Hursitic to goal"/>
                <button onClick = {() => this.addNode(this.refs.nodeName.value,this.refs.nodeHuri.value)} className = "btn btn-primary btn-sm"> Add Node </button>
                <hr/>

                <h2 style = {this.styleLeft} > Add the Edges </h2>
                <input type = "text" ref = "edgeSrc" placeholder = "Enter Src"/>
                <input type = "text" ref = "edgeDst" placeholder = "Enter Dst"/>
                <input type = "text" ref = "edgeWeight" placeholder = "Enter weight"/>
                <button onClick = {() => this.addEdge(this.refs.edgeSrc.value,this.refs.edgeDst.value,this.refs.edgeWeight.value)} className = "btn btn-primary btn-sm"> Add Node </button>
                <hr/>

                <button className = {this.getBtn()} onClick = {() => this.resetGraph()}>Reset Graph</button>

                <h2> Graph generated: </h2>
                {this.renderNodesList()}
                {this.renderEdgesList()}
                <hr/>
                <h2 style = {this.styleCenter}> The Graph </h2>

                <Graph
                    graph={this.displayGraph()}
                    options={this.state.default}
                />     
                <hr/>
                <h2> Enter the Source and Destination </h2>
                <span className = {this.getBadge()}> Server </span>
                <button onClick = {() => this.testApi()} className = "btn btn-info btn-sm"> Check Server </button>
                <hr/>
                <input type = "text" ref = "src" placeholder = "Enter src"/>
                <input type = "text" ref = "dst" placeholder = "Enter dst"/>
                <hr/>
                <ul>
                    <li>
                        <button onClick = {() => this.DijkstraApi(this.refs.src.value,this.refs.dst.value)} className = "btn btn-primary btn-sm"> Dijkstra Algorithm </button>
                        <button className = "btn btn-info btn-sm" onClick = {() => {this.getInfoApi("dks")}}>  {this.lessMore("dks")} </button>
                        {this.renderInfo("dks")}
                    </li>
                    <li>
                        <button onClick = {() => this.DfsApi(this.refs.src.value,this.refs.dst.value)} className = "btn btn-primary btn-sm"> Depth First Search </button> 
                        <button className = "btn btn-info btn-sm" onClick = {() => {this.getInfoApi("dfs")}}>  {this.lessMore("dfs")} </button>
                        {this.renderInfo("dfs")}
                    </li>
                    <li>
                        <button onClick = {() => this.UniformApi(this.refs.src.value,this.refs.dst.value)} className = "btn btn-primary  btn-sm"> Uniform Cost Search </button>          
                        <button className = "btn btn-info btn-sm" onClick = {() => {this.getInfoApi("ucs")}}>  {this.lessMore("ucs")} </button>
                        {this.renderInfo("ucs")}
                    </li>
                </ul>
            </div>
        );
    }
}
 
export default Counter;