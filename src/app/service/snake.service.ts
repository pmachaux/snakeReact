import { Injectable } from '@angular/core';
import {Snake} from "../model/snake";
import {Coord} from "../model/coord";
import {KEY_DIRECTION_ARRAY} from "../const/key-direction-array";
import {CANVAS_SIZE} from "../const/canvas-size";
import {Food} from "../model/food";
import {Game} from "../model/game";
import {SNAKE_DIRECTION} from "../const/snake-direction";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class SnakeService {
  private _game: Game;
  private _observableGame :BehaviorSubject<Game>;
  private _observableScoreEvolution : BehaviorSubject<number>;
  constructor () {
    this._game = new Game(1, 0);
    this._observableGame = <BehaviorSubject<Game>> new BehaviorSubject(this._game);
    this._observableScoreEvolution = <BehaviorSubject<number>> new BehaviorSubject(0)
  }
  clearCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, CANVAS_SIZE.x, CANVAS_SIZE.y)
  };
  changeFoodPosition (food: Food, snake: Snake): Food {
    food.coord = food.generateFoodPositionRandomly(CANVAS_SIZE, snake.body);
    return food;
  };
  checkLevelValue(newValue: number, oldValue: number) {
    return newValue && !isNaN(newValue) && newValue !== oldValue && newValue > 0 && newValue < 11;
  }
  detectBorderCanvas(size: number, abscisse: number, ordonnee: number) : Coord {
    if (abscisse >= CANVAS_SIZE.x) {
      abscisse = 0;
    } else if (abscisse < 0) {
      abscisse = CANVAS_SIZE.x - size;
    }
    if (ordonnee >= CANVAS_SIZE.y) {
      ordonnee = 0;
    } else if (ordonnee < 0) {
      ordonnee = CANVAS_SIZE.y - size;
    }
    return new Coord(abscisse, ordonnee);
  };
  drawFood(ctx: CanvasRenderingContext2D, food:Food) {
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(food.coord.x + food.size /2, food.coord.y + food.size /2, food.size/2,0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'purple';
    ctx.stroke();
    ctx.closePath();
  }
  drawSnake(ctx: CanvasRenderingContext2D, snake: Snake): void {
    snake.body.forEach((bodyPart, index) => {
      if (index === snake.body.length -1) {
        this.drawSnakeTail(bodyPart, snake.getTailDirection(), snake.size, ctx)
      } else if (index === 0 ) {
        this.drawSnakeHead(bodyPart, snake.direction, snake.size, ctx);
      } else {
        ctx.fillStyle = '#3f904d';
        ctx.fillRect(bodyPart.x, bodyPart.y, snake.size, snake.size);
      }
    });
  };
  drawSnakeHead(headCoord: Coord, snakeDirection: string, size: number, ctx: CanvasRenderingContext2D) {
    let centerCoord = new Coord(headCoord.x + size/2, headCoord.y + size/2);
    let startAngle;
    let endAngle;
    let startCoord;
    let firstLineCoord;
    let secondLineCoord;
    if (snakeDirection === SNAKE_DIRECTION.RIGHT) {
      startCoord = new Coord(headCoord.x, headCoord.y);
      firstLineCoord = new Coord(headCoord.x + size/2, headCoord.y);
      secondLineCoord = new Coord(headCoord.x, headCoord.y  + size);
      startAngle = -Math.PI / 2;
      endAngle = Math.PI / 2;
    } else if (snakeDirection === SNAKE_DIRECTION.LEFT) {
      startCoord = new Coord(headCoord.x + size, headCoord.y + size);
      firstLineCoord = new Coord(headCoord.x + size/2, headCoord.y + size);
      secondLineCoord = new Coord(headCoord.x + size, headCoord.y );
      startAngle = Math.PI / 2;
      endAngle = Math.PI * 3 / 2;
    }
    else if (snakeDirection === SNAKE_DIRECTION.UP) {
      startCoord = new Coord(headCoord.x, headCoord.y + size );
      firstLineCoord = new Coord(headCoord.x , headCoord.y + size / 2);
      secondLineCoord = new Coord(headCoord.x + size, headCoord.y + size);
      startAngle = Math.PI ;
      endAngle = 0;
    }
    else {
      startCoord = new Coord(headCoord.x + size, headCoord.y);
      firstLineCoord = new Coord(headCoord.x + size , headCoord.y + size / 2);
      secondLineCoord = new Coord(headCoord.x , headCoord.y);
      startAngle =  0;
      endAngle = Math.PI;
    }

    ctx.beginPath();
    ctx.moveTo(startCoord.x, startCoord.y);
    ctx.lineTo(firstLineCoord.x, firstLineCoord.y);
    ctx.arc(centerCoord.x, centerCoord.y, size/2, startAngle, endAngle, false);
    ctx.lineTo(secondLineCoord.x, secondLineCoord.y);
    ctx.fillStyle = '#e42929';
    ctx.fill();
    ctx.closePath();
  };
  drawSnakeTail (tailCoord: Coord, tailDirection: string, size: number, ctx: CanvasRenderingContext2D) {
    let startCoord;
    let middleCoord;
    let endCoord;
    if (tailDirection === SNAKE_DIRECTION.RIGHT) {
      startCoord = new Coord(tailCoord.x + size, tailCoord.y);
      middleCoord =  new Coord(tailCoord.x, tailCoord.y + size/2);
      endCoord =  new Coord(tailCoord.x + size, tailCoord.y + size);
    } else if (tailDirection === SNAKE_DIRECTION.LEFT) {
      startCoord = new Coord(tailCoord.x , tailCoord.y);
      middleCoord =  new Coord(tailCoord.x + size, tailCoord.y + size/2);
      endCoord =  new Coord(tailCoord.x, tailCoord.y + size);
    }
    else if (tailDirection === SNAKE_DIRECTION.UP) {
      startCoord = new Coord(tailCoord.x, tailCoord.y);
      middleCoord =  new Coord(tailCoord.x + size/2, tailCoord.y + size);
      endCoord =  new Coord(tailCoord.x + size, tailCoord.y);
    }
    else {
      startCoord = new Coord(tailCoord.x, tailCoord.y + size);
      middleCoord =  new Coord(tailCoord.x + size/2, tailCoord.y);
      endCoord =  new Coord(tailCoord.x + size, tailCoord.y + size);
    }
    ctx.beginPath();
    ctx.moveTo(startCoord.x, startCoord.y);
    ctx.lineTo(middleCoord.x, middleCoord.y);
    ctx.lineTo(endCoord.x, endCoord.y);
    ctx.fillStyle = '#3f904d';
    ctx.fill();
    ctx.closePath();
  }
  getGame(): Observable<Game> {
    return this._observableGame.asObservable();
  }
  getScoreEvolution(): Observable<number> {
    return this._observableScoreEvolution.asObservable();
  }
  isSnakeEatingFood (snake: Snake, food: Food): boolean {
    let snakeHead = snake.getSnakeHead();
    return food.coord && snakeHead.x === food.coord.x && snakeHead.y === food.coord.y;
  };
  moveSnake(snake: Snake): Snake {
    snake = snake.moveSnake();
    snake.body = snake.body.map(bodyPart => this.detectBorderCanvas(snake.size, bodyPart.x, bodyPart.y));
    return snake;
  };
  onKeyUpChangeDirection(eventKey: string, snake: Snake): boolean {
    let isDirectionChanged = false;
    let requestedKey = KEY_DIRECTION_ARRAY.find(item => item.key === eventKey);
    if (requestedKey && requestedKey.opposite !== snake.direction) {
      snake.direction = requestedKey.direction;
      isDirectionChanged= true;
    }
    return isDirectionChanged;
  };
  onLevelChange(level: number): void {
    if (this.checkLevelValue(level, this._game.level)) {
      this._game.level = level;
    }
  };
  onScoreEvolution () {
    let scoreEvolution = this._game.level * 10;
    this._observableScoreEvolution.next(scoreEvolution);
  }
  setGame (game: Game): void {
    this._game = game;
    this._observableGame.next(this._game);
  }
  nextGameAction(ctx: CanvasRenderingContext2D): boolean {
    this.clearCanvas(ctx);
    this.moveSnake(this._game.snake);
    this._game.isGameOver = this._game.snake.isSnakeCollision();
    this._game.snake.isGrowing = this.isSnakeEatingFood(this._game.snake, this._game.food);
    if (this._game.snake.isGrowing) {
      this._game.food.coord = null;
      this._game.score = this._game.score + this._game.level*10;
      this.onScoreEvolution();
    }
    if (!this._game.food.coord) {
      this.changeFoodPosition(this._game.food, this._game.snake);
    }
    if (this._game.food) {
      this.drawSnake(ctx, this._game.snake);
      this.drawFood(ctx, this._game.food);
    } else {
      this._game.isGameOver = true;
    }
    return this._game.isGameOver;
  };
}
