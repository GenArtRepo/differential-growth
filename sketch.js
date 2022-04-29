/*
** Differential Growth
* Cristian Rojas Cardenas, April 2022

* Algorithm based on the processing implementation by Ahmad Moussa implementation.
* See the example here: 
* https://editor.p5js.org/AhmadMoussa/sketches/ooNQ46VP2
* And the processing implementation by Nekodigi.
* https://github.com/Nekodigi/Growth
*
* The algorithm operates over a rope of nodes. The nodes and the rope have their 
* own rules which are applied in every iteration. The main rule for the rope is 
* defined as:
* 
*        -	Growth: If the distance of two consecutive points is greater than the
*                   maximum distance allowed a new node is added to the rope located 
*                   in the middle position.
* 
* Accordingly, the nodes follow the laws of:
* 
*       - Separation: Steer to avoid colliding with your neighbours.
*                   Checks for nearby points and calculates the force applied as the
*                   weighted average of all the vectors that steer away from each of 
*                   the others.
* 
*       - Cohesion: Steer towards the center of your neighbors (stay with the group).
*                   For the average location of his neighbour points, calculate the 
*                   steering vector towards that location
* 
* The extreme nodes of the rope are static, the normal nodes are initialized given 
* the constants established at the start of the algorithm (maxSpeed, maxForce, 
* desiredSeparation, maxEdgeLen) with some random changes added. 
* 
* The nodes are rendered through a map of vertices, if you want to visualize the 
* rope without the nodes you can remove the POINTS argument.
* 
*/

let play = true;

let rope;
let radius = 6; // Node radius
let rlim = 6; //limit length (avoid intercepting line)
let resampleLen = 5*2;
let max_nodes = 2000;


const maxForce = 0.8; // Maximum steering force
const maxSpeed = 0.8; // Maximum speed of nodes
const desiredSeparation = 14;
const cohesionRation = 0.88;
const maxEdgeLen = 5;

let settings = { 
  Play: function(){ play=true; },
  Pause: function(){ play=false; },
  Reset: function(){ init(); play=true; },
  Sep: 0.88,
  Coh: 1,
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

    initial_rope = [ 
        [0, height/2, false], 
        [width/2, height/2-6, true], 
        [width/2, height/2+6, true], 
        [width, height/2, false]
    ]

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
    frameRate(10);
    init();
}

function draw(){

    if(play){
        background(255);
        rope.run();
        rope.render();
    }  

    
}