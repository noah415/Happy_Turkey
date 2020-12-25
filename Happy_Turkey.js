var turkeyFamx = [];
var turkeyFamy = [];
var maxTurkey = 3;
var tx = 700;
var ty = 380;
var turkeyHeadRot;
var turkeyLegRot;
var headUp;
var legMovingForward;
var turkeyX;
var turkeyY;
var turkeyScale;
var movingRight;
var movingLeft;
var movingUp;
var movingDown;
var turkeySpeed;
var turkeyMaxSpeed;
var turkeyAccel;
var rotateTurkey;
var turkeyRot;
var walls = [];
var locButcher, dirButcher, butcherRarmRot, butcherLarmRot,
    butcherRlegRot, butcherLlegRot;
var butcherRarmMove = true;
var butcherLarmMove = true;
var butcherRlegMove = false;
var butcherLlegMove = true;
var animateB = false;
var finish = false;
var maxEggs = 10;
var eggX = [];
var eggY = [];
var eggCount;
var turkeyAlive = true;
var blood;
var bleedingT = false;
var bleedingF = false;
var animateB = false;
var fallSpeed = -10;
var fallAccel = 0.5;
var KnifeX;
var KnifeY;
var knifeOppacity = 255;
var knifeOppacityDecreasing = true;
var knifePickedUp = false;
var farmerAlive = true;

function setup()
{
  createCanvas(800, 500);
  locButcher = createVector(width*4/5, height/2);
  dirButcher = createVector(0, 0);
  butcherLarmRot = PI/2;
  butcherRarmRot = -PI/2;
  butcherRlegRot = -PI/4;
  butcherLlegRot = PI/2;

  //sets the default variables for the turkey head
   turkeyHeadRot = -3*PI/8
   headUp = false;
   turkeyX = 200;
   turkeyY = 200;
   turkeyScale = .3;
   turkeyLegRot = 0;
   legMovingForward = true;
   movingUp = false;
   movingDown = false;
   movingRight = false;
   movingLeft = false;
   turkeyMaxSpeed = 20 * turkeyScale;
   turkeySpeed = 2;
   turkeyAccel = .1;
   rotateTurkey = false;
   turkeyRot = 0;
   level = 1;
   eggCount = 0;

   //walls
   //Walls();
   wall1 = new Wall(300, 300, 100, 100);
   walls.push(wall1);
   wall2 = new Wall(500, 100, 200, 300);
   walls.push(wall2);
   wall3 = new Wall(0, 0, 300, 200);
   walls.push(wall3);
   wall4 = new Wall(0, 300, 200, 200);
   walls.push(wall4);
   wall5 = new Wall(400, 100, 100, 85);
   walls.push(wall5);
   walls.push(new Wall(600, 0, 100, 100));

   for(var i = 0; i < walls.length; i++){
       walls[i].createGrass();
   }

   for (var t = 0; t < maxTurkey; t ++)
   {
     turkeyFamx.push(random(100, 200));
     turkeyFamy.push(random(350, 450));
   }

   for (var e = 0; e < maxEggs; e ++)
   {
     eggX.push(random(10, width-10));
     eggY.push(random(10, height-10));
   }

   //knife original conditions
    KnifeX = random(50, 750);
    KnifeY = random(50, 450);
}

function draw()
{
  background('#CC7443');

  //wall stuff
  turkeyMaxSpeed = 20 * turkeyScale;
  for(var i = 0; i < walls.length; i++){
    walls[i].render();
    walls[i].turkeyInGrass();
  }

  for (e = 0; e < maxEggs; e ++)
  {
    eggs(eggX[e], eggY[e]);
  }

  drawButcher();

  if(turkeyAlive && farmerAlive){
    locButcher.add(dirButcher);
    moveBlegs();
    butcherFollow();
    rotateHead();
    walk();
  }

  //turkey stuff
  turkey(turkeyX, turkeyY, turkeyScale, turkeyRot);

  TurkeyDies();


  if (eggCount == maxEggs)
  {
    knife(KnifeX, KnifeY, knifeOppacity);
  }

  if (locButcher.x > width+100 || locButcher.x < -100 || locButcher.y > height+100 || locButcher.y < -100)
  {
    if (turkeyAlive)
    {
      familyTurkeys();
    }

  }

  if (!turkeyAlive)
  {
    wasted();
  }
}

