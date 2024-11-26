
let TopSection = 50;
let ShopSection = 200;
let ConsoleSection = 200;
let mouseDown = false;
let lastMousePos;
let errorName = [];

function Intro() {

  let counter = 0;

  this.setup = function(){
    createCanvas(window.innerWidth,window.innerHeight)
  }

  this.draw = function() {
    push()
      background(30,30,40);
      fill(255)
      textSize(75);
      textAlign(CENTER,CENTER);
      textStyle(BOLD)
      text("File/Debugger.exe", width/2,200)

      fill(150,150,255);
      textStyle(NORMAL)
      textSize(22)
      push()
        translate(0,-50)
        text("/Next/Page/Game_Play.exe",width/2,400)
        stroke(150,150,255)
        line(width/2-140,410,width/2+140,410)
        noStroke()
        text("../Info/Page/Instructions.txt",width/2,450)
        stroke(150,150,255)
        line(width/2-140,460,width/2+130,460)
      pop()
    
      if(inButton(width/2-150,330,280,30)){ // GAME BUTTON
        if(!mouseDown){
          sceneMan.showScene(Game);
          mouseDown = true;
          if(!buttonSFX.isPlaying()){
            buttonSFX.play()
          }
        }
      }
      if(inButton(width/2-150,380,280,30)){
        if(!mouseDown){
          sceneMan.showScene(Instructions)
          mouseDown = true;
          if(!buttonSFX.isPlaying()){
            buttonSFX.play()
          }
        }
      }
    pop()

    // File Icon Pictures
    push()
    translate(width/6,380)
    counter++;
    rotate(radians(sin(counter/30)*10))
    imageMode(CENTER)
    image(sadIcon,0,0,150)
    pop()
    push()
    translate(width-(width/6),380)
    rotate(radians(sin(-counter/30)*10))
    imageMode(CENTER)
    image(happyIcon,0,0,150)
    pop()
  }

}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    canvasSize = resizeCanvas(window.innerWidth, window.innerHeight);
    console.log("Canvas Resized");
}

