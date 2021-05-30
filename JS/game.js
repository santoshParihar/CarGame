
// getting references of our divs
const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');


// obj for moving key
let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };


// player obj
let player = { speed: 3, score: 0 };
// road line move speed
let roadMoveSpeed = 3.5;
// enemy car move speed
let enemyMoveSpeed = 2;

// get the button user has pressed
let keyUpEvent = function (e) {
     e.preventDefault();
     keys[e.key] = false;
     // console.log(`key up = ${e.key} `);
     // console.log(keys);
}

// adding key press event 
document.addEventListener('keyup', keyUpEvent);
document.addEventListener('keydown', (e) => { keys[e.key] = true; })


//  when click on start sceen we start the game
startScreen.addEventListener('click', Start);

let animation;
function Start() {
     //player now play the game
     player.start = true;
     //hiding start screen
     startScreen.classList.add('hide');
     // clearing everything inside game area div 
     gameArea.innerHTML = "";
     // player's score is set to 0 at beginning.
     player.score = 0;
     // for running animation in loop
     animation = window.requestAnimationFrame(GamePlayStart);
     // i will create a div called car and make it child of gamearea. we can 
     // do it in html inside game area div. and set the image there but we will do here
     car = document.createElement('div');
     // sestting a class
     car.setAttribute('class', 'car');
     // car.innerText = "I am the car";
     gameArea.appendChild(car);
     // we will use offset to move our car
     player.y = car.offsetTop;
     player.x = car.offsetLeft;
     // creating lines at the middle of our road
     CreateLines();
     // creating enemy cars
     CreateEnemyCar();

}


let road;
function GamePlayStart() {
     // getting references of enemy cars and road
     let car = document.querySelector('.car');
     road = gameArea.getBoundingClientRect();

     // if our player is ready then we start the game 
     if (player.start) {
          MoveLines();
          MoveEnemy(car);
          TakeInput(road);

          // applying the movement back to car in px .
          car.style.top = player.y + 'px';
          car.style.left = player.x + 'px';
          window.requestAnimationFrame(GamePlayStart);
          SetScore();
     }
}


function TakeInput(road) {
     if (keys.ArrowUp && player.y > (road.top + 100)) player.y -= player.speed;
     else if (keys.ArrowDown && player.y < (road.bottom - 90)) player.y += player.speed;
     else if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
     else if (keys.ArrowRight && player.x < (road.width - 62)) player.x += player.speed;
}


function SetScore() {
     player.score++;
     let ps = player.score - 1;
     score.innerHTML = "score : " + ps;
     if (ps == 1500)
          SetDifficulty(4.5, 3);
     else if (ps == 3500) {
          SetDifficulty(5.5, 4);
     } else if (ps == 5500) {
          SetDifficulty(6, 4.5);
     }

}

function GameOver() {
     player.start = false;
     startScreen.classList.remove('hide');
     window.cancelAnimationFrame(animation);
     SetDifficulty(3.5,2);
     startScreen.innerHTML = "Game Over <br> your final score is  : " + player.score + " <br> Click here to restart the game ";

}

function SetDifficulty(roadLineSpeed, enemyCarSpeed) {
     roadMoveSpeed = roadLineSpeed;
     enemyMoveSpeed = enemyCarSpeed;
     console.log(roadMoveSpeed);
     console.log(enemyMoveSpeed);
}
function isCollided(a, b) {
     aRect = a.getBoundingClientRect();
     brect = b.getBoundingClientRect();

     return !((aRect.top > brect.bottom) || (aRect.bottom < brect.top) ||
          (aRect.left > brect.right) || (aRect.right < brect.left));
}

function MoveLines() {
     let lines = document.querySelectorAll('.line');
     lines.forEach(line => {

          if (line.y > (road.bottom)) {
               line.y = road.top;
          }
          line.y += (roadMoveSpeed);
          line.style.top = line.y + "px";
     });
}
function MoveEnemy(car) {
     let item = document.querySelectorAll('.enemy');
     item.forEach(item => {

          if (isCollided(car, item)) {
               GameOver();
               return;
          }
          if (item.y > (road.bottom)) {
               item.y = road.top - 100;
               item.style.left = Math.floor(Math.random() * 360) + "px";

          }
          item.y += enemyMoveSpeed;
          // item.y += (player.speed + 0.5);
          item.style.top = item.y + "px";
     });
}


function CreateLines() {
     for (x = 0; x < 10; x++) {
          let roadLine = document.createElement('div');
          roadLine.setAttribute('class', 'line');
          roadLine.y = (x * 150);
          roadLine.style.top = roadLine.y + "px";
          gameArea.appendChild(roadLine);

     }
}
let vDist = 150;
function CreateEnemyCar() {
     console.log("create car ");

     for (x = 1; x < 5; x++) {
          let enemyCar = document.createElement('div');
          enemyCar.setAttribute('class', 'enemy');
          enemyCar.y = ((x + 1) * vDist) * -1;

          enemyCar.style.top = enemyCar.y + "px";
          gameArea.appendChild(enemyCar);
          // enemyCar.style.backgroundColor = "blue"; 
          enemyCar.style.left = Math.floor(Math.random() * 330) + "px";
     }
}
function Numbers(min, max) {
     return Math.floor(Math.random() * (max - min + 1) + min);
}
