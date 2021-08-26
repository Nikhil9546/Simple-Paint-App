var color;
var rectCount;
var rectangle;
var rectDB;
var dragX;
var dragY;
var dragIndexDelete;
var dragIndexMove;
var draggingMove = false;
var moveRect;
var deleteRect;
var currMovingObj;
var currMovingObjDB;
// var output = document.getElementById('output');
var move = document.getElementById('move');
var del = document.getElementById('delete');
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    rect = {},
    moveObj = {},
    drag = false;

del.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.removeEventListener('mousemove', dragObject);
    init();
});

move.addEventListener('click', () => {
    if (draggingMove) {
        move.innerText = 'Move';
        draggingMove = false;
        canvas.addEventListener('mousemove', mouseMove, false);
    } else {
        move.innerText = 'Draw';
        draggingMove = true;
        dragX = 0;
        dragY = 0;
        canvas.removeEventListener('mousemove', mouseMove);
    }
});

canvas.ondblclick = (e) => {
    // alert("double clicked");
    var highestIndex = -1;
    deleteRect = false;
    rect.startX = e.pageX - canvas.offsetLeft;
    rect.startY = e.pageY - canvas.offsetTop;
    // console.log(canvas.offsetLeft);
    for (let i = 0; i < rectCount; i++) {
        if (isRectClicked(rectDB[i], rect.startX, rect.startY)) {
            deleteRect = true;
            if (i > highestIndex) {
                highestIndex = i;
                dragIndexMove = i;
            }
        }
    }
    if (deleteRect) {
        rectangle.splice(dragIndexMove, 1)[0];
        rectDB.splice(dragIndexMove, 1)[0];
        rectCount = rectCount - 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        for (let i = 0; i < rectCount; i++) {
            let corX = rectangle[i].corX;
            let corY = rectangle[i].corY;
            let x = rectangle[i].x;
            let y = rectangle[i].y;
            let rColor = rectangle[i].color;
            ctx.fillStyle = rColor;
            ctx.fillRect(x, y, corX, corY);
            ctx.stroke();
        }
    }
};

function init() {
    rectCount = 0;
    rectangle = [];
    rectDB = [];
    dragX = 0;
    dragY = 0;
    move.innerText = 'Move';
    draggingMove = false;
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}

function mouseDown(e) {
    drag = true;
    moveRect = false;
    currMovingObj = {};
    currMovingObjDB = {};
    canvas.removeEventListener('mousemove', dragObject);
    var highestIndex = -1;
    color = "rgb(" + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ")";
    rect.startX = e.pageX - this.offsetLeft;
    rect.startY = e.pageY - this.offsetTop;
    if (draggingMove)
        for (let i = 0; i < rectCount; i++) {
            if (isRectClicked(rectDB[i], rect.startX, rect.startY)) {
                moveRect = true;
                if (i > highestIndex) {
                    dragX = rect.startX - rectDB[i].x;
                    dragY = rect.startY - rectDB[i].y;
                    highestIndex = i;
                    dragIndexMove = i;
                }
            }
        }
    if (moveRect && draggingMove) {
        // output.innerText = 'True';
        // console.log(`${dragX} - ${dragY}`);
        currMovingObj = rectangle.splice(dragIndexMove, 1)[0];
        currMovingObjDB = rectDB.splice(dragIndexMove, 1)[0];
        rectCount = rectCount - 1;
        moveObj.startX = (e.pageX - this.offsetLeft);
        moveObj.startY = (e.pageY - this.offsetTop);
        canvas.addEventListener('mousemove', dragObject, false);
    }
    //  else {
    //     output.innerText = 'False';
    // }
}

function mouseUp(e) {
    drag = false;
    if (rect.startX === (e.pageX - this.offsetLeft) && rect.startY === (e.pageY - this.offsetTop)) {
        if (!draggingMove || moveRect) {
            rectCount = rectCount + 1;
            rectangle.push(currMovingObj);
            rectDB.push(currMovingObjDB);
        }
    } else {
        if (!draggingMove || moveRect) {
            rectCount = rectCount + 1;
            tempRect = { x: rect.startX, y: rect.startY, corX: rect.w, corY: rect.h, color: color };
            if (moveRect)
                tempRectForDB = { x: rect.startX, y: rect.startY, corX: currMovingObjDB.corX + dragX, corY: currMovingObjDB.corY + dragY, color: color };
            else
                tempRectForDB = { x: rect.startX, y: rect.startY, corX: e.pageX - this.offsetLeft, corY: e.pageY - this.offsetTop, color: color };
            rectangle.push(tempRect);
            rectDB.push(tempRectForDB);
            // console.log(tempRect);
            // console.log(tempRectForDB);
        }
    }
    // console.log(rectCount);
}

function dragObject(e) {
    if (drag) {
        dragX = (e.pageX - this.offsetLeft) - moveObj.startX;
        dragY = (e.pageY - this.offsetTop) - moveObj.startY;
        // console.log(`${dragX} - ${dragY}`);
        rect.startX = currMovingObj.x + dragX;
        rect.startY = currMovingObj.y + dragY;
        rect.w = currMovingObj.corX;
        rect.h = currMovingObj.corY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRectangles();
    }
}

function mouseMove(e) {
    if (drag) {
        rect.w = (e.pageX - this.offsetLeft) - rect.startX;
        rect.h = (e.pageY - this.offsetTop) - rect.startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawRectangles();
    }
}

function isRectClicked(shape, cx, cy) {
    // console.log(shape);
    // console.log(`${cx}, ${cy}`);
    if (cx > shape.x && cx < shape.corX && cy > shape.y && cy < shape.corY)
        return true;
    if (cx > shape.x && cx < shape.corX && cy < shape.y && cy > shape.corY)
        return true;
    if (cx < shape.x && cx > shape.corX && cy > shape.y && cy < shape.corY)
        return true;
    if (cx < shape.x && cx > shape.corX && cy < shape.y && cy > shape.corY)
        return true;
    return false;
}

function drawRectangles() {
    ctx.beginPath();
    for (let i = 0; i < rectCount; i++) {
        let corX = rectangle[i].corX;
        let corY = rectangle[i].corY;
        let x = rectangle[i].x;
        let y = rectangle[i].y;
        let rColor = rectangle[i].color;
        ctx.fillStyle = rColor;
        ctx.fillRect(x, y, corX, corY);
        ctx.stroke();
    }
    if (draggingMove)
        color = currMovingObj.color;
    ctx.fillStyle = color;
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
    ctx.stroke();
}

init();