function Game(){
  
  //#region VARIABLES
  let mapData = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, ],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, ],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, ],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, ],
    
    
  ]
  
  let gridData = []; // 2D Array that stores all the tiles
  let enemyPathing = []; // Path enemies take
  let pathLength = 0;
  
  let currentEnemies = []; // enemies in play
  let currentTowers = []; // towers in play
  let selectedTower = null; // trying to build
  
  let Currency = 10; // Buying towers
  let waveMax = 5; // Waves Left Obv
  let waveCur = -1;
  let waveData = [] // holds JSON data for waves
  
  // None interactive Vars

  let baseCol;
  let secCol;
  let gridSize;
  let size = 50;

  let canvasSize;
  let counter = 0;
  let healthcounter = 5;
  // Scroll Bars
  let shopScrollBar;
  
  
  //#endregion
  
  this.setup = function() {
    canvasSize = createCanvas(window.innerWidth,window.innerHeight)
    textAlign(CENTER, CENTER);
    ellipseMode(CENTER)
    textSize(14)
    textStyle(BOLD);
    lastMousePos = createVector(mouseX,mouseY);
    shopScrollBar = new vertScrollBar(width-35,TopSection+30,30,440)
    
    let availableSpace = (window.innerHeight - TopSection - 50) / mapData.length;
    if(window.innerWidth-ShopSection-ConsoleSection < window.innerHeight-TopSection-50){
      availableSpace = (window.innerWidth - ShopSection-ConsoleSection) / mapData.length;
    }
    size = availableSpace


    sec = second();
  
    gridSize = createVector(10,10)
    baseCol = color(50,50,60);
    secCol = color(255 - baseCol.r, 255 - baseCol.g, 255 - baseCol.b);
  
    for(let y = 0; y < gridSize.y; y++){
        gridData[y] = [];
        for(let x = 0; x < gridSize.x; x++){
          
            switch(mapData[y][x]) {
              case 0:
                gridData[y][x] = new TileData(color(80),false,true)
                gridData[y][x].pos = createVector(size*x+ConsoleSection,size*y+TopSection)    
                  break;
              case 1: // Road
                gridData[y][x] = new TileData(color(50), true)
                gridData[y][x].pos = createVector(size*x+ConsoleSection,size*y+TopSection)
                // enemyPathing.push(createVector(size*x+size/2,size*y+size/2))
                  break;
            }
        }
    }
    createPath();
    // LOADING WAVE DAT
    for(let i = 0; i < _itemLib.WaveDat.length; i++){
      waveData.push({... JSON.parse(JSON.stringify(_itemLib.WaveDat[i]))});
    }
  }
  
  this.draw = function() {
    background(0)
    
    waveManager();
  
    for(let y = 0; y < gridSize.y; y++){
      for(let x = 0; x < gridSize.x; x++){
        
        gridData[y][x].Render()
      }
    }
    
    
    currentTowers.forEach(function(item){
      item.BuildingRender();
      if(selectedTower != null){
        item.Building.showRange = true;
      }
      else {
        item.Building.showRange = false;
      }
    });
  
    
    
  
    if(selectedTower != null){
      selectedTower.pos = createVector(mouseX,mouseY)
      selectedTower.Render();
    }
    
    drawShopPanel();
    drawTopPanel();
    drawConsolePanel();
    shopScrollBar.Render()
    
    if(!mouseDown){
      lastMousePos = createVector(mouseX,mouseY);
    }
  }
  
  function drawTopPanel(){
    push()
    fill(25,25,35)
    rect(0,0,width,TopSection);
    fill(240,200,90)
    textSize(25)
    textAlign(LEFT,CENTER)
    translate(0,TopSection/2)
    
    if(waveCur == -1){
      push()
      fill(50,50,60);
      rect(width/2 + 100,-TopSection/2, 100,50)
      fill("white")
      text("Start",width/2 + 120,0);
      if(inButton(width/2 + 100,0,100,50)){
        if(!mouseDown){
          waveCur++
          for(let item in waveData){
            item.curTime = second()
          }
          mouseDown = true;
        }
      }


      pop()
    }

    text("Lines Left: " + Currency,10,0)
    textAlign(CENTER,CENTER)
    text("File: " + (waveCur+1) + "/" + waveMax,width/2,0)
    text("Shop",width-100,0)
    pop()
  }
  
  function drawShopPanel(){
    push()
    translate(width-ShopSection,TopSection);
    fill(30,30,40)
    rect(0,0,ShopSection,height)
  
    fill(50,50,60)
    rect(10,20,ShopSection-10,height-TopSection-40)
    translate(20,30)
    fill(70,70,75)
  
    let itemSize = 140;
    let padding = 10;
    for(let i = 0; i < _itemLib.Towers.length; i++){
      if(_itemLib.Towers.length > 3){ // only use this if we have more than 3 items
        // hide stuff outside shop
        if((i+1)*itemSize - shopScrollBar.getValue() < TopSection-50 ||
           i*itemSize - shopScrollBar.getValue() > height - itemSize){
          continue;
        }
  
      }
      push()
      if(inButton(width-ShopSection+20,TopSection+30+(itemSize+padding)*i - shopScrollBar.getValue(),itemSize,itemSize)){
        if(!mouseDown && _itemLib.Towers[i].cost <= Currency){
          // add functions here
          console.log("Bought Tower");
          selectedTower = new tower(_itemLib.Towers[i]);
        }
        fill(90,90,95)
      }
      rect(0,(itemSize+padding)*i - shopScrollBar.getValue(),itemSize)
      fill(200)
      rectMode(CENTER)
      textSize(dynamicText(_itemLib.Towers[i].name,itemSize-40))
      // textSize(20)
      let temp = color(_itemLib.Towers[i].objCol[0],_itemLib.Towers[i].objCol[1],_itemLib.Towers[i].objCol[2])
      fill(temp)
      text(_itemLib.Towers[i].name,itemSize/2,(itemSize+padding)*i+itemSize/2 - shopScrollBar.getValue(),itemSize-40)
      
      textSize(20)
      fill(240,200,90)
      text("Cost: " + _itemLib.Towers[i].cost,itemSize/2,(itemSize+padding)*i+itemSize-15 - shopScrollBar.getValue())
      pop()
    }
    if(_itemLib.Towers.length > 3){
      shopScrollBar.reduceSize = ((_itemLib.Towers.length-3)*itemSize+padding*(_itemLib.Towers.length-3))
      // console.log(shopScrollBar.reduceSize)
    }
    else { shopScrollBar.reduceSize = 0;}
  
  
  
  
    push()
    noStroke();
    fill(30,30,40)
    rect(-20,-30,ShopSection,20)
    rect(-20,height-TopSection-50,ShopSection,20)
    pop()
    pop()
  }
  
  // Displays What Enemies are on the board
  function drawConsolePanel(){
    push()
    translate(0,TopSection);
    fill(30,30,40)
    rect(0,0,ConsoleSection,height)
    fill(15,15,20)
    translate(10,10);
    rect(0,0, ConsoleSection-20,height-TopSection-20)
    pop()
  
    let row = 0;
    let extra = 0;
    currentEnemies.forEach(function(obj){
      push()
      translate(10,TopSection+10)
      textAlign(LEFT,LEFT)
      rectMode(CORNER,CORNER)
      textSize(20);
      fill("Red")
      text("ERR: " + obj.name,10,20+row*24+extra*24,ConsoleSection-20);
      temp = textWidth("ERR: " + obj.name) 
      if(temp > ConsoleSection-20){
        extra++
      }
      pop()
  
      if(obj.finishedPath){
        errorName.push( obj.flavorTxt);
        healthcounter--;
        if(healthcounter == 0){
          ResetScene();
          loseSFX.play()
          sceneMan.showScene(FailedEnd);
        }
        currentEnemies.splice(row,1)
      }
      else if(obj.health <= 0){
        currentEnemies.splice(row,1);
        DeathSFX[int(random(0,DeathSFX.length))].play()
        counter++;
        if(counter == 3){
          Currency++
          counter = 0;
          CoinSFX.play();
        }
      }
      obj.Render();
      row++
    })
    
    
    
    
  }
  
  function createPath(){
  
    
    let currentX = 0;
    let currentY = 0;
    let lastX = 0;
    let lastY = 0;
    // get first spot
    for(let x= 0; x < gridSize.x; x++){
      
      if(gridData[0][x].isRoad){
        enemyPathing.push(createVector(gridData[0][x].pos.x,gridData[0][x].pos.y))
        enemyPathing[enemyPathing.length-1].add(size/2,0);
  
        currentX = x;
        break;
      }
      
    }
  
    // check bottom > Left > right > top
  
    while(currentY <= gridSize.y-2){
  
        // Check down 1
        // cur = 2 last = 0 = true
        if(currentY+1 != lastY && gridData[currentY+1][currentX].isRoad){
          enemyPathing.push(createVector(gridData[currentY+1][currentX].pos.x,gridData[currentY+1][currentX].pos.y));
          enemyPathing[enemyPathing.length-1].add(size/2,size/2);
          pathLength += size;
          lastX = currentX;
          lastY = currentY;
          currentY++;
          continue;
        }
        // Check Left 1;
        else if(currentX-1 != -1 && currentX-1 != lastX && gridData[currentY][currentX-1].isRoad){
          enemyPathing.push(createVector(gridData[currentY][currentX-1].pos.x,gridData[currentY][currentX-1].pos.y));
          enemyPathing[enemyPathing.length-1].add(size/2,size/2);
          pathLength += size;
          lastX = currentX;
          lastY = currentY;
          currentX--;
          continue;
          
        }
        // check Right 1
        else if(currentX+1 != lastX && gridData[currentY][currentX+1].isRoad){
  
          enemyPathing.push(createVector(gridData[currentY][currentX+1].pos.x,gridData[currentY][currentX+1].pos.y));
          enemyPathing[enemyPathing.length-1].add(size/2,size/2);
          pathLength += size;
          lastX = currentX;
          lastY = currentY;
          currentX++;
          continue;
          
        }
        // check up
        else if(currentY-1 != lastY && gridData[currentY-1][currentX].isRoad){
          enemyPathing.push(createVector(gridData[currentY-1][currentX].pos.x,gridData[currentY-1][currentX].pos.y));
          enemyPathing[enemyPathing.length-1].add(size/2,size/2);
          pathLength += size;
          lastX = currentX;
          lastY = currentY;
          currentY--;
          continue;
          
        }
        else{
          console.log("No Items found")
          console.log(currentX + " | " + currentY);
          console.log(lastX + " | " + lastY);
          break;
        }   
    }
  }
  
  function waveManager() {
  
    switch(waveCur){
      case -1:
        console.log("Game Not Started");
        return;
      case waveData[0].count.length:
        console.log("waves Complete");
        sceneMan.showScene(WinEnd);
        ResetScene();
        winSFX.play();
        return;
    }
  
    
    let waveFin = 0;
    // console.log(waveData)
    for(let i = 0; i < waveData.length; i++){
  
      let dif = second()-waveData[i].curTime;
      if(second() < waveData[i].curTime){
        dif = second() - (waveData[i].curTime-60)
      }
      if(dif >= waveData[i].delay && waveData[i].count[waveCur] > 0){
        
        currentEnemies.push(new enemy(createVector(enemyPathing[0].x,enemyPathing[0].y),_itemLib.Enemies[i]))
  
        waveData[i].count[waveCur]--;
        waveData[i].curTime = second();
      }
      else if(waveData[i].count[waveCur] <= 0){
        waveFin ++;
      }
    }
    // console.log(waveFin)
    if(waveFin == waveData.length && currentEnemies.length == 0){
      waveCur++;
      // console.log(waveCur)
      for(let item in waveData){
        item.curTime = second()
      }
    }
    
  }
  
  function ResetScene(){
    
    currentEnemies = []; // enemies in play
    currentTowers = []; // towers in play
    selectedTower = null; // trying to build
    gridData = []; // 2D Array that stores all the tiles
    enemyPathing = [];

    Currency = 10; // Buying towers
    waveMax = 5; // Waves Left Obv
    waveCur = -1;
    waveData = [] // holds JSON data for waves
    
    counter = 0;
    healthcounter = 5;

    for(let y = 0; y < gridSize.y; y++){
      gridData[y] = [];
      for(let x = 0; x < gridSize.x; x++){
        
          switch(mapData[y][x]) {
            case 0:
              gridData[y][x] = new TileData(color(80),false,true)
              gridData[y][x].pos = createVector(size*x+ConsoleSection,size*y+TopSection)    
                break;
            case 1: // Road
              gridData[y][x] = new TileData(color(50), true)
              gridData[y][x].pos = createVector(size*x+ConsoleSection,size*y+TopSection)
              // enemyPathing.push(createVector(size*x+size/2,size*y+size/2))
                break;
          }
      }
    }
    createPath();
    
    for(let i = 0; i < _itemLib.WaveDat.length; i++){
      waveData.push({... JSON.parse(JSON.stringify(_itemLib.WaveDat[i]))});
    }
  }
  
  class enemy {
    constructor(pos,EnemyDat){
      this.pos = pos;
      this.name = EnemyDat.name;
      this.health = EnemyDat.hp;
      this.flavorTxt = EnemyDat.flavorTxt;
  
      this.speed = EnemyDat.speed / 10;
      this.color = color(EnemyDat.objCol[0],EnemyDat.objCol[1],EnemyDat.objCol[2]);
      
      this.currentSpot = 0;
      this.finishedPath = false;
      this.pathDistanceRemaining = pathLength;
      
    }
  
    Render(){
      
      push()
      //#region PATHING
      translate(this.pos.x,this.pos.y);
      
      if(this.currentSpot < enemyPathing.length-1){
        this.followPath();
      }
      else if(this.pos.y <= height){
        this.pos.add(0,this.speed);
      }
      else {
        this.finishedPath = true;
      }
      //#endregion
      
      
      //#region DRAWING
      fill(this.color);
      textStyle(BOLD);
      rectMode(CENTER)
      textSize(dynamicText(this.name,size*1.4))
      text(this.name,0,0,size,size)
      //ellipse(0,0, this.size, this.size)
      //#endregion
      pop()
    }
  
    followPath(){
      let path = createVector(enemyPathing[this.currentSpot].x,enemyPathing[this.currentSpot].y)
      
      let prevPos = createVector(this.pos.x,this.pos.y);
      this.pos.add(MoveTowards(this.pos,path,this.speed));
      this.pathDistanceRemaining -= abs(prevPos.x - this.pos.x) + abs(prevPos.y - this.pos.y);
  
      if(MoveTowards(this.pos,path,this.speed) == 0){
        this.currentSpot++
      }
      
    }
  
  }
  
  class tower {
  
    constructor(towerData) {
  
      this.name = towerData.name;
      this.cost = towerData.cost;
      
      this.allowToShoot = false;
      this.damage = towerData.damage;
      this.range = towerData.range;
      
      this.hasFired = false;
      this.speed = towerData.shootSpeed*1000; // fireRate
      this.bulletText = towerData.bulletText;
      this.showRange = true;
      this.bulletsInplay = [];
      
      this.TowCol = color(towerData.objCol[0],towerData.objCol[1],towerData.objCol[2])
      this.pos;
  
      this.bulletDat = {
        name: towerData.bulletText,
        speed: 30,
        color: color(towerData.bulCol[0],towerData.bulCol[1],towerData.bulCol[2])
      }
    }
    
    Render(){
      push()
      rectMode(CENTER,CENTER)
      
      this.TowerAI() // shows range and checks for shooting
      
      textSize(dynamicText(this.name,size-2));
      fill(this.TowCol)
      text(this.name,this.pos.x,this.pos.y,size-size/4);
      pop()
    }
  
    TowerAI(){
      // Range UI
      if(this.showRange){
        noStroke()
        fill(0,255,0,40);
        if(!this.allowToShoot){
          fill(255,255,0,40)
        }
        
        rect(this.pos.x, this.pos.y, size*this.range, size*this.range);
      }
  
      // SHOOTING
      if(this.allowToShoot && !this.hasFired){ 
        if(this.TowerCheck()){
          this.hasFired = true;
        }
      }
  
      // Bullet Updates
      for(let i = 0; i < this.bulletsInplay.length; i++){
        let bul = this.bulletsInplay[i];
        bul.Render();
        if(bul.hitTarget){
          bul.target.health -= this.damage;
          this.bulletsInplay.splice(i,1);
        }
      }
  
    }
  
  
    TowerCheck(){
      
      let targetEnem = {pathDistanceRemaining: pathLength}; // grab the enemy that is the furthest in the trail
      // find the furthest down the path within range
      for(let curEnem of currentEnemies) {
  
          let distence = createVector(abs(this.pos.x - curEnem.pos.x), abs(this.pos.y - curEnem.pos.y)); 
          if(distence.x < (this.range*size)/2 && distence.y < (this.range*size)/2 ){
            if(curEnem.pathDistanceRemaining < targetEnem.pathDistanceRemaining)
            targetEnem = curEnem;
          }
      }
      if(targetEnem.pathDistanceRemaining == pathLength){
        // console.log("false")
        return false;
      }
  
  
      this.bulletsInplay.push(new bullet(this.bulletDat,this.pos,targetEnem))
      setTimeout(() => {
              this.hasFired = false;
      },this.speed)
      
      return true;
    }
  
  }
  
  class bullet {
    constructor(bulDat, pos, target){
      this.speed = bulDat.speed / 10;
      this.name = bulDat.name;
      this.bulCol = bulDat.color;
      
      this.pos = createVector(pos.x,pos.y);
      this.target = target;
      
      this.hitTarget = false;
    }
  
    Render(){
  
      this.pos.add(MoveTowards(this.pos,this.target.pos,this.speed));
      push()
      textSize(dynamicText(this.name,size));
      noStroke()
      fill(this.bulCol)
      text(this.name,this.pos.x,this.pos.y)
      pop()
  
      if(MoveTowards(this.pos,this.target.pos,this.speed) == 0) {
        this.hitTarget = true;
      }
  
    }
  }
  
  
  class TileData {
  
    constructor(tileColor,isRoad,isBuildable){
  
      this.pos = createVector(0,0)
      this.tileColor = tileColor;
      this.isRoad = isRoad; // Enemy moves here;
      this.isBuildable = isBuildable; // Buildings can be placed here;
      this.isSelected = false; // Turn Tile green to show what is buildable;
      this.Building; // Add building data stuff here I think? idk
    }
  
  
    Render(){
      // REPLACE WITH SPRITES
      push()
      noStroke()
      fill(this.tileColor)
      rect(this.pos.x,this.pos.y,size,size)
      pop()
      if(this.isBuildable && selectedTower != null && this.Building == null && inButton(this.pos.x,this.pos.y,size,size)){
        this.Building = selectedTower
        Currency -= this.Building.cost;
        this.Building.allowToShoot = true;
        this.Building.showRange = false;
        this.Building.pos = createVector(this.pos.x+size/2,this.pos.y+size/2);
        currentTowers.push(this);
        selectedTower = null;
      }
    }
  
    BuildingRender(){
      this.Building.Render()
    }
  
  
  }
  

}  



