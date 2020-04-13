from queue import PriorityQueue,Queue
from flask import Flask,jsonify,request
import json
from flask_cors import CORS




app = Flask(__name__)
CORS(app)
#global declarations
port = 8081
ip = '127.0.0.1'




def convert_to_required_format(nodes, weights, edges, huri, start, end):
    tree = dict()	
    for i in nodes:
    	if(i != end):
    		tree[i] = list()
    		for j in edges:
    			if(i in j):
    				if(j[0] != i):
    					tree[i].append([j[0], weights[edges.index(j)]])
    				else:
    					tree[i].append([j[1], weights[edges.index(j)]])

    heuristic = dict()
    for i in nodes:
    	heuristic[i] = huri[nodes.index(i)]

    return tree, heuristic



def create_two_d_list(visited_nodes, optimal_nodes):
    l = []
    q = []

    for k, i in enumerate(optimal_nodes):
        if(len(l) == 0):
            l.append(list(i))
        else:
            copy_ = list(l[k-1])
            copy_.append(i)
            l.append(copy_)
    for k, i in enumerate(visited_nodes):
        if(len(q) == 0):
            q.append(list(i[0]))
        else:
            copy_ = list(q[k-1])
            copy_.append(i[0])
            q.append(copy_)

    a = 0
    b = 0
    final_list = []
    # track_index = []
    while( b< len(q)):
        if(l[a] == q[b]):
            final_list.append(l[a])
            a = a+1
            b = b+1
        else:
            if(all(i in q[b] for i in l[a])):
                # track_index.append(b)
                final_list.append(l[a])
                a = a+1
                b = b+1

            else:
                final_list.append(q[b])
                b = b+1
    return final_list






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
        weight = list(map(lambda x : int(x),weight))
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







@app.route("/api/v1/asr",methods=["POST"])
def AStarSearch():
    #global tree, heuristic
    try:
        data = request.get_json()
        print(data)
        nodes = data["nodes"]
        weights = data["weights"]
        edges = data["edges"]
        huri = data["huri"]
        start = data["src"]
        end = data["dst"]
        cost = {start: 0}
        huri = list(map(lambda x: int(x),huri))
        weights = list(map(lambda x:int (x),weights))
        tree, heuristic = convert_to_required_format(nodes, weights, edges, huri, start, end)
        closed = []             # closed nodes
        opened = [[start, huri[nodes.index(start)]]]     # opened nodes

        '''find the visited nodes'''
        while True:
            fn = [i[1] for i in opened]     # fn = f(n) = g(n) + h(n)
            chosen_index = fn.index(min(fn))
            node = opened[chosen_index][0]  # current node
            closed.append(opened[chosen_index])
            del opened[chosen_index]
            if closed[-1][0] == end:        # break the loop if node G has been found
                break
            for item in tree[node]:
                if item[0] in [closed_item[0] for closed_item in closed]:
                    continue
                cost.update({item[0]: cost[node] + item[1]})            # add nodes to cost dictionary
                fn_node = cost[node] + heuristic[item[0]] + item[1]     # calculate f(n) of current node
                temp = [item[0], fn_node]
                opened.append(temp)    

        '''find optimal sequence'''
        trace_node = end                        # correct optimal tracing node, initialize as node G
        optimal_sequence = [end]                # optimal node sequence
        for i in range(len(closed)-2, -1, -1):
            check_node = closed[i][0]           # current node
            if trace_node in [children[0] for children in tree[check_node]]:
                children_costs = [temp[1] for temp in tree[check_node]]
                children_nodes = [temp[0] for temp in tree[check_node]]

                '''check whether h(s) + g(s) = f(s). If so, append current node to optimal sequence
                change the correct optimal tracing node to current node'''
                if cost[check_node] + children_costs[children_nodes.index(trace_node)] == cost[trace_node]:
                    optimal_sequence.append(check_node)
                    trace_node = check_node
        optimal_sequence.reverse()              # reverse the optimal sequence
        result = create_two_d_list(closed, optimal_sequence)
        result = list(map(lambda x: json.dumps(x), result))
        rs = dict()
        rs["Result"] = "Yes"
        rs["Graph"] = result#json.dumps(result)
        rs["GAY"] = result
        if (end not in result[len(result) - 1]): 
            rs["Result"] = "No"
        return json.dumps(rs),200
    except Exception as e:
        print("Error",e)
        return jsonify({"Result":"No"}),400
    #return jsonify(),200
    #return closed, optimal_sequence








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


@app.route("/api/v1/info/asr",methods=["POST"])
def infasr ():
    fp = open('info/infoAsr.txt','rt')
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