const express = require("express");
const Graph = require("graph-data-structure");
const bodyParser = require('body-parser');
const Queues = require("Queue");
const Queue = Queues.Queue;


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


// Helper functions



function dfs_utils (serilaize,graph,visited,a,num)
{
    visited[a] = num;
    num +=1;
    for (let j = 0; j < serilaize["links"].length; ++j)
    {
        if (serilaize["links"][j]["source"] == a)
            if (visited[serilaize["links"][j]["target"]] == 0)
            {
                dfs_utils(serilaize,graph,visited,serilaize["links"][j]["target"],num);
            }
    }
}


function dfs (graph,src,dst)
{
    var serilaize = graph.serialize();
    //console.log(serilaize);
    var visited = new Object();
    for (let i = 0; i < serilaize["nodes"].length; ++i)
    {
        visited[serilaize["nodes"][i]["id"]] = 0;
    }
    dfs_utils(serilaize,graph,visited,src,1);
    return visited
}

function bfs (graph,src,dst)
{
    var serilaize = graph.serialize();
    var num = 1;
    var visited = new Object();
    for (let i = 0; i < serilaize["nodes"].length; ++i)
    {
        visited[serilaize["nodes"][i]["id"]] = 0;
    }
    var queue = new Queue();
    queue.enqueue(src);
    visited[src] = num;
    num += 1;
    while(!queue.isEmpty())
    {
        let s = queue.front();
        //console.log("HEllo",s)
        queue.dequeue();
        for (let j = 0; j < serilaize["links"].length; ++j)
        {
            if (serilaize["links"][j]["source"] == s)
                if (visited[serilaize["links"][j]["target"]] == 0)
                {
                    visited[serilaize["links"][j]["target"]] = num;
                    num += 1;
                    queue.enqueue(serilaize["links"][j]["target"]);
                }
        }
        
    }
    //console.log(visited);
    return visited
}


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
        var visited = dfs(graph,req.body["src"],req.body["dst"]);
        console.log(visited,visited[req.body["dst"]]);
        if (visited[req.body["dst"]] == undefined)
        {
            res.status(200).send("Node not found");
        }
        else if (visited[req.body["dst"]] != 0 )
        {
            res.status(200).send(JSON.stringify(visited));
        }
        else
        {
            res.status(200).send("No path found");
        }
    }
});


/*
/api/v1/bfs
input : {
            "nodes" : ["a", "b", "c" ....],
            "edges": [["a","b"],.....],
            "symetric" : 0
            "src" : 
            "dst":
        }
*/
app.post('/api/v1/bfs', (req,res) => {
    console.log("BFS");
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
        var visited = bfs(graph,req.body["src"],req.body["dst"]);
        console.log(visited,visited[req.body["dst"]]);
        if (visited[req.body["dst"]] == undefined)
        {
            res.status(200).send("Node not found");
        }
        else if (visited[req.body["dst"]] != 0 )
        {
            res.status(200).send(JSON.stringify(visited));
        }
        else
        {
            res.status(200).send("No path found");
        }
    }
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("started on ",port);
});