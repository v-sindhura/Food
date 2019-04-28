// JavaScript implementation of Min Heap 
class MinHeap { 
    
    constructor() {  
        this.size = 0; 
        this.Heap = [];
        this.Heap[0] = [-1,"Null"];
        this.FRONT=1;
    } 
  
    // Function to return the position of  
    // the parent for the node currently  
    // at pos 
    parent(pos) { 
        return (Math.floor(pos / 2)); 
    } 
  
    // Function to return the position of the  
    // left child for the node currently at pos 
    leftChild(pos) 
    { 
        return (2 * pos); 
    } 
  
    // Function to return the position of  
    // the right child for the node currently  
    // at pos 
    rightChild(pos) { 
        return (2 * pos) + 1; 
    } 
  
    // Function that returns true if the passed  
    // node is a leaf node 
    isLeaf(pos) { 
        if (pos >= (Math.floor(this.size / 2)) && pos <= this.size) { 
            return true; 
        } 
        return false; 
    } 
  
    // Function to swap two nodes of the heap 
    swap(fpos,spos) { 
        var tmp; 
        tmp = this.Heap[fpos]; 
        this.Heap[fpos] = this.Heap[spos]; 
        this.Heap[spos] = tmp; 
    } 
  
    // Function to heapify the node at pos 
    minHeapify(pos) { 
        // If the node is a non-leaf node and greater 
        // than any of its child 
        if (!this.isLeaf(pos)) { 
            if (this.Heap[pos][0] > this.Heap[this.leftChild(pos)][0] 
                || this.Heap[pos][0] > this.Heap[this.rightChild(pos)][0]) { 
  
                // Swap with the left child and heapify 
                // the left child 
                if (this.Heap[this.leftChild(pos)][0] < this.Heap[this.rightChild(pos)][0]) { 
                    this.swap(pos, this.leftChild(pos)); 
                    this.minHeapify(this.leftChild(pos)); 
                } 
  
                // Swap with the right child and heapify  
                // the right child 
                else { 
                    this.swap(pos, this.rightChild(pos)); 
                    this.minHeapify(this.rightChild(pos)); 
                } 
            } 
        } 
    } 
  
    // Function to insert a node into the heap 
    insert(element) 
    { 
        this.Heap[++this.size] = element; 
        var current = this.size; 
  
        while (this.Heap[current][0] < this.Heap[this.parent(current)][0]) { 
            this.swap(current, this.parent(current)); 
            current = this.parent(current); 
        } 
    } 
  
    // Function to print the contents of the heap 
    print(){ 
        
        for (var i = 1; i <= Math.floor(this.size / 2); i++) { 
            console.log(" PARENT : " + this.Heap[i][0]+this.Heap[i][1]
                     + " LEFT CHILD : " + this.Heap[2 * i][0]+this.Heap[2 * i][1]
                   + " RIGHT CHILD :" + this.Heap[2 * i + 1][0]+ this.Heap[2 * i + 1][1]); 
             
        } 
    } 
  
    // Function to build the min heap using  
    // the minHeapify 
    minHeap() 
    { 
        for (var pos = Math.floor(this.size / 2); pos >= 1; pos--) { 
            this.minHeapify(pos); 
        } 
    } 
  
    // Function to remove and return the minimum 
    // element from the heap 
    remove() 
    { 
        var popped = this.Heap[this.FRONT]; 
        this.Heap[this.FRONT] = this.Heap[this.size--]; 
        this.minHeapify(this.FRONT); 
        return popped; 
    } 
  
 }   // Driver code 
    //var minHeap = new MinHeap(); 
        
       // console.log("The Min val is " + minHeap.remove())
module.exports=MinHeap;
     
