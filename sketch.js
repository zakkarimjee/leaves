/// <reference path="./p5.global-mode.d.ts" />

function setup(){
    frameRate(25)
    createCanvas(1200,600)
    colorMode(HSB)
    background('#f4eec7')
    plant = new Shoot(1,[0,-5],[width/2,height])
}

function draw(){
    plant.tick(2)
    
}