const defaultEmojis = [
    "☀️",
    "🌕"
]
const maxSpeed = 0.3;

let characters;

let circleRadius;
let arrowWidth;
let fontSize;

let angle = 0;
let angleV = 0;

let lastAngle;
let lastDiff;

let button;

function setup() {
    createCanvas(windowWidth * 0.99, windowHeight * 0.99);
    frameRate(60);

    const minSize = min(width, height);
    circleRadius = ((minSize) / 2) * 0.85;
    arrowWidth = circleRadius * 0.07;
    fontSize = circleRadius * 0.12111;

    createDaButton();

    characters = getCharacters();
}

function createDaButton() {
    button = createButton('SPIN');
    const buttonWidth = circleRadius;
    const buttonHeight = height * 0.03;
    button.position((width / 2) - (buttonWidth / 2), (height - circleRadius * 2) / 2 - buttonHeight);
    button.style("font-size: " + (fontSize / 2) + "px; background-color: #C26E6E");
    button.size(buttonWidth, buttonHeight);
    button.mousePressed(spinDaWheel);
}

function spinDaWheel() {
    if(isZero(angleV)) {
        angleV = random(maxSpeed / 2, maxSpeed);
    }
}

function isZero(number) {
    return abs(number) < 0.00001;
}

function getCharacters() {
    let params = getURLParams();
    const tentativeCharacters = params.characters;
    if(tentativeCharacters) {
        const splitCharacters = tentativeCharacters.split(',');
        if(splitCharacters.length < 2)
            return defaultEmojis;

        const decodedCharacters = [];
        for(let i = 0; i < splitCharacters.length; i++) {
            decodedCharacters.push(decodeURI(splitCharacters[i]));
        }
        return decodedCharacters;
    } else {
        return defaultEmojis;
    }
}

function mouseDragged() {
    if(isZero(angleV)) {
        const v = createVector(pmouseX - width / 2, pmouseY - height / 2);
        angle = v.heading();
    }
}

function mouseReleased() {
    if( isZero(angleV) &&
        !isZero(lastDiff)) {
        const sign = lastDiff / abs(lastDiff);
        angleV = sign * min(maxSpeed, abs(lastDiff));
    }
}


function draw() {
    clear();
    background(220);
    translate(width / 2, height / 2);
    strokeWeight(3);
    ellipse(0, 0, circleRadius * 2, circleRadius * 2);
    const rotationalAmount = TWO_PI / characters.length;
    const halfRotationalAmount = rotationalAmount / 2;
    for(let i = 0; i < characters.length; i++) {
        fill(194, 110, 110);
        rotate(halfRotationalAmount);
        push();
        stroke(252, 194, 110, 100);
        strokeWeight(5);
        line(0, 0, 0, circleRadius - 3);
        pop();
        rotate(halfRotationalAmount);
        textSize(fontSize);
        textAlign(CENTER, CENTER);
        push();
        fill(0);
        text(characters[i], 0, circleRadius * 0.8);
        pop();
    }

    angle += angleV;
    adjustSpeed();

    push();
    drawArrow();
    pop();
}

function adjustSpeed() {
    if(angleV > 0) {
        angleV = max(0, angleV - (0.00005 * deltaTime));
    } else {
        angleV = min(0, angleV + (0.00005 * deltaTime));
    }

    if(isZero(angleV)) {
        button.removeAttribute('disabled');
    } else {
        button.attribute('disabled', true);
    }
}

function drawArrow() {
    push();
    fill(108, 88, 81);
    rotate((-PI / 2) + angle)
    const diff = angle - lastAngle;
    lastAngle = angle;
    lastDiff = diff;
    beginShape();
    vertex(-arrowWidth, -circleRadius * 0.4);
    vertex(arrowWidth, -circleRadius * 0.4);
    vertex(arrowWidth, +circleRadius * 0.55);
    vertex(arrowWidth + arrowWidth, +circleRadius * 0.55);
    vertex(0, +circleRadius * 0.70);
    vertex(-arrowWidth - arrowWidth, +circleRadius * 0.55);
    vertex(-arrowWidth, +circleRadius * 0.55);
    endShape(CLOSE);
    pop();

    push();
    noStroke();
    fill(45);
    ellipse(0, 0, arrowWidth * 0.8);
    pop();
}