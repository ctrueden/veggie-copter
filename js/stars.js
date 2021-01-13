class StarField {
  constructor(w, h) {
    this.count = 50;   // Number of stars in star field.
    this.minSpeed = 1; // Minimum star speed.
    this.maxSpeed = 5; // Maximum star speed.

    this.width = w;
    this.height = h;
    this.starY = []; // Y values
    this.starV = []; // velocities
    for (var i=0; i<this.count; i++) {
      this.starY[i] = this.height * Math.random();
      this.starV[i] = this.randomVelocity();
    }
  }

  /** Draws stars to the given graphics context. */
  draw(ctx) {
    for (var i=0; i<this.count; i++) {
      var x = i * this.width / this.count;
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.moveTo(x, this.starY[i]);
      ctx.lineTo(x, this.starY[i] - 2 * this.starV[i]);
      ctx.stroke();
    }
  }

  /** Updates star positions. */
  move() {
    for (var i=0; i<this.count; i++) {
      this.starY[i] += this.starV[i];
      if (this.starY[i] - 2 * this.starV[i] > this.height) {
        this.starY[i] = 0;
        this.starV[i] = this.randomVelocity();
      }
    }
  }

  randomVelocity() {
    return (this.maxSpeed - this.minSpeed) * Math.random() + this.minSpeed;
  }
}