function familyTurkeys()
{
  background(0, 0, 250);
  push();
    fill(0, 230, 0);

    rect(0, height*2/3, width, height/3);

    stroke(255);
    translate(100, 300);
    fill(225, 0, 0);
    rect(-50, -30, 100, 80);
    rect(-25, 0, 25, 50);
    rect(0, 0, 25, 50);
    triangle(-55, -30, 0, -100, 55, -30);
    strokeWeight(2);
    line(-24, 1, 25, 51);
    line(24, 1, -25, 51);
  pop();

  fill(255);
  ellipse(200, 100, 100, 50);
  ellipse(500, 100, 100, 50);
  ellipse(400, 150, 75, 25);
  ellipse(600, 150, 75, 25);

  fill(255, 255, 0);
  ellipse(width, 0, 100);

  fill(250, 0, 0);
  textSize(50);
  textFont("Verdana");
  text("You made it to your fam!", width/6, height/2);



  turkey1(width/3, height*3/4, .5, 0);
  turkey(tx, ty, .5, 0)
  for (t = 0; t < maxTurkey; t ++)
  {
    turkey1(turkeyFamx[t], turkeyFamy[t], 1/4, 0);
  }
}

function wasted()
{
  fill(250, 0, 0);
  textSize(75);
  textFont("Verdana");
  text("WASTED", width/4, height/2);
}

function eggs(x, y)
{
  push();
    translate(x, y);

    fill(250, 250, 0);
    ellipse(0, 0, 20, 30);
  pop();
  for (var e = 0; e < maxEggs; e ++)
  {
    var eggD = dist(turkeyX, turkeyY, eggX[e], eggY[e]);
    if (eggD < 30)
    {
      eggX[e] = 0;
      eggY[e] = -20;
      eggCount += 1;
    }
  }

}

function butcherFollow()
{
  animateB = !animateB;
  if(!knifePickedUp){
    dirButcher.x = turkeyX - locButcher.x;
    dirButcher.y = turkeyY + 50 - locButcher.y;
    dirButcher.normalize();
    dirButcher.mult(1.4);
  }else{
    dirButcher.x = -(turkeyX - locButcher.x);
    dirButcher.y = -(turkeyY + 50 - locButcher.y);
    dirButcher.normalize();
    dirButcher.mult(1.1);
  }
}

function turkey(X, Y, SC, Rot){
    if(!rotateTurkey){
        push();
            translate(X, Y);
            rotate(Rot);
            scale(SC);
            push();
                translate(-35, 10);
                for(var i = 6*PI/12; i > -7*PI/12; i -= 5*PI/48){
                    feather(i);
                }
            pop();
            push();
                translate(0, 40);
                feet(turkeyLegRot);
                feet(-turkeyLegRot);
            pop();
            fill(150, 75, 0);
            //noStroke();
            push();
                translate(25, -20);
                rotate(turkeyHeadRot);
                rect(0, 0, 80, 20);
                ellipse(80, 10, 60);
                fill(255, 255, 0);
                triangle(70, 40, 90, 40, 80, 60);
                fill(255);
                ellipse(90, 20, 15);
                fill(0);
                ellipse(90, 25, 5);
            pop();
            ellipse(0, 0, 100);
        pop();
    } else if(rotateTurkey){
        push();
        translate(X, Y);
        rotate(Rot);
        scale(SC);
        push();
            translate(35, 10);
            for(var i = -6*PI/12; i < 7*PI/12; i += 5*PI/48){
                feather(i);
            }
        pop();
        push();
            translate(0, 40);
            feet(turkeyLegRot);
            feet(-turkeyLegRot);
        pop();
        fill(150, 75, 0);
        //noStroke();
        push();
            translate(-30, -20);
            rotate(turkeyHeadRot);
            rect(0, 0, 80, 20);
            ellipse(80, 10, 60);
            fill(255, 255, 0);
            triangle(70, -20, 90, -20, 80, -40);
            fill(255);
            ellipse(90, 0, 15);
            fill(0);
            ellipse(90, -5, 5);
        pop();
        ellipse(0, 0, 100);
    pop();
    }

}