function Instructions() {
  this.setup = function(){
    canvasSize = createCanvas(window.innerWidth, window.innerHeight)

  }
  
  this.draw = function() {
    push()
      background(30,30,40);
      fill(255)
      textSize(50);
      textAlign(LEFT,CENTER)
      text("Instructions",50,50);
      text("----------------------------",40,100)
      text("Enemies:",width-250,50)
      push()
        let maxSize = height - 100 - 20 
        let pos = maxSize / _itemLib.Enemies.length;
        textStyle(BOLD)
        textAlign(CENTER)
        for(let i = 0; i < _itemLib.Enemies.length; i++){
          let enem = _itemLib.Enemies[i];
          push()
          fill(enem.objCol[0],enem.objCol[1],enem.objCol[2])
          textSize(dynamicText(enem.name,150))
          text(enem.name,width-200, pos+20 + pos*i,100)
          pop()
        }
      pop()
      textSize(20)
      fill(255,255,100)
      text("- Stop Error Codes from reaching the end", 60,150)
      text("- each Function has different speeds and \"damage\"", 60,190)
      text("- you work is completed once the last file's errors are gone", 60,230)
      fill(150,150,255);
      textStyle(NORMAL)
      textSize(22) 
      text("/next/Project/StartPage.js.zip",50,400)
      stroke(150,150,255)
      line(50,410,335,410)
      if(inButton(50,380,335-50,30, true)){
        if(!mouseDown){
          sceneMan.showScene(Intro)
          mouseDown = true;
          if(!buttonSFX.isPlaying()){
            buttonSFX.play()
          }
        }
  
      }
    pop()
  }
}



