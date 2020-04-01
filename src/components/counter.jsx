import React, { Component } from 'react';
//import Canvas from './canvas'

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
                        "x_pos" : x,
                        "y_pos" : y}*/
        weightData : [], /*
                        {"name": src +dst, 
                        "src" : src,  // key = src + dst
                        "dst" : dst,
                        "weight" : weight
                        }*/
        graph : {
            nodes: [
                { id: 1, label: 'Node 1' },
                { id: 2, label: 'Node 2' },
                { id: 3, label: 'Node 3' },
                { id: 4, label: 'Node 4' },
                { id: 5, label: 'Node 5' }
                ],
            edges: [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
                { from: 2, to: 5 }
                ]
                },
        options : {
            layout: {
                hierarchical: true
            },
            edges: {
                color: '#000000'
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
        this.displayGraph = this.displayGraph.bind(this);
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
                if (result["Status"] === "Online") alert("Status : " + result["Status"]);
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
                console.log("Return Data :",result);
            }
        );   
    }

    // fx this shit
    DijkstraApi ()
    {
        var bodyData = {
            "nodes" : ["a", "b", "c"],
            "weights" : [1,2],
            "edges": [["a","b"],["b","c"]],
            "src" : "a",
            "dst": "b"
        }
        this.sendDijkstraApiCall('http://127.0.0.1:8080/api/v1/dijkstra',bodyData);
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

    displayGraph ()
    {
        var graph = {
            nodes : [],
            edges : []
        };
        var j = 1;
        for (let i =0; i < this.state.nodeData.length; ++i)
        {
            graph.nodes.push(
                {
                    id : j,
                    label : this.state.nodeData[i]["name"]
                }
            );
            console.log('Nodes:',j,this.state.nodeData[i]["name"]);
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
            graph.edges.push(
                {
                    from : source,
                    to : dest
                }
            );
        }
        return JSON.parse(JSON.stringify(graph));
    }

    render() { 
        return (
            <div style = {sectionStyle}> 
                <h1 style = {this.styleCenter}> Generate the Graph </h1>
                <h2 style = {this.styleLeft} > Add the Nodes </h2>
                <input type = "text" ref = "nodeName" placeholder = "Enter Node Name"/>
                <input type = "text" ref = "nodeHuri" placeholder = "Enter Hursitic to goal"/>
                <button onClick = {() => this.addNode(this.refs.nodeName.value,this.refs.nodeHuri.value)} className = "btn btn-secondary btn-sm"> Add Node </button>
                <hr/>

                <h2 style = {this.styleLeft} > Add the Edges </h2>
                <input type = "text" ref = "edgeSrc" placeholder = "Enter Src"/>
                <input type = "text" ref = "edgeDst" placeholder = "Enter Dst"/>
                <input type = "text" ref = "edgeWeight" placeholder = "Enter weight"/>
                <button onClick = {() => this.addEdge(this.refs.edgeSrc.value,this.refs.edgeDst.value,this.refs.edgeWeight.value)} className = "btn btn-secondary btn-sm"> Add Node </button>
                <hr/>

                <h2> Graph generated: </h2>
                {this.renderNodesList()}
                {this.renderEdgesList()}
                <hr/>
                <h2 style = {this.styleCenter}> The Graph </h2>

                <Graph
                    graph={this.displayGraph()}
                    options={this.state.options}
                />     

                <button onClick = {() => this.testApi()} className = "btn btn-secondary btn-sm"> Check Server </button>
                <button onClick = {() => this.DijkstraApi()} className = "btn btn-secondary btn-sm"> Test DFS </button>           
            </div>
        );
    }
}
 
export default Counter;