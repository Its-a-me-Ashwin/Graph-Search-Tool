from queue import PriorityQueue,Queue
from flask import Flask,jsonify,request
import json
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
#global declarations
port = 8081
ip = '127.0.0.1'




def add_vertex(graph,vertex_no,v):
    #global graph
    #global vertex_no
    vertex_no += 1
    graph[v] = []
def add_edge(graph,v1,v2,weight):
    #global graph
    temp = [v2,weight]
    graph[v1].append(temp)


@app.route("/api/v1/Uniform",methods=["POST"])
def uniformCost():
    try:
        data = request.get_json()
        print(data)
        node = data["nodes"]
        weight = data["weights"]
        edges = data["edges"]
        #heuris = data["huri"]
        src = data["src"]
        dest = data["dst"]
        graph = {}
        vertex_no = 0;
        for n in node:
            add_vertex(graph,vertex_no,n)
        for (edg,wei) in zip(edges,weight):
            add_edge(graph,edg[0],edg[1],wei)
        q = PriorityQueue()
        result = []
        visited = set()
        visited.add(src)
        q.put((0,src))
        k = 0;
        while not q.empty():
            n = q.qsize()
            temp = []
            temp.append(src)
            for i in range(n):
                next_item = q.get()
                temp.append(next_item[1])
                if(next_item[1] == dest):
                    break
                for li in graph[next_item[1]]:
                    if li[1] not in visited:
                        q.put((li[1],li[0]))
                        visited.add(li[0])
            result.append(temp)
        result[0].pop()
        result = list(map(lambda x: json.dumps(x), result))
        rs = dict()
        rs["Result"] = "Yes"
        rs["Graph"] = result#json.dumps(result)
        rs["GAY"] = result
        if (dest not in result[len(result) - 1]): 
            rs["Result"] = "No"
        return json.dumps(rs),200
    except Exception as e:
        print(e)
        return jsonify({"Result":"No"}),400




@app.route("/api/v1/bfs",methods=["POST"])
def bfs():
    try:
        data = request.get_json()
        print(data)
        node = data["nodes"]
        weight = data["weights"]
        edges = data["edges"]
        #heuris = data["huri"]
        src = data["src"]
        dest = data["dst"]
        graph = {}
        vertex_no = len(node)
        for n in node:
            graph[n] = []
        for edg in edges:
            graph[edg[0]].append(edg[1])
        q = Queue()
        result = []
        visited = set()
        visited.add(src)
        q.put(src)
        parent = {}
        parent[src] = ""
        while not q.empty():
            n = q.qsize()
            temp = []
            temp.append(src)
            for i in range(n):
                next_item = q.get()
                print(next_item)
                temp.append(next_item)
                if(next_item== dest):
                    break
                for li in graph[next_item]:
                    if li[0] not in visited:
                        parent[li[0]] = next_item
                        q.put(li[0])
                        visited.add(li[0])
            result.append(temp)
        result[0].pop()
        result = list(map(lambda x: json.dumps(x), result))
        rs = dict()
        rs["Result"] = "Yes"
        rs["Graph"] = result#json.dumps(result)
        rs["GAY"] = result
        if (dest not in result[len(result) - 1]): 
            rs["Result"] = "No"
        return json.dumps(rs),200
    except Exception as e:
        print(e)
        return jsonify({"Result":"No"}),400




@app.route("/api/v1/info/dfs",methods=["POST"])
def infDfs ():
    fp = open('info/infoDfs.txt','rt')
    data = fp.read()
    fp.close()
    return jsonify({"data":data}),200

@app.route("/api/v1/info/ucs",methods=["POST"])
def infUcs ():
    fp = open('info/infoUcs.txt','rt')
    data = fp.read()
    fp.close()
    return jsonify({"data":data}),200

@app.route("/api/v1/info/dks",methods=["POST"])
def infDks ():
    fp = open('info/infoDks.txt','rt')
    data = fp.read()
    fp.close()
    return jsonify({"data":data}),200
    
@app.route("/api/v1/info/bfs",methods=["POST"])
def infBfs ():
    fp = open('info/infoBfs.txt','rt')
    data = fp.read()
    fp.close()
    return jsonify({"data":data}),200
    


'''
node = ["a","b","c"]
edge = [["a","b"],["c","b"],["a","c"]]
weight = [68,2,3]
heu = [1,2,3]
result = uniformCost(node,weight,edge,heu,"a","b")
print(result)
'''



if __name__ == '__main__':
    app.debug=True
    app.run(host = ip, port = port)