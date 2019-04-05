class Graph{
    constructor(noOfVertices){
        this.noOfVertices=noOfVertices;
        this.AdjList=new Map();
    }
    addVertex(v){
        this.AdjList.set(v,[]);
    }
    addEdge(v,w,n){
        this.AdjList.get(v).push([w[0],n]); 
        this.AdjList.get(w).push([v[0],n]);
    }
    printGraph() 
    { 
        //console.log(this.AdjList);
        
        // get all the vertices 
        var get_keys = this.AdjList.keys(); 
        //console.log(get_keys);
        //console.log(Object.keys(this.AdjList).length)
        //console.log(this.AdjList.length);
        var temp = this.AdjList.get('A'); 
        //console.log(temp);
        // iterate over the vertices 
        for (var i of get_keys)  
        { 
                // great the corresponding adjacency list 
                // for the vertex 
                var get_values = this.AdjList.get(i); 
               
                var conc = ""; 

                // iterate over the adjacency list 
                // concatenate the values into a string 
                for (var j of get_values) 
                    conc += j + " "; 

                // print the vertex and its adjacency list 
                //console.log(i + " -> " + conc); 
            } 
    } 

    floydWarshallAlgorithm()
    {
       let dist = {};
       for (var [key, value] of this.AdjList) {
        dist[key]={};
           var a=key;
        value.forEach(function(l){
            
            dist[key][l[0]]=l[1];
            
            
        });
           for(var [key, value] of this.AdjList){
                if(dist[a][key]==undefined){
                    dist[a][key]=Infinity;
                }
                if(a==key)dist[key][key]=0;
            }
       }
        for(var [key1,val1] of this.AdjList){
            for(var [key2,val2] of this.AdjList){
                for(var [key3,val3] of this.AdjList){
                    if(dist[key1][key3]+dist[key3][key2]<dist[key1][key2]){
                        dist[key1][key2]=dist[key1][key3]+dist[key3][key2];
                    }
                }
            }
        }
        console.log(dist);
        return dist;
    
    }

}

var g = new Graph(4); 
var vertices = [ 'A', 'B', 'C', 'D' ]; 
var today=["no","no","no","no"];
  
// adding vertices 
for (var i = 0; i < vertices.length; i++) { 
    g.addVertex(vertices[i]); 
} 
 
g.addEdge("A", "C", 100);
g.addEdge("A", "B", 3);
g.addEdge("A", "D", 4);
g.addEdge("D", "C", 3);
// adding edges 
/*g.addEdge('A', 'B',10); 
g.addEdge('A', 'D',20); 
g.addEdge('A', 'E',2); 
g.addEdge('B', 'C',3); 
g.addEdge('D', 'E',4); 
g.addEdge('E', 'F',5); 
g.addEdge('E', 'C',6); 
g.addEdge('C', 'F',7); */
  
// prints all vertex and 
// its adjacency list 
// A -> B D E 
// B -> A C 
// C -> B E F 
// D -> A E 
// E -> A D F C 
// F -> E C 
g.printGraph(); 
g.floydWarshallAlgorithm();

