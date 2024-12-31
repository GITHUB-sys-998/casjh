let chars, particles, canvas, ctx, w, h, current;
let duration = 5000;
let str = ['HAPPY', 'NEW', 'YEAR' , '2025'];
let animationStarted = false;
let startTime = null;
let stars = [];

init();
resize();
createStartButton();
initBackground();
addEventListener('resize', resize);

function initBackground() {
    stars = [];
    // Initialize stars for full screen circular motion
    for(let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 2,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * Math.min(w, h) * 0.8,
            speed: 0.0005 + Math.random() * 0.001,
            opacity: Math.random()
        });
    }
}

function drawBackground() {
    // Animate stars in circular motion
    stars.forEach(star => {
        star.angle += star.speed;
        star.opacity = 0.3 + Math.sin(Date.now() * 0.001 + star.angle) * 0.7;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function init() {
    canvas = document.createElement('canvas');
    document.body.append(canvas);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';
    document.body.style.background = 'black';
    ctx = canvas.getContext('2d');
}

function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    particles = innerWidth<400? 55 : 99;
    initBackground();
}

function makeChar(c){
    let tmp = document.createElement('canvas');
    let size = tmp.width = tmp.height = w<400?200:300;
    let tmpCtx = tmp.getContext('2d');
    tmpCtx.font = 'bold '+size+'px Arial';
    tmpCtx.fillStyle = 'white';
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size/2, size/2);
    let char2 = tmpCtx.getImageData(0,0,size,size);
    let char2particles = [];
    for(var i=0; char2particles.length< particles; i++){
        let x = size*Math.random();
        let y = size*Math.random();
        let offset = parseInt(y)*size*4 + parseInt(x)*4;
        if(char2.data[offset])
            char2particles.push([x-size/2,y-size/2])
    }
    return char2particles;
}

function makeChars(t) {
    if (!animationStarted) return;
    let elapsed = t - startTime;
    let actual = Math.floor((elapsed % (duration * str.length)) / duration);
    if (current === actual) return;
    current = actual;
    chars = [...str[actual]].map(makeChar);
}

function render(t) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, w, h);
    
    drawBackground();
    
    makeChars(t);
    if (chars && animationStarted) {
        chars.forEach((pts,i) => firework(t, i, pts));
    }
    
    requestAnimationFrame(render);
}

function firework(t, i, pts) {
    if (!startTime) return;
    t -= startTime;
    t -= i*200;
    let id = i + chars.length*parseInt(t - t%duration);
    t = t % duration / duration;
    let dx = (i+1)*w/(1+chars.length);
    dx += Math.min(0.33, t)*100*Math.sin(id);
    let dy = h*0.5;
    dy += Math.sin(id*4547.411)*h*0.1;
    if (t < 0.33) {
        rocket(dx, dy, id, t*3);
    } else {
        explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t-0.33)*2));
    }
}

function rocket(x, y, id, t) {
    ctx.fillStyle = 'white';
    let r = 2-2*t + Math.pow(t, 15*t)*16;
    y = h - y*t;
    circle(x, y, r)
}

function explosion(pts, x, y, id, t) {
    let dy = (t*t*t)*20;
    let r = Math.sin(id)*1 + 3  
    r = t<0.5 ? (t+0.5)*t*r:r-t*r
    ctx.fillStyle = `hsl(${id*55}, 55%, 55%)`;
    pts.forEach((xy,i) => {
        if (i%20 === 0)
            ctx.fillStyle = `hsl(${id*55}, 55%, ${55+t*Math.sin(t*55+i)*45}%)`;
        circle(t*xy[0] + x, h - y + t*xy[1] + dy, r)
    });
}

function circle(x,y,r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, 6.283);
    ctx.fill();
}

function createStartButton() {
    const button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.left = '50%';
    button.style.top = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '15px 30px';
    button.style.border = '2px solid white';
    button.style.borderRadius = '25px';
    button.style.background = 'linear-gradient(45deg, #0033cc, #0099ff)';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '10px';
    button.style.boxShadow = '0 0 15px #0099ff';
    button.style.transition = 'all 0.3s ease';
    button.style.zIndex = '1000';

    const catLogo = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    catLogo.setAttribute("width", "30");
    catLogo.setAttribute("height", "30");
    catLogo.setAttribute("viewBox", "0 0 24 24");
    catLogo.innerHTML = `
        <path fill="black" d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8Z"/>
    `;

    const text = document.createElement('span');
    text.textContent = 'Meow^^';
    text.style.color = 'black';
    text.style.fontSize = '18px';
    text.style.fontWeight = 'bold';

    button.appendChild(catLogo);
    button.appendChild(text);

    button.addEventListener('mouseover', () => {
        button.style.transform = 'translate(-50%, -50%) scale(1.1)';
        button.style.boxShadow = '0 0 25px #0099ff';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'translate(-50%, -50%)';
        button.style.boxShadow = '0 0 15px #0099ff';
    });

    button.addEventListener('click', () => {
        button.remove();
        animationStarted = true;
        startTime = performance.now();
        requestAnimationFrame(render);
    });

    document.body.appendChild(button);
}

// Start the initial render for background
requestAnimationFrame(render);