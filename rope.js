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

    // Differentiate
    // ======================
    differentiate() {
        //Apply the separation and Cohesion force over each of the nodes.
        for (let node of this.nodes) {

            //Separation
            var separation = node.separate(this.nodes);
            //Cohesion
            var cohesion = node.cohesion(this.nodes);
        
            separation.mult(settings.Sep);
            cohesion.mult(settings.Coh);
        
            node.applyForce(separation);
            node.applyForce(cohesion);
            node.update();
        }
    }

    // Growth
    // ======================
    growth() {
        // If the distance of two consecutive points is greater than the maximum 
        // distance allowed a new node is added to the rope located in the middle 
        // position.
        for (let i = 0; i < this.nodes.length - 1; i++) {
            var n1 = this.nodes[i];
            var n2 = this.nodes[i + 1];
            var d = n1.position.dist(n2.position);
            if (d > this.maxEdgeLen) {
                // Can add more rules for inserting nodes
                var middlePosition = n1.position.add(n2.position).div(2);
                node = new Node(
                    middlePosition.x,
                    middlePosition.y,
                    this.maxForce,
                    this.maxSpeed,
                    this.desiredSeparation,
                    true
                )
                this.addNodeAt(node,i + 1);
            }
        }
    }



    run() {
        this.differentiate();
        this.growth();
    }

    render(){
        for (let i=0; i<this.nodes.length; i++) {
            let p1 = this.nodes[i].position;
            let p2;
            if (i==this.nodes.length-1)
                p2 = this.nodes[0].position;
            else
                p2 = this.nodes[i+1].position;
            line(p1.x, p1.y, p2.x, p2.y);
        }
    }
}