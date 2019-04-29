class MinHeap {
    constructor(){
        this.mH=[];
        this.chef=[];
        this.currentSize =0;
    }
    createHeap(arrA,arrB){
        if(arrA.length>0){
            for(var i=0;i<arrA.length;i++){
                this.insert(arrA[i],arrB[i]);
            }
        }
    }
    display(){
        for(var i=1;i<this.mH.length;i++){
            console.log(" " + this.mH[i]+this.chef[i]);
        }
        console.log("");
    }
    insert(x,y) {
        this.currentSize++;
        var idx = this.currentSize;
        this.mH[idx] = x;
        this.chef[idx]=y;
        this.bubbleUp(idx);
    }

    bubbleUp(pos) {
        var parentIdx = Math.floor(pos/2);
        var currentIdx = pos;
        while (currentIdx > 0 && this.mH[parentIdx] > this.mH[currentIdx]) {

            this.swap(currentIdx,parentIdx);
            currentIdx = parentIdx;
            parentIdx = Math.floor(parentIdx/2);
        }
    }

    extractMin() {
        var min = this.mH[1];
        var min_chef=this.chef[1];
        this.mH[1] = this.mH[this.currentSize];
        this.chef[1] = this.chef[this.currentSize];
        this.mH[this.currentSize] = 0;
        this.chef[this.currentSize] = "NULL";
        this.sinkDown(1);
        this.currentSize--;
        return [min,min_chef];
    }

    sinkDown(k) {
        var smallest = k;
        var leftChildIdx = 2 * k;
        var rightChildIdx = 2 * k+1;
        if (leftChildIdx < this.heapSize() && this.mH[smallest] > this.mH[leftChildIdx]) {
            smallest = leftChildIdx;
        }
        if (rightChildIdx < this.heapSize() && this.mH[smallest] > this.mH[rightChildIdx]) {
            smallest = rightChildIdx;
        }
        if (smallest != k) {

            this.swap(k, smallest);
            this.sinkDown(smallest);
        }
    }

    swap(a,b) {
        var temp = this.mH[a];
        this.mH[a] = this.mH[b];
        this.mH[b] = temp;
        temp = this.chef[a];
        this.chef[a] = this.chef[b];
        this.chef[b] = temp;;
    }
    isEmpty() {
        return this.currentSize == 0;
    }

    heapSize(){
        return this.currentSize;
    }

}
//var arrA  = [0,51,0];
//var arrB=["san","swa","hem"]
//console.log("Original Array : ");
//for(var i=0;i<arrA.length;i++){
//    console.log("  " + arrA[i]);
//    console.log("  " + arrB[i]);
//}
//var m = new MinHeap();
//console.log("\nMin-Heap : ");
//m.createHeap(arrA,arrB);
//m.display();
//console.log("Extract Min :");
//for(var i=0;i<arrA.length;i++){
//    console.log("  " + m.extractMin());
//}
module.exports=MinHeap;
 
    
