/*
** Differential Growth
* Cristian Rojas Cardenas, April 2022

* Algorithm based on the processing implementation by Ahmad Moussa.
* See the example here: 
* https://editor.p5js.org/AhmadMoussa/sketches/ooNQ46VP2
* And the processing implementation by Nekodigi.
* https://github.com/Nekodigi/Growth
*
* The simulation operates under a "rope of nodes" metaphor. The nodes and the rope have their 
* own rules which are applied in every iteration.
*
* Nodes' behaviour is determined by the following rules:
* 
*       - Separation: A node will steer to avoid colliding with other nodes.
*                   Check for nearby nodes
*                   Calculate repulsion force as the weighted average of the subtraction between 
*                   the vector and all the vectors within a given radius.
*                   Apply repulsion force to node.
* 
*       - Cohesion: A node will steer towards the centre of the group of all other nodes within a
*                   given radius.
*                   Check for nearby nodes.
*                   Calculate the average position of all other nodes within radius.
*                   Calculate attraction force toward centre of neighbouring nodes.
*                   Apply attraction force to node.
* 
* The main rule for the rope is defined as:
* 
*        -	Growth: If the distance of two connected nodes is greater than the
*                   maximum distance allowed a new node is inserted on the mid-point of the rope 
*                   segment connecting the two nodes.
* 

* 
* In this implementation, the first and last nodes of the rope are static. Intermediate nodes
* are initialized with set maxSpeed, maxForce, desiredSeparation and
* maxEdgeLen parameters.
* New nodes are initialised with the same parameters, with additional random variation. 
* 
* The rope can be rendered as a collection of nodes (uncomment line 56 and comment out line 57
*  in rope.js) or as a continuous line (comment out line 56 and uncomment line 57 in rope.js).
* 
*/

let play = false;

let rope;

const nodesStart = 20;
const r = 10;
const maxForce = 0.9; // Maximum steering force
const maxSpeed = 1; // Maximum speed of nodes
const desiredSeparation = 9;
const maxEdgeLen = 5;

let settings = { 
  Play: function(){ play=true; },
  Pause: function(){ play=false; },
  Reset: function(){ init(); play=true; },
  Sep: 1,
  Coh: 0.9,
}

function gui(){
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings,'Play');
    gui.add(settings,'Pause');
    gui.add(settings,'Reset');
    gui.add(settings,'Sep', 0, 1).step(0.1);
    gui.add(settings,'Coh', 0, 1).step(0.1);
}

function init(){
    rope = new Rope(maxForce, maxSpeed, desiredSeparation, maxEdgeLen);
    
    const angInc = TWO_PI/nodesStart;
    initial_rope  = [];
    for (var a=0; a<TWO_PI; a+=angInc) {
        var x = width/2 + r*cos(a);
        var y = height/2 + r*sin(a);
        initial_rope.push([x, y, false]);
      }

    initial_rope.forEach(attrs => {
        for(let i in initial_rope){
            node = new Node(attrs[0], attrs[1], maxForce, maxSpeed, desiredSeparation, 
                attrs[2]);
            rope.addNode(node);
        }
    });  
 
}

function setup(){
    gui();
    createCanvas(720, 400);
    strokeWeight(2);
    init();
    rope.render();
}

function draw(){
    if(play){
        background(255);
        stroke(0);
        rope.run();
        rope.render();
    }  
}