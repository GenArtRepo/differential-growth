class Node {
    constructor(x, y, mF, mS, dS, gS) {
      this.position = createVector(x, y);
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(0, 0);
  
      this.maxForce = mF;
      this.maxSpeed = mS;
      this.desiredSeparation = dS;
  
      this.dontGrow = gS;
    }
  
    run(nodes) {
      if (this.dontGrow) {
        this.differentiate(nodes);
        this.update();
      }
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    differentiate(nodes) {
      var separation = this.separate(nodes);
      var cohesion = this.cohesion(nodes);
  
      separation.mult(settings.Sep);
      cohesion.mult(settings.Coh);

      this.applyForce(separation);
      this.applyForce(cohesion);
    }
  
    update() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }
  
    seek(target) {
      var desired = p5.Vector.sub(target, this.position);
      desired = desired.setMag(this.maxSpeed);

      // Implement Reynolds: Steering = Desired - Velocity
      var steer = p5.Vector.sub(desired, this.velocity);
      steer = steer.limit(this.maxForce);
  
      return steer;
    }

    // Separation
    // ======================
    // This method checks for nearby points and calculates the force applied as the
    // weighted average of all the vectors that steer away the point from each of 
    // the others.
    separate(nodes) {
      var steer = createVector(0, 0);
      var count = 0;
  
      for (let other of nodes) {
        var distance = this.position.dist(other.position);
        if (distance > 0 && distance < this.desiredSeparation) {
          var diff = p5.Vector.sub(this.position, other.position);
          diff.normalize();
          diff.div(distance); // Weight by distance
          steer.add(diff);
          count++;
        }
      }
      if (count > 0) {
        steer.div(count);
      }
      if (steer.mag() > 0) {
        steer.setMag(this.maxSpeed);
        steer.sub(this.velocity);
        steer.limit(this.maxForce);
      }
      return steer;
    }
  
    // Cohesion
    // ======================
    // For the average location of his neighbor points, calculate steering vector towards 
    // that location
    cohesion(nodes) {
      var sum = createVector(0, 0);
  
      var this_index = nodes.indexOf(this);
  
      if (this_index != 0 && this_index != nodes.length - 1) {
        sum = p5.Vector.add(sum, nodes[this_index - 1].position);
        sum = p5.Vector.add(sum, nodes[this_index + 1].position);
      } else if (this_index == 0) {
        sum = p5.Vector.add(sum, nodes[nodes.length - 1].position);
        sum = p5.Vector.add(sum, nodes[this_index + 1].position);
      } else if (this_index == nodes.length - 1) {
        sum = p5.Vector.add(sum, nodes[this_index - 1].position);
        sum = p5.Vector.add(sum, nodes[0].position);
      }
  
      sum = p5.Vector.div(sum, 2);
  
      return this.seek(sum);
    }
  
    display() {
      point(this.x, this.y);
    }
  }