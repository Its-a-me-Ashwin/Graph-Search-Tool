const express = require("express");
const Graph = require("graph-data-structure");
const bodyParser = require('body-parser');
const Queues = require("Queue");
const vis = require("vis");

const Queue = Queues.Queue;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  
  });



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


function greedy (graph,huri,src,dst)
{
    var serilaize = graph.serialize();
    var num = 1;
    var visited = new Object();
    for (let i = 0; i < serilaize["nodes"].length; ++i)
    {
        visited[serilaize["nodes"][i]["id"]] = 0;
    }
    console.log(serilaize);
    console.log(huri,src,dst);
    var queue = new Queue();    
    queue.enqueue({src:huri[src]});
    console.log(queue);


}


/*
/api/v1/test
*/
app.post('/api/v1/test', (req,res) => {
    console.log("All modules Loaded");
    res.status(200).send({"Status" : "Online"});
});


/*
/api/v1/dijkstra
input : {
            "nodes" : ["a", "b", "c" ....],
            "weights" : [1,2],
            "edges": [["a","b"],.....],
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
        //console.log(serilaize);
        var out = {}           
        var num = 1;
        for (let i = 0; i < result.length; ++i)
        {
            out[result[i]] = num;
            num += 1;
        }
        res.status(200).send(JSON.stringify(out));
    }
});


/*
/api/v1/dfs
input : {
            "nodes" : ["a", "b", "c" ....],
            "weights" : [1,2],
            "edges": [["a","b"],.....],
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
        //console.log(visited,visited[req.body["dst"]]);
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
            "weights" : [1,2],
            "edges": [["a","b"],.....],
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
        //console.log(visited,visited[req.body["dst"]]);
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
/api/v1/astar
input : {
            "nodes" : ["a", "b", "c" ....],
            "weights" : [1,2], // heurustic
            "edges": [["a","b"],.....],
            "src" : 
            "dst":
        }
*/
app.post('/api/v1/astar', (req,res) => {
    console.log("A *");
    if (req.body["edges"].length != req.body["weights"].length || req.body["symetric"] == 1 || req.body["nodes"].length != req.body["heuri"].length)
    {
        res.status(404).send("Bad Request (Wrong Size/ Non Symetric)");
    }
    else
    {
        var graph = Graph();
        var nodes = new Object();
        for (let i = 0; i < req.body["nodes"].length; ++i)
        {
            graph.addNode(req.body["nodes"][i]);
            nodes[req.body["nodes"][i]] = req.body["heuri"][i]
        }
        for (let i = 0; i < req.body["edges"].length; ++i)
        {
            graph.addEdge(req.body["edges"][i][0],req.body["edges"][i][1],req.body["weights"][i]);
        }
        var serilaize = graph.serialize();
        console.log(serilaize);
        console.log(graph);
        console.log(nodes);
        /*  A start algo goes here  */

        var openList = []
        var closeList = []


        openList.push(nodes[req.body["src"]]);

        while (! openList.isEmpty())
        {
            min = Math.min(...openList);
        }
        
        res.status(404).send("Nibbas");
    }
    //res.status(404).send("Nibbas");
});


app.post('/api/v1/greedySearch', (req,res) => {
    console.log("Greedy");
    if (req.body["edges"].length != req.body["weights"].length || req.body["symetric"] == 1 || req.body["nodes"].length != req.body["huri"].length)
    {
        res.status(404).send("Bad Request (Wrong Size/ Non Symetric)");
    }
    else
    {
        var graph = Graph();
        var nodes = new Object();
        for (let i = 0; i < req.body["nodes"].length; ++i)
        {
            graph.addNode(req.body["nodes"][i]);
            nodes[req.body["nodes"][i]] = req.body["huri"][i]
        }
        for (let i = 0; i < req.body["edges"].length; ++i)
        {
            graph.addEdge(req.body["edges"][i][0],req.body["edges"][i][1],req.body["weights"][i]);
        }
        var serilaize = graph.serialize();
        //console.log(serilaize);
        //console.log(graph);
        //console.log(nodes);
        /* Greedy  */
        
        greedy(graph,nodes,req.body["src"],req.body["dst"]);

        res.status(404).send("Nibbas");
    }
});



const port = process.env.PORT || 8080; //node is gay
app.listen(port, () => {
    console.log("started on ",port);
});