function feet1(rot, dir){
        push();
            rotate(rot);
            noStroke();
            fill(255, 165, 0);
            rect(-10, 0, 10, 50);
            push();
                translate(0, 50);
                rect(-30, -2.5, 70, 5);
                push();
                    rotate(-PI/12);
                    rect(0, -2.5, 40, 5);
                pop();
                push();
                    rotate(PI/12);
                    rect(0, -2.5, 40, 5);
                pop();
            pop();
        pop();
}

function feet2(rot, dir){
  push();
      rotate(rot);
      noStroke();
      fill(255, 165, 0);
      rect(10, 0, 10, -50);
      push();
          translate(0, 50);
          rect(-40, -2.5, 70, 5);
          push();
              rotate(-PI/12);
              rect(-40, -2.5, 40, 5);
          pop();
          push();
              rotate(PI/12);
              rect(-40, -2.5, 40, 5);
          pop();
      pop();
  pop();
}

function turkey1(X, Y, SC, Rot){
  push();
      translate(X, Y);
      rotate(Rot);
      scale(SC);
      push();
          translate(-35, 10);
          for(var i = 6*PI/12; i > -7*PI/12; i -= 5*PI/48){
              feather(i);
          }
      pop();
      push();
          translate(0, 40);
          feet1(0);
          feet1(0);
      pop();
      fill(150, 75, 0);
      //noStroke();
      push();
          translate(25, -20);
          rotate(-PI/2);
          rect(0, 0, 80, 20);
          ellipse(80, 10, 60);
          fill(255, 255, 0);
          triangle(70, 40, 90, 40, 80, 60);
          fill(255);
          ellipse(90, 20, 15);
          fill(0);
          ellipse(90, 25, 5);
      pop();
      ellipse(0, 0, 100);
  pop();
}

function turkey2(X, Y, SC, Rot){
  push();
  translate(X, Y);
  rotate(Rot);
  scale(SC);
  push();
      translate(35, 10);
      for(var i = -6*PI/12; i < 7*PI/12; i += 5*PI/48){
          feather(i);
      }
  pop();
  push();
      translate(0, 40);
      feet2(0);
      feet2(-0);
  pop();
  fill(150, 75, 0);
  //noStroke();
  push();
      translate(-30, -20);
      rotate(-PI/2);
      rect(0, 0, 80, 20);
      ellipse(80, 10, 60);
      fill(255, 255, 0);
      triangle(70, -20, 90, -20, 80, -40);
      fill(255);
      ellipse(90, 0, 15);
      fill(0);
      ellipse(90, -5, 5);
  pop();
  ellipse(0, 0, 100);
  pop();
}


