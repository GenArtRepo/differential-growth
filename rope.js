class Rope{
    
    constructor(mF, mS, dS, eL){
        this.nodes = [];

        this.maxSpeed = mF;
        this.maxForce = mS;
        this.desiredSeparation = dS;
        this.maxEdgeLen = eL;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addNodeAt(node, idx) {
        this.nodes.splice(idx, 0, node);
    }

    // Growth
    // ======================
    // If the distance of two consecutive points is greater than the maximum 
    // distance allowed a new node is added to the rope located in the middle 
    // position.
    growth() {
        for (let i = 0; i < this.nodes.length - 1; i++) {
          var n1 = this.nodes[i];
          var n2 = this.nodes[i + 1];
          var d = n1.position.dist(n2.position);
          if (d > this.maxEdgeLen + map(noise(millis() / 1000), 0, 1, -2, 5)) {
            // Can add more rules for inserting nodes
            var middlePosition = n1.position.add(n2.position).div(2);
            node = new Node(
                middlePosition.x,
                middlePosition.y,
                this.maxForce + random(-0.1, 0.1),
                this.maxSpeed + random(-0.1, 0.1),
                this.desiredSeparation + noise(millis() / 1000) * 5,
                true
            )
            this.addNodeAt(node,i + 1);
          }
        }
    }

    run() {
        for (let node of this.nodes) {
            node.run(this.nodes);
        }
        this.growth();
    }

    render(){
        beginShape(POINTS);
        this.nodes.forEach(node => {
            vertex(node.position.x, node.position.y);
        });
        endShape();
    }
}