function FailedEnd() {

  let iconPos;
  let target1;
  let target2;
  let dir;

  this.setup = function(){
    canvasSize = createCanvas(window.innerWidth, window.innerHeight)
    iconPos = createVector(width-200, height-250)
    target1 = createVector(width-200, 25)
    target2 = createVector(width-200, height-250)
  }

  this.draw = function(){
    push()
      background(30,30,40);
      fill(255)
      textSize(50);
      textAlign(LEFT,LEFT)
      textStyle(BOLD)
      translate(0,30) // <<<<<<<<<<<<<<<<<< TRANSLATE
      text("System Crash! ",20,20)
      text("-----------------------",20,70);
      fill("red")
      textSize(20)
      text("System Error could not run code due to:",20,100)
      fill(255,100,100)
      textStyle(NORMAL)
      // errorName = ["","","",""]
      for(let i = 0; i < errorName.length; i++) {
        // errorName[i] = _itemLib.Enemies[i].flavorTxt;
        text(trim(errorName[i]),20,130 + i*30)

      }


      push()
        if(dir){
          if(MoveTowards(iconPos,target1,4/10) == 0){ dir = false; }
          iconPos.add(MoveTowards(iconPos,target1,10/10))
        }
        else {
          if(MoveTowards(iconPos,target2,4/10) == 0) {dir = true;}
          iconPos.add(MoveTowards(iconPos,target2,10/10))
        }
        translate(iconPos.x+75, iconPos.y+75)
        rotate(radians(sin(iconPos.y/20-30)*10))
        imageMode(CENTER)
        image(errorIcon,0,0,150)
      pop()

      push()
        fill(150,150,255);
        textStyle(NORMAL)
        textSize(22) 
        text("/Next/Page/Game_Play.exe",50,400)
        stroke(150,150,255)
        line(50,410,335,410)
      pop()
      push()
        fill(150,150,255);
        textStyle(NORMAL)
        textSize(22) 
        text("/next/Project/StartPage.js.zip",50,440)
        stroke(150,150,255)
        line(50,450,335,450)
      pop()
    pop()
      if(inButton(50,410,285,30)){
        if(!mouseDown){
          errorName = [];
          sceneMan.showScene(Game)
          mouseDown = true;
          if(!buttonSFX.isPlaying()){
            buttonSFX.play()
          }
        }
  
      }
      if(inButton(50,450,285,30)){
        if(!mouseDown){
          errorName = [];
          sceneMan.showScene(Intro)
          mouseDown = true;
          if(!buttonSFX.isPlaying()){
            buttonSFX.play()
          }
        }
  
      }
      fill(200,100)
      // rect(50,410,285,30)
    // fill(255,150,150,50);
    // rect(50,450,285,30)

  }
}



