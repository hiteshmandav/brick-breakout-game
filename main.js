var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");



var score = 0;

var lives = 3;

var gameStatus = 'none';
var level = 1;

var x = (canvas.width) * Math.random();
var y = canvas.height - 30 ;
var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;

var rightKeypressed = false;
var leftKeyPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var ballIntervel;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1};
    }
}

function setbrickStatus(){
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0 , status: 1};
        }
    }
}

// 

var intervel = setInterval(draw,10);

// document.getElementById("successStatus").innerHTML = "Press start Game button at the top";
// LevelChanged
function start() {
    level=1;
    setbrickStatus();
    intervel = setInterval(draw,10);
    document.getElementById("successStatus").innerHTML = "Game in Progress level "+level;
    gameStatus = 'started';
   if(!ballIntervel) {
    ballIntervel = setInterval(()=>{
        x += dx;
        y += dy;
        // console.log(`fjflks:: ${x} , ${y}`)
    },10);
   }
        
}

function changeLevel() {
    setbrickStatus();
    intervel = setInterval(draw,10);
    document.getElementById("successStatus").innerHTML = "Game in Progress level "+level;
    document.getElementById("cLButton").disabled = true;
     ballIntervel = setInterval(()=>{
         x += dx;
         y += dy;
         // console.log(`fjflks:: ${x} , ${y}`)
     },10);
         
}

function stop() {
    console.log(`stop}`)
    clearInterval(ballIntervel);
    clearInterval(intervel);
 
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function keyPressed(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightKeypressed = true;
    }

    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftKeyPressed = true;
    }
}

function keyReleased(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightKeypressed = false;
    }

    else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftKeyPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score/level == (brickRowCount*brickColumnCount)) {
                        // alert("YOU WIN, CONGRATULATIONS!");
                        document.getElementById("successStatus").innerHTML = `YOU WON Level : ${level}. CONGRATULATIONS!! Press button to change level.`;
                        gameStatus="EndGame_win"
                        // document.location.reload();
                        clearInterval(intervel);
                        clearInterval(ballIntervel); // Needed for Chrome to end game
                        
                    }
                }
            }
        }
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y, ballRadius, 0 , Math.PI*2, true)
    ctx.fillStyle = "rgba(255,255,255, 1)";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "rgba(255,255,255, 1)";
    ctx.fill();
    ctx.closePath();
   
}

function detectWall(){

    // detecting the side walls
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    // detecting the top and bottom walls
    if( y + dy < ballRadius) {
        dy = -dy;
    }else if(y + dy > canvas.height - ballRadius){
        if( x >paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        else{
            lives--;
            if(!lives) {
                // alert("GAME OVER");
                document.getElementById("successStatus").innerHTML = `GAME OVER with Score : ${score} at level ${level}`;
                gameStatus="EndGame_lost"
                // document.location.reload();
                clearInterval(intervel);
                clearInterval(ballIntervel);  // Needed for Chrome to end game
            }
            else {
                x = (canvas.width) * Math.random();
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                // paddleX = (canvas.width-paddleWidth)/2;
            }
         }
    }
}

function movePaddle(){

    if (rightKeypressed){
        paddleX += 7;
        if (paddleX + paddleWidth >= canvas.width ){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftKeyPressed){
        paddleX -= 7;
        if(paddleX < 0 ){
            paddleX = 0;
        }
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1 ){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#FFFFFF";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    detectWall();
    // x += dx;
    // y += dy;
    collisionDetection()

    movePaddle();

    drawPaddle();
    drawScore();
    drawLives();
    if(gameStatus == 'none') {
        document.getElementById("successStatus").innerHTML = "Press start Game button at the top";
        document.getElementById("cLButton").disabled = true;
    }
    if(gameStatus == 'EndGame_win') {
        level +=1;
        gameStatus = 'LevelChanged'
        // document.getElementById("successStatus").innerHTML = "Press start Game button at the top";
        document.getElementById("cLButton").disabled = false;
    }
    // document.getElementById("successStatus").innerHTML = "Press start Game button at the top";
    //requestAnimationFrame(draw);
}
document.addEventListener("keydown", keyPressed, false);
document.addEventListener("keyup", keyReleased, false);
document.addEventListener("mousemove", mouseMoveHandler, false);