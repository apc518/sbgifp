const WIDTH = 540;
const HEIGHT = 360;

class Color {
    constructor(gradient, meaning, intensity){
        this.gradient = gradient;
        this.meaning = meaning;
        this.saturation = Math.max(Math.min(1, intensity), 0);
    }

    rgb(){
        return [
            ((1 - this.saturation) * this.gradient[0][0] + this.saturation * this.gradient[1][0]), 
            ((1 - this.saturation) * this.gradient[0][1] + this.saturation * this.gradient[1][1]), 
            ((1 - this.saturation) * this.gradient[0][2] + this.saturation * this.gradient[1][2]) 
        ]
    }
}

let gray = new Color([[100, 100, 100], [50, 50, 50]], "Agender", 0.5);
let pink = new Color([[220, 130, 220], [255, 50, 255]], "Feminine", 0.5);
let blue = new Color([[150, 150, 255], [0, 0, 255]], "Masculine", 0.5);
let green = new Color([[100, 255, 100], [0, 255, 0]], "Fluid", 0.5);
let yellow = new Color([[255, 255, 100], [255, 255, 0]], "Genderqueer", 0.5);
let purple = new Color([[165, 70, 165], [150, 20, 180]], "Bigender", 0.5);
let white = new Color([[200, 200, 200], [255, 255, 255]], "Static", 0.5);

const nameToColor = {
    "static": white,
    "feminine": pink,
    "masculine": blue,
    "agender": gray,
    "fluid": green,
    "genderqueer": yellow,
    "static": white,
    "bigender": purple
}

let colors = [];

let checkboxes = document.querySelectorAll(".gender-checkbox");
let sliders = document.querySelectorAll(".gender-slider");

console.log(checkboxes);

function updateColors(){
    let newColors = [];
    for(let item of items){
        // if the checkbox for this item is checked, add its color with the saturation from its slider to the color list
        let name = item.id.split("-")[0];
        if(document.getElementById(name + "-checkbox").checked){
            newColors.push(nameToColor[name].rgb());
        }
    }

    colors = newColors;
}

for(let cb of checkboxes){
    cb.onchange = () => {
        let slider = document.getElementById(cb.id.split("-")[0] + "-slider");
        slider.disabled = !slider.disabled;
        updateColors();
    }
}

for(let slider of sliders){
    slider.oninput = () => {
        let name = slider.id.split("-")[0];
        let val = slider.value / 100;
        nameToColor[name].saturation = val;
        updateColors();
    }
}

function setup(){
    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent("p5div");
    frameRate(20);
}

function draw(){
    background(50, 0, 0);

    textAlign(CENTER);
    fill(220);
    text("Check some boxes! Slide some sliders!", WIDTH / 2, HEIGHT / 2)

    if(colors.length < 1) return;

    push();
    noStroke();
    let rowHeight = HEIGHT / (colors.length * 2 - 1);
    
    for(let i = 0; i < colors.length - 1; i++){
        let currentColor = colors[colors.length - i - 1];
        fill(currentColor);
        rect(0, i * rowHeight, WIDTH, rowHeight);
    }
    fill(colors[0]);
    rect(0, rowHeight * (colors.length - 1), WIDTH, rowHeight);
    for(let i = 1; i < colors.length; i++){
        let currentColor = colors[i];
        fill(currentColor);
        rect(0, (i + colors.length - 1) * rowHeight, WIDTH, rowHeight);
    }

    pop();
}