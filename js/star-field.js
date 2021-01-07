/** Number of stars in star field. */
const STARS = 50;

/** Minimum star speed. */
const STAR_MIN = 1;

/** Maximum star speed. */
const STAR_MAX = 4;

class StarField {

  /** Constructs a star field. */
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.starY = []; // Y values
    this.starV = []; // velocities
    for (var i=0; i<STARS; i++) {
      this.starY[i] = this.height * Math.random();
      this.starV[i] = (STAR_MAX - STAR_MIN + 1) * Math.random() + STAR_MIN;
    }
  }

  /** Draws stars to the given graphics context. */
  drawStars(ctx) {
    for (var i=0; i<STARS; i++) {
      var x = i * this.width / STARS;
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.moveTo(x, this.starY[i]);
      ctx.lineTo(x, this.starY[i] - 2 * this.starV[i]);
      ctx.stroke();
    }
  }

  /** Updates star positions. */
  moveStars() {
    for (var i=0; i<STARS; i++) {
      this.starY[i] += this.starV[i];
      if (this.starY[i] - 2 * this.starV[i] > this.height) {
        this.starY[i] = 0;
        this.starV[i] = (STAR_MAX - STAR_MIN + 1) * Math.random() + STAR_MIN;
      }
    }
  }
}
