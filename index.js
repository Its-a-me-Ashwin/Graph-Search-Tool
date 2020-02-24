const express = require("express");
const Graph = require("graph-data-structure");
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


/*
/api/v1/test
*/
app.get('/api/v1/test', (req,res) => {
    res.satus(200).send("Online");
});


/*
/api/v1/dijkstra
input : {
            "nodes" : ["a", "b", "c" ....],
            "edges": [["a","b"],.....],
            "symetric" : 0
            "src" : 
            "dst":
        }
*/
app.post('/api/v1/dijkstra', (req,res) => {
    console.log("Dijkstra");
    if (req.body["edges"].length != req.body["weights"].length || req.body["symetric"] == 1)
    {
        res.status(404).send("Bad Request (Wrong Size/ Non Symetric)");
    }
    else
    {
        var graph = Graph();
        for (let i = 0; i < req.body["nodes"].length; ++i)
        {
            graph.addNode(req.body["nodes"][i]);
        }
        for (let i = 0; i < req.body["edges"].length; ++i)
        {
            graph.addEdge(req.body["edges"][i][0],req.body["edges"][i][1],req.body["weights"][i]);
        }
        var serilaize = graph.serialize();
        var result = graph.shortestPath(req.body["src"],req.body["dst"]); 
        console.log(serilaize);
        res.status(200).send(result);
    }
});


/*
/api/v1/dfs
input : {
            "nodes" : ["a", "b", "c" ....],
            "edges": [["a","b"],.....],
            "symetric" : 0
            "src" : 
            "dst":
        }
*/


function dfs (graph,src,dst)
{
    var serilaize = graph.serialize();
    console.log(serilaize);
    var visited = new Object();
    for (let i = 0; i < serilaize["nodes"].length; ++i)
    {
        visited[serilaize["nodes"][i]] = 0;
    }
    console.log(visited);
    dfs_utile(graph,visited,src,dst);
    if (visited[dst] == 1)
    {
        console.log("Found");
    }
    else
    {
        console.log("Not found");
    }
}

function dfs_utils (graph,visited,a)
{
    visited[a] = 1;
    for (let j =0; j < serilaize["links"].length; ++j)
    {
        if (serilaize["links"][j]["source"] == a)
            if (visited[serilaize["links"][j]["target"]] == 0)
            {
                dfs_utils(graph,visited,j);
            }
    }
}


app.post('/api/v1/dfs', (req,res) => {
    console.log("DFS");
    if (req.body["edges"].length != req.body["weights"].length || req.body["symetric"] == 1)
    {
        res.status(404).send("Bad Request (Wrong Size/ Non Symetric)");
    }
    else
    {
        var graph = Graph();
        for (let i = 0; i < req.body["nodes"].length; ++i)
        {
            graph.addNode(req.body["nodes"][i]);
        }
        for (let i = 0; i < req.body["edges"].length; ++i)
        {
            graph.addEdge(req.body["edges"][i][0],req.body["edges"][i][1],req.body["weights"][i]);
        }
        dfs(graph,req.body["src"],req.body["dst"]);
        res.status(200).send("SUck a dick");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("started on ",port);
});