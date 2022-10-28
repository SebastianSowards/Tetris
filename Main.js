
document.addEventListener('DOMContentLoaded',() => {
  const grid = document.querySelector(".Grid");
  let squares = Array.from(document.querySelectorAll(".Grid div"));
  const scoreDisplay = document.querySelector('#score');
  const levelDisplay = document.querySelector('#level');
  const startBtn = document.querySelector('#start-button') ;
  const width = 10;
  let nextRandom = 0;
  let score = 0;
  let level = 1;
  let timerId;
  
  const Tetrominos = {
    0:"l",
    1:"z",
    2:"t",
    3:"o",
    4:"i"
  };
  //Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
  
  let currentPosition = 4;
  let currentRotation = 0;
  
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];
  
  function draw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.add("Tetromino");
      squares[currentPosition + index].classList.add(Tetrominos[random]);
      
      
    })
  }
  
  function undraw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('Tetromino');
      squares[currentPosition + index].classList.remove(Tetrominos[random]);
      
    })
  }
  
  
  //timerId = setInterval(moveDown,1000);
  
  function control(e){
    if(e.keyCode === 37){
      moveLeft();
    }else if (e.keyCode === 38){
      rotate();
    }else if (e.keyCode === 39){
      moveRight()
    }else if (e.keyCode === 40){
      moveDown()
    }
  }
  document.addEventListener('keydown',control);
  
  function moveDown(){
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }
  function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
      current.forEach(index => squares[currentPosition + index].classList.add("taken"));
      random = nextRandom;
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      checkLevelUp();
      gameOver();
      
      
    } 
  }
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  function moveLeft(){
    undraw();
    if(!isAtLeft()) currentPosition -=1;
    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
      currentPosition +=1;
    }
    draw();
  }
  function moveRight(){
    undraw();
    if(!isAtRight()) currentPosition +=1;
    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
      currentPosition -=1;
    }
    draw();
  }
  function rotate(){
    undraw();
    currentRotation++;
    if(currentRotation === current.length){
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }
  const displaySquares = document.querySelectorAll(".miniGrid div");
  const displayWidth = 4;
  let displayIndex = 0;
  
  
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ];
  
  function displayShape(){
    displaySquares.forEach(square => {
      square.classList.remove("Tetromino");
      square.classList.remove(Tetrominos[random]);
    }) 
    upNextTetrominoes[nextRandom].forEach(index =>{
      displaySquares[displayIndex+index].classList.add("Tetromino");
      displaySquares[displayIndex+index].classList.add(Tetrominos[nextRandom]);
    });
  }
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      displayShape();
    }
  })
   
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
      
      if(row.every(index => squares[index].classList.contains("taken"))){
        score+=10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("Tetromino");
          squares[index].style.backgroundColor = '';
          
        })
        const squaresRemoved = squares.splice(i,width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
        
      }
    }
    
  }
  function checkLevelUp(){
    level = Math.floor(score/20);
    clearInterval(timerId);
    timerId = setInterval(moveDown, 1000-((level-1)*50));
    levelDisplay.innerHTML = level;
  }
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
  

})
