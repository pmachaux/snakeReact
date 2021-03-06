import {Coord} from './coord'
import {SIZE_GRID_ELEMENT} from "../const/size-grid-element";
import {SNAKE_DIRECTION} from "../const/snake-direction";

export class Snake {
  size: number;
  direction: string;
  isGrowing: boolean;
  body: Coord[];

  constructor() {
    this.moveSnake = this.moveSnake.bind(this);
    this.size = SIZE_GRID_ELEMENT;
    this.body = [];
    this.isGrowing = false;
    this.direction = SNAKE_DIRECTION.RIGHT;
    for (var i = 0; i <= 10; i++) {
      this.body.unshift({x: i * this.size, y: 3 * this.size});
    }
  }

  getTailDirection (): string  {
    let tailDirection;
    let tailCoord = this.body[this.body.length - 1];
    let lastBeforeTail = this.body[this.body.length - 2];
    let abscisseDiff = tailCoord.x - lastBeforeTail.x;
    let ordonneDiff = tailCoord.y - lastBeforeTail.y;
    if (abscisseDiff > 0) {
      tailDirection = SNAKE_DIRECTION.LEFT;
    } else if (abscisseDiff < 0) {
      tailDirection = SNAKE_DIRECTION.RIGHT;
    } else if (ordonneDiff > 0) {
      tailDirection = SNAKE_DIRECTION.UP;
    } else {
      tailDirection = SNAKE_DIRECTION.DOWN;
    }
    return tailDirection;
  }

  getSnakeHead () {
    return this.body[0];
  };

  isSnakeCollision (): boolean {
    let snakeBody = this.body.slice();
    return this.body.some(bodyPart => {
      snakeBody.splice(snakeBody.indexOf(bodyPart), 1);
      return snakeBody.some(item => bodyPart.x === item.x && bodyPart.y === item.y);
    });
  }

  moveSnake (): Snake {
    if (!this.isGrowing) {
      this.body.pop(); //Remove tail
    } else {
      this.isGrowing = false;
    }
    let currentHeadSnake = this.getSnakeHead();
    let newHeadSnake;
    if (this.direction === SNAKE_DIRECTION.LEFT) {
      newHeadSnake = new Coord(currentHeadSnake.x - this.size, currentHeadSnake.y);
    } else if (this.direction === SNAKE_DIRECTION.RIGHT) {
      newHeadSnake = new Coord(currentHeadSnake.x + this.size, currentHeadSnake.y);
    } else if (this.direction === SNAKE_DIRECTION.UP) {
      newHeadSnake = new Coord(currentHeadSnake.x, currentHeadSnake.y - this.size);
    } else if (this.direction === SNAKE_DIRECTION.DOWN) {
      newHeadSnake = new Coord(currentHeadSnake.x, currentHeadSnake.y + this.size);
    }
    this.body.unshift(newHeadSnake);
    return this;
  };
}
