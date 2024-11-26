const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawGrid() {
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function drawAxis() {
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

function drawPixel(x, y) {
    ctx.fillRect(x, y, 1, 1);
}

function drawLineStep(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = x0;
    let y = y0;
    for (let i = 0; i <= steps; i++) {
        drawPixel(Math.round(x), Math.round(y));
        x += xIncrement;
        y += yIncrement;
    }
}

function drawLineDDA(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    let x = x0;
    let y = y0;
    for (let i = 0; i <= steps; i++) {
        drawPixel(Math.round(x), Math.round(y));
        x += xIncrement;
        y += yIncrement;
    }
}

function drawLineBresenham(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        drawPixel(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function drawCircleBresenham(x0, y0, radius) {
    let x = radius;
    let y = 0;
    let err = 0;

    while (x >= y) {
        drawPixel(x0 + x, y0 + y);
        drawPixel(x0 + y, y0 + x);
        drawPixel(x0 - y, y0 + x);
        drawPixel(x0 - x, y0 + y);
        drawPixel(x0 - x, y0 - y);
        drawPixel(x0 - y, y0 - x);
        drawPixel(x0 + y, y0 - x);
        drawPixel(x0 + x, y0 - y);

        if (err <= 0) {
            y += 1;
            err += 2 * y + 1;
        }
        if (err > 0) {
            x -= 1;
            err -= 2 * x + 1;
        }
    }
}

document.getElementById('draw').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawAxis();

    const algorithm = document.getElementById('algorithm').value;
    const x0 = parseInt(document.getElementById('x0').value);
    const y0 = parseInt(document.getElementById('y0').value);
    const x1 = parseInt(document.getElementById('x1').value);
    const y1 = parseInt(document.getElementById('y1').value);
    const radius = parseInt(document.getElementById('radius').value);

    const startTime = performance.now();

    switch (algorithm) {
        case 'step':
            drawLineStep(x0, y0, x1, y1);
            break;
        case 'dda':
            drawLineDDA(x0, y0, x1, y1);
            break;
        case 'bresenhamLine':
            drawLineBresenham(x0, y0, x1, y1);
            break;
        case 'bresenhamCircle':
            drawCircleBresenham(x0, y0, radius);
            break;
    }

    const endTime = performance.now();
    console.log(`Время выполнения: ${endTime - startTime} мс`);
});