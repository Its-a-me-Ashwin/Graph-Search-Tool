import React, { Component } from 'react';
import Canvas from './canvas'
class Counter extends Component {
    state = { 
        nodeData : [], /*
                        {"name" : name,
                        "huristic" : huri,
                        "x_pos" : x,
                        "y_pos" : y}*/
        weightData : [] /*
                        {"name": src +dst, 
                        "src" : src,  // key = src + dst
                        "dst" : dst,
                        "weight" : weight
                        }*/
    };
    styleCenter = {textAlign : "center"}
    styleLeft = {textAlign : "left"}
    styleBg = {color : "blue"}
    cloneTags
    constructor (){
        super();
        this.addNode = this.addNode.bind(this); 
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

    addNode(name,huri,x,y){
        let data = name;
        if (typeof(data) == undefined || typeof(huri) == undefined || typeof(x) == undefined || typeof(y) == undefined) 
            return ; // no data given
        var check = Array();
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
            //console.log(nodeDatal);
            console.log(this.state.nodeData);
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
            var checkData = Array();
            for (let i =0; i < this.state.nodeData.length; ++i)
            {
                checkData.push(this.state.nodeData[i]["name"]);
            }

            if (checkData.indexOf(src) < 0 || checkData.indexOf(dst) < 0)
            {
                return ;
            }

            var check = Array();
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

    displayCanvas ()
    {

    }


    render() { 
        return (
            <div style = {this.styleBg}> 
                <h1 style = {this.styleCenter}> Generate the Graph </h1>
                <h2 style = {this.styleLeft} > Add the Nodes </h2>
                <input type = "text" ref = "nodeName" placeholder = "Enter Node Name"/>
                <input type = "text" ref = "nodeHuri" placeholder = "Enter Hursitic to goal"/>
                <input type = "text" ref = "nodeX" placeholder = "Enter Loacation (x)"/>
                <input type = "text" ref = "nodeY" placeholder = "Enter Location (y)"/>
                <button onClick = {() => this.addNode(this.refs.nodeName.value,this.refs.nodeHuri.value,this.refs.nodeX.value,this.refs.nodeY.value)} className = "btn btn-secondary btn-sm"> Add Node </button>
                <hr/>

                <h2 style = {this.styleLeft} > Add the Edges </h2>
                <input type = "text" ref = "edgeSrc" placeholder = "Enter Src"/>
                <input type = "text" ref = "edgeDst" placeholder = "Enter Dst"/>
                <input type = "text" ref = "edgeWeight" placeholder = "Enter weight"/>
                <button onClick = {() => this.addEdge(this.refs.edgeSrc.value,this.refs.edgeDst.value,this.refs.edgeWeight.value)} className = "btn btn-secondary btn-sm"> Add Node </button>
                <hr/>

                <h2> Graph generated: </h2>
                {this.renderNodesList ()}
                {this.renderEdgesList()}
                <hr/>
                <Canvas/>
            </div>
        );
    }
}
 
export default Counter;