function WinEnd(){

  let iconPos;
  let target1;
  let target2;
  let counter = 0;

  this.setup = function(){
    canvasSize = createCanvas(window.innerWidth, window.innerHeights)
    iconPos = createVector(width-200,0)
    target1 = createVector(width-200,0)
    target2 = createVector(width-200,height)
  }

  this.draw = function(){
    push()
    background(30,30,40);
    fill(255)
    textSize(50);
    textAlign(LEFT,CENTER)
    text("Good Job!",40,60)
    text("-------------------------------",40,100)
    textSize(25);
    text("All Errors have been fixed...",40,180)
    rectMode(CORNER,CENTER)
    fill(255,255,100)
    text("We have more files for you to process so go take a victory lap and get back to work!",40,260,width/2)
    
    fill(150,150,255);
    textStyle(NORMAL)
    textSize(22) 
    text("/next/Project/StartPage.js.zip",50,400)
    stroke(150,150,255)
    line(50,410,335,410)
    if(inButton(50,380,335-50,30)){
      if(!mouseDown){
        sceneMan.showScene(Intro)
        mouseDown = true;
        if(!buttonSFX.isPlaying()){
          buttonSFX.play()
        }
      }

    }
    pop()
    push()
    translate(width/2+80,380)
    counter++;
    rotate(radians(sin(counter/20)*10))
    imageMode(CENTER)
    image(happyIcon,0,0,150)
    pop()

    push() // 10101 background Image Scrolling
    iconPos.add(MoveTowards(iconPos,target2,1))
    if(MoveTowards(iconPos,target2,1) == 0){
      iconPos = createVector(target1.x,target1.y);
    }
    tint(150,150,255,150)
    translate(iconPos.x,iconPos.y)
    image(repBG,0,0,200,height)
    image(repBG,0,-height,200,height) // creates an infinite loop
    pop()
  }
}