function drawButcher()
{
  push();
    translate(locButcher.x, locButcher.y);
    scale(3/4);

    noStroke();
    fill(200, 0, 0);

    push();
      translate(0, -60);

      //left arm
      push();
        translate(-18, -50);
        rotate(butcherLarmRot);
        fill(150, 75, 0);
        rect(-30, 45, 30, 3);
        fill(150);
        rect(-30, 45, 15, 15);
        fill(210, 180, 140);
        ellipse(0, 20, 10, 50);
        ellipse(0, 45, 10, 6);
        fill(200, 0, 0);
       rect(-5, -5, 10, 15);
      pop();

      //body
      rect(-20, -60, 40, 60, 3);

      var stripeY = -55;
      var stripeX = -16;
      for (var a = 0; a < 6; a ++)
      {
        fill(0);
        rect(-20, stripeY, 40, 2.5);

        stripeY += 10;
      }

      for (var b = 0; b < 4; b ++)
      {
        fill(0);
        rect(stripeX, -60, 2.5, 60);

        stripeX += 10;
      }

      //neck
      fill(210, 180, 140);
      arc(0, -60, 15, 11, 0, PI);

      //right arm
      push();
        translate(18, -50);
        rotate(butcherRarmRot);
        fill(150, 75, 0);
        rect(0, 45, 30, 3);
        fill(150);
        rect(15, 45, 15, 15);
        fill(210, 180, 140);
        ellipse(0, 20, 10, 50);
        ellipse(0, 45, 10, 6);
        fill(200, 0, 0);
        rect(-5, -5, 10, 15);
      pop();

      //pants
      fill(0, 0, 200);
      rect(-20, 0, 40, 20, 3);

      //left leg
      push();
        translate(-14, 15);
        rotate(butcherLlegRot);
        ellipse(0, 17, 15, 34);
        translate(16, 0);
        ellipse(0, 32, 32, 10);
        fill(150, 75, 0);
        ellipse(18, 36, 10, 20);
      pop();

      //right leg
      push();
        translate(14, 15);
        rotate(butcherRlegRot);
        ellipse(0, 17, 15, 34);
        translate(-16, 0);
        ellipse(0, 32, 32, 10);
        fill(150, 75, 0);
        ellipse(-18, 36, 10, 20);
      pop();

      //HEAD
      push();
        translate(0, -60);
        fill(210, 180, 140);
        ellipse(0, -16, 32);
        fill(0);
        ellipse(-6, -16, 5, 2);
        ellipse(6, -16, 5, 2);
        rect(-16, -28, 5, 12);
        rect(11, -28, 5, 12);
        arc(0, -4, 10, 8, PI, 2*PI);
      pop();
    pop();
    if (butcherLarmRot < PI/10)
    {
      butcherLarmMove = false;
    }
    if (butcherLarmRot > 3*PI/4)
    {
      butcherLarmMove = true;
    }
    if (butcherLarmMove == true)
    {
      butcherLarmRot -= PI/50;
    }
    else
    {
      butcherLarmRot += PI/50;
    }
  //right arm
    if (butcherRarmRot < -3*PI/4)
    {
      butcherRarmMove = false;
    }
    if (butcherRarmRot > -PI/4)
    {
      butcherRarmMove = true;
    }
    if (butcherRarmMove == true)
    {
      butcherRarmRot -= PI/50;
    }
    else
    {
      butcherRarmRot += PI/50;
    }
  pop();
}

function moveBlegs()
{
  locButcher.add(dirButcher);

 //left leg rotation
  if (butcherLlegRot < PI/10)
  {
    butcherLlegMove = false;
  }
  if (butcherLlegRot > PI/2)
  {
    butcherLlegMove = true;
  }
  if (butcherLlegMove == true)
  {
    butcherLlegRot -= PI/30;
  }
  else
  {
    butcherLlegRot += PI/30;
  }
 //right leg rotation
  if (butcherRlegRot < -PI/2)
  {
    butcherRlegMove = false;
  }
  if (butcherRlegRot > -PI/10)
  {
    butcherRlegMove = true;
  }
  if (butcherRlegMove == true)
  {
    butcherRlegRot -= PI/30;
  }
  else
  {
    butcherRlegRot += PI/30;
  }
}

// creates the rotation for the head
function rotateHead(){
    if(!rotateTurkey){
        if(headUp){
            turkeyHeadRot -= PI/96;
        } else {
            turkeyHeadRot += PI/64;
        }
        if(turkeyHeadRot < -PI/2){
            headUp = false;
        } else if(turkeyHeadRot > -PI/8){
            headUp = true;
        }
    } else if(rotateTurkey){
        if(headUp){
            turkeyHeadRot += PI/96;
        } else {
            turkeyHeadRot -= PI/64;
        }
        if(turkeyHeadRot > -PI/2){
            headUp = false;
        } else if(turkeyHeadRot < -7*PI/8){
            headUp = true;
        }
    }

}

//moves the feet
function moveFeet(){
    if(legMovingForward){
        turkeyLegRot += PI/24;
    } else {
        turkeyLegRot -= PI/24;
    }
    if(turkeyLegRot > PI/4){
        legMovingForward = false;
    } else if(turkeyLegRot < -PI/4){
        legMovingForward = true;
    }
}

//decides when it is time to walk based on key held.
function walk(){
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
        rotateTurkey = false;
        if(turkeySpeed < turkeyMaxSpeed){
            turkeySpeed += turkeyAccel;
        }
        turkeyX += turkeySpeed;
        tx += turkeySpeed;
        turkeyRot = 0;
        moveFeet();
    }else if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
        rotateTurkey = true;
        if(turkeySpeed < turkeyMaxSpeed){
            turkeySpeed += turkeyAccel;
        }
        turkeyX -= turkeySpeed;
        tx -= turkeySpeed;
        turkeyRot = 0;
        moveFeet();
    }else if(keyIsDown(UP_ARROW) || keyIsDown(87)){
        turkeyY -= turkeySpeed;
        ty -= turkeySpeed;
        if(turkeySpeed < turkeyMaxSpeed){
            turkeySpeed += turkeyAccel;
        }
        moveFeet();
    }else if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
        turkeyY += turkeySpeed;
        ty += turkeySpeed;
        if(turkeySpeed < turkeyMaxSpeed){
            turkeySpeed += turkeyAccel;
        }
        moveFeet();
    }else{
        turkeyLegRot = 0;
        turkeySpeed = 2;
    }

    if(turkeyX > width + 100*turkeyScale){
        turkeyX = -50*turkeyScale;
    }else if(turkeyX < -100*turkeyScale){
        turkeyX = width + 50*turkeyScale;
    }else if(turkeyY > height + 100*turkeyScale){
        turkeyY = -50*turkeyScale;
    }else if(turkeyY < -100*turkeyScale){
        turkeyY = height + 50*turkeyScale;
    }

    if(tx > width + 100*turkeyScale){
        tx = -50*turkeyScale;
    }else if(tx < -100*turkeyScale){
        tx = width + 50*turkeyScale;
    }else if(ty > height + 100*turkeyScale){
        ty = -50*turkeyScale;
    }else if(ty < -100*turkeyScale){
        ty = height + 50*turkeyScale;
    }
}

//creates the various feathers for the turkey
function feather(rot){
    push();
        rotate(rot);
        fill(150, 75, 0);
        beginShape();
            vertex(0,0);
            vertex(-10, -75);
            vertex(-6, -77);
            vertex(0, -78);
            vertex(6, -77);
            vertex(10, -75);
        endShape(CLOSE);
        fill(200);
        beginShape();
            vertex(-10, -75);
            vertex(-12, -90);
            vertex(-7, -93);
            vertex(0, -94);
            vertex(7, -93);
            vertex(12, -90);
            vertex(10, -75);
            vertex(6, -77);
            vertex(0, -78);
            vertex(-6, -77);
        endShape(CLOSE);
        fill(219,112,147);
        beginShape();
            vertex(-12, -90);
            vertex(-14, -105);
            vertex(-7, -110);
            vertex(0, -111);
            vertex(7, -110);
            vertex(14, -105);
            vertex(12, -90);
            vertex(7, -93);
            vertex(0, -94);
            vertex(-7, -93);
        endShape(CLOSE);
    pop();
}

//creates the feet for the bird
//feet are suposed to move.
function feet(rot, dir){
    if(!rotateTurkey){
        push();
            rotate(rot);
            noStroke();
            fill(255, 165, 0);
            rect(-10, 0, 10, 50);
            push();
                translate(0, 50);
                rect(-30, -2.5, 70, 5);
                push();
                    rotate(-PI/12);
                    rect(0, -2.5, 40, 5);
                pop();
                push();
                    rotate(PI/12);
                    rect(0, -2.5, 40, 5);
                pop();
            pop();
        pop();
    } else if(rotateTurkey){
        push();
            rotate(rot);
            noStroke();
            fill(255, 165, 0);
            rect(10, 0, 10, -50);
            push();
                translate(0, 50);
                rect(-40, -2.5, 70, 5);
                push();
                    rotate(-PI/12);
                    rect(-40, -2.5, 40, 5);
                pop();
                push();
                    rotate(PI/12);
                    rect(-40, -2.5, 40, 5);
                pop();
            pop();
        pop();
    }
}

function Wall(X, Y, L, H){
    this.X = X;
    this.Y = Y;
    this.L = L;
    this.H = H;
    this.grassX1 = [];
    this.grassX2 = [];
    this.grassY1 = [];
    this.grassY2 = [];
    this.grassColor = [];

    this.render = function(){
        push();
            translate(this.X, this.Y);
            //rect(0, 0, this.L, this.H);
            if(level == 1){
                strokeWeight(6);
                for(var i = 0; i < this.grassX1.length; i++){
                    stroke(0, this.grassColor[i], 0);
                    line(this.grassX1[i], this.grassY1[i], this.grassX2[i], this.grassY2[i]);
                }
            }
        pop();
    }

    this.createGrass = function(){
        for(var i = 0; i < this.L; i += 16){
            for(var j = 0; j < this.H; j += 16){
                this.grassX1.push(random(i-4, i+4));
                this.grassX2.push(random(i-10, i+10));
                this.grassY1.push(random(j-4, j+4));
                this.grassY2.push(random(j-20, j-30));
                this.grassColor.push(random(150, 255));
            }
        }
    }

    this.turkeyInGrass = function(){
        if(turkeyX > this.X && turkeyX < this.X + this.L && turkeyY > this.Y && turkeyY < this.Y + this.H){
            turkeyMaxSpeed = 10 * turkeyScale;
            turkeySpeed = turkeyMaxSpeed;
        }
    }
}

function TurkeyDies(){

    if(sqrt(sq(turkeyX - locButcher.x) + sq(turkeyY + 50 - locButcher.y)) < 75 && !knifePickedUp){
        turkeyAlive = false;
    }else if(sqrt(sq(turkeyX - locButcher.x) + sq(turkeyY + 50 - locButcher.y)) < 75 && knifePickedUp){
        farmerAlive = false;
    }
    if(!turkeyAlive && !bleedingT && !knifePickedUp){
        blood = new pSys(locButcher.x, locButcher.y, 4, 1000);
        bleedingT = true;
    }
    if(bleedingT){
        blood.run();
        turkeyY+=fallSpeed;
        fallSpeed+= fallAccel;
        turkeyRot += PI/100;
    }
    if(!farmerAlive && !bleedingF){
        blood = new pSys(locButcher.x, locButcher.y, 4, 1000);
        bleedingF = true;
    }
    if(bleedingF){
        blood.run();
        locButcher.y += fallSpeed;
        fallSpeed += fallAccel;
    }
}

function particle(X, Y, Radius, meanDir){
    if(!knifePickedUp){
        this.X = turkeyX;
        this.Y = turkeyY;
    }else{
        this.X = locButcher.x;
        this.Y = locButcher.y-75;
    }

    this.Radius = Radius;

    this.DX = random(meanDir-1, meanDir+1);
    this.DY = random(-7, -10);
    this.Gravity = 0.5;

    this.render = function(){
        push();
            translate(this.X, this.Y);
            noStroke();
            fill(255, 50, 50);
            ellipse(0, 0, Radius);
        pop();
    }

    this.update = function(){
        this.X += this.DX;
        this.Y += this.DY;
        this.DY += this.Gravity;
    }
}

function pSys(X, Y, R, num){
    this.particles = [];
    this.counter = 0;
    this.direction = 4;
    this.changeInDirection = -0.5;
    this.run = function()
    {

        for(var i = 0; i < 10; i++){
            this.particles.push(new particle(random(X-3, X+3), Y, R, this.direction));
            if(this.particles.length > num){
                this.particles.shift();
            }
        }

        for (var i=0; i < this.particles.length; i++)
        {
            this.particles[i].update();
            this.particles[i].render();
        }
        this.direction += this.changeInDirection;
        if(this.direction < -4){
            this.changeInDirection *= random(-.8, -1.2);
        }
        if(this.direction > 4){
            this.changeInDirection *= random(-.8, -1.2);
        }
    }

}

function knife(X, Y){
    push();
        translate(X, Y);
        fill(150, 75, 0, knifeOppacity);
        rect(0, 0, 30, 3);
        fill(150, 150, 150, knifeOppacity);
        rect(15, 0, 15, 15);
    pop();
    if(!knifePickedUp){
        if (knifeOppacity >= 255){
            knifeOppacityDecreasing = true;
        }
        if (knifeOppacity <= 100){
            knifeOppacityDecreasing = false;
        }
        if(knifeOppacityDecreasing){
            knifeOppacity-=10;
            KnifeY++;
        }else{
            knifeOppacity+=10;
            KnifeY--;
        }
    }else{
        KnifeX = turkeyX;
        KnifeY = turkeyY;
        knifeOppacity = 255;
    }
    if(distance(turkeyX, turkeyY, KnifeX, KnifeY) < 50){
        knifePickedUp = true;
    }

}

function distance(X1, Y1, X2, Y2){
    return(sqrt(sq(Y2-Y1)+sq(X2-X1)));
}
