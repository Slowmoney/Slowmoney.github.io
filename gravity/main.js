class ObjectG {
    constructor(param = { mass: 0, x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 }) {
        this.mass = param.mass;
        this.x = param.x;
        this.y = param.y;
        this.vx = param.vx;
        this.vy = param.vy;
        this.ax = param.ax; //
        this.ay = param.ay;//
    }
}
var sun = {
    "mass": 1000,
    "x": 0,
    "y": 10,
    "vx": 2,
    "vy": 5,
    "ax": 0, //
    "ay": 0,//

}
var obj = [
    new ObjectG({ mass: 2000, x: 500, y: 500, vx: -1, vy: 0, ax: 0, ay: 0 }), //sun
    new ObjectG({ mass: -10, x: 100, y: 320, vx: 10, vy: 6.0, ax: 0, ay: 0 }) //pl
];
var planet = {
    "mass": 10,
    "x": 120,
    "y": 10,
    "vx": 2,
    "vy": 5,
    "ax": 0, //
    "ay": 0,//

}

var G = 1;
//var T = 1;
var anim = true;
function main() {




    window.canvas = document.getElementById("canvas");
    window.canvas.width = document.querySelector("body").offsetWidth - 10;
    window.canvas.height = innerHeight - 21;
    window.ctx = window.canvas.getContext("2d");
    window.obj = [];
    var hold = 0;
    var preve;

    requestAnimationFrame(update);
    window.canvas.addEventListener("mousedown", e => {
        
            hold = new Date().getTime();
            preve = e;
            objectsToDraw.line.xy =  [e.offsetX, e.offsetY];
            objectsToDraw.line.draw = true; ///////
            objectsToDraw.test.obj = new Shape({ "mass": 1, x: e.offsetX, y: e.offsetY, vx: 0, vy: 0, ax: 0, ay: 0, radius: 0 });
            window.obj.push(objectsToDraw.test.obj);
        

    });
    window.canvas.addEventListener("mousemove", e => {
        

          if( objectsToDraw.line.draw){
            objectsToDraw.line.xy[2] = e.offsetX;
            objectsToDraw.line.xy[3] = e.offsetY;
            let size = (new Date().getTime() - hold) / 100;
           
            objectsToDraw.test.obj.m = size;
            objectsToDraw.test.obj.r = size;
            //objectsToDraw.test.obj.vx = (e.offsetX - preve.offsetX) / 2;
           // objectsToDraw.test.obj.vy = (e.offsetY - preve.offsetY) / 2;
         

          }
        if (!anim) {
            //    requestAnimationFrame(update);
        }

    });
    window.canvas.addEventListener("mouseup", e => {
        let size = (new Date().getTime() - hold) / 100;
        objectsToDraw.line.draw = false;
        console.log(objectsToDraw.test.obj);
        objectsToDraw.test.obj.vx = (e.offsetX - preve.offsetX) / 2;
         objectsToDraw.test.obj.vy = (e.offsetY - preve.offsetY) / 2;
        //window.obj.push(objectsToDraw.test.obj);
       // window.obj.push(new Shape({ "mass": size, x: preve.offsetX, y: preve.offsetY, vx: (e.offsetX - preve.offsetX) / 2, vy: (e.offsetY - preve.offsetY) / 2, ax: 0, ay: 0, radius: size }));
    });
    document.addEventListener("keydown", e => {



        switch (e.code) {
            case "KeyC":
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;

            case "KeyS":
                anim = !anim;
                console.log(anim);
                requestAnimationFrame(update);
                break;
            case "KeyW":

                requestAnimationFrame(update);
                break;
            case "KeyD":
                T += 0.01;
                console.log(T);
                break;
            case "KeyA":
                T -= 0.01;
                console.log(T);
                break;
            default:
                break;
        }
        //  requestAnimationFrame(update);

    });
}
window.countFPS = (function () {
    var lastLoop = (new Date()).getMilliseconds();
    var count = 1;
    var fps = 0;

    return function () {
        var currentLoop = (new Date()).getMilliseconds();
        if (lastLoop > currentLoop) {
            fps = count;
            count = 1;
        } else {
            count += 1;
        }
        lastLoop = currentLoop;
        return fps;
    };
}());


var T = 0.1;
var objectsToDraw = {
    "line": {
        "xy": [0, 0, 0, 0],
        "draw": false
    },
    "test": {
        "obj": 0,
        "draw": false
    }
};


function update(dt) {

    document.querySelector(".fps").innerText = countFPS();
    ctx.save();
    ctx.fillStyle = 'rgba(8,8, 255, 0.6)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    if (objectsToDraw.line.draw) {

        drawLine(objectsToDraw.line.xy[0], objectsToDraw.line.xy[1], objectsToDraw.line.xy[2], objectsToDraw.line.xy[3]);
    }
    moveWithGravity(T, window.obj);
    for (let o of window.obj) {
        o.draw();
    }
    try {
        if (window.obj[0].x == NaN) {
            return;
        }
    } catch (error) {

    }
    checkCollision(window.obj);
    if (anim) {
        requestAnimationFrame(update);
    }

}

function drawCircle(x, y, r) {
    window.ctx.beginPath();
    window.ctx.arc(x, y, r, 0, Math.PI * 2, true);
    window.ctx.stroke();
}
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function updatePos(dt) {
    let r = Math.sqrt((obj[1].x - obj[0].x) ** 2 + (obj[1].y - obj[0].y) ** 2)
    obj[1].ax = G * obj[0].mass * (obj[0].x - obj[1].x) / Math.pow(r, 3)
    obj[1].ay = G * obj[0].mass * (obj[0].y - obj[1].y) / Math.pow(r, 3)
    obj[1].vx += dt * obj[1].ax;
    obj[1].vy += dt * obj[1].ay;
    obj[1].x += dt * obj[1].vx
    obj[1].y += dt * obj[1].vy
}

function checkCollision(o) {
    for (let [i, o1] of o.entries()) {

        for (let [j, o2] of o.entries()) {

            if (i < j) {
                let dx = o1.x - o2.x;
                let dy = o1.y - o2.y;
                let d = Math.sqrt(dx ** 2 + dy ** 2);
                if (d < o1.r + o2.r) {


                    /*   let impulse1x = o1.m * o1.vx;
                       let impulse1y = o1.m * o1.vy;
                       let impulse2x = o2.m * o2.vx;
                       let impulse2y = o2.m * o2.vy;
   
                       let dimpx = impulse1x + impulse2x;
                       let dimpy = impulse1y + impulse2y;
                       let newvx = dimpx / (o1.m + o2.m);
                       let newvy = dimpy / (o1.m + o2.m);*/


                    let fi = 0;
                    let teta1 = Math.atan(o1.vx / o1.vy);// угол движения
                    let teta2 = Math.atan(o2.vx / o2.vy);///

                    let v1x = o1.vx;
                    let v2x = o2.vx;
                    let v1y = o1.vy;
                    let v2y = o2.vy;

                    let dm = o1.m + o2.m;
                    let m1 = o1.m;
                    let m2 = o2.m;

                    let v1sx = ((v1x * Math.cos(teta1 - fi) * (dm) + 2 * m2 * v2x * Math.cos(teta2 - fi)) / (dm)) * Math.cos(fi) + v1x * Math.sin(teta1 - fi) * Math.cos(fi + Math.PI / 2);
                    let v1sy = ((v1y * Math.cos(teta1 - fi) * (dm) + 2 * m2 * v2y * Math.cos(teta2 - fi)) / (dm)) * Math.sin(fi) + v1y * Math.sin(teta1 - fi) * Math.sin(fi + Math.PI / 2);



                    let v2sx = ((v2x * Math.cos(teta2 - fi) * (dm) + 2 * m1 * v1x * Math.cos(teta1 - fi)) / (dm)) * Math.cos(fi) + v2x * Math.sin(teta2 - fi) * Math.cos(fi + Math.PI / 2);
                    let v2sy = ((v2y * Math.cos(teta2 - fi) * (dm) + 2 * m1 * v1y * Math.cos(teta1 - fi)) / (dm)) * Math.sin(fi) + v2y * Math.sin(teta2 - fi) * Math.sin(fi + Math.PI / 2);
                    o1.vx = v1sx;
                    o1.vy = v1sy;
                    o2.vx = v2sx;
                    o2.vy = v2sy;
                    if (o1.m > o2.m) {
                        o.splice(j, 1);
                    } else {
                        o.splice(i, 1);
                    }
                }



            }

        }
        if ((o1.y > canvas.height)) {
            o1.vy = -o1.vy;
        }
        if ((o1.x > canvas.width)) {
            o1.vx = -o1.vx;
        }
        if ((o1.y < 0)) {
            o1.vy = -o1.vy;
        }
        if ((o1.x < 0)) {
            o1.vx = -o1.vx;
        }
    }
}


var maxSpeed = 10;
class Shape {
    constructor(param) {
        this.x = param.x;
        this.y = param.y;
        this.r = param.radius;
        this.ax = param.ax;
        this.ay = param.ay;
        this.m = param.mass;
        this.vx = param.vx;
        this.vy = param.vy;
        this.fx = 0;
        this.fy = 0;
        this.track = [];
    }

    move(dt) {
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        if (this.vx > maxSpeed) {
            this.vx = maxSpeed
        }
        if (this.vx < -maxSpeed) {
            this.vx = -maxSpeed
        }
        if (this.vy > maxSpeed) {
            this.vy = maxSpeed
        }
        if (this.vy < -maxSpeed) {
            this.vy = -maxSpeed
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw() {




        if (this.track.length >= 100) {
            this.track.shift([this.x, this.y]);
        }
        this.track.push([this.x, this.y]);



        try {
            ctx.beginPath();


            for (let i = 0; i < this.track.length; i++) {
                // this.drawCircle(this.track[i][0], this.track[i][1], 1);


                ctx.moveTo(this.track[i][0], this.track[i][1]);
                ctx.arc(this.track[i][0], this.track[i][1], 1, 0, Math.PI * 2, false);
            }


            //  this.drawCurve(this.x,this.y,this.track[this.track.length - 1][0],this.track[this.track.length - 1][1],this.track[50][0],this.track[50][1]);
        } catch (error) {
            console.log(error);
        }



        //this.drawCircle(this.x, this.y, this.r);
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fillText([Math.floor(this.x), Math.floor(this.y)], this.x + this.r + 10, this.y);
        ctx.closePath();
        ctx.fill();
    }
    drawCurve(otx, oty, kx, ky, cx, cy) {
        ctx.beginPath();
        ctx.moveTo(otx, oty);
        ctx.quadraticCurveTo(cx, cy, kx, ky);
        ctx.stroke();
    }
    drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }



}
function moveWithGravity(dt, o) {

    for (let o1 of o) {
        o1.fx = 0;
        o1.fy = 0;
    }
    for (let [i, o1] of o.entries()) {
        for (let [j, o2] of o.entries()) {
            if (i < j) {
                let dx = o2.x - o1.x;
                let dy = o2.y - o1.y;
                let r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                if (r < 1) {
                    r = 1;
                }
                let f = (1000 * o1.m * o2.m) / Math.pow(r, 2);
                let fx = f * dx / r;
                let fy = f * dy / r;
                o1.fx += fx;
                o1.fy += fy;
                o2.fx -= fx;
                o2.fy -= fy;
            }
        }
    }
    for (let o1 of o) {
        let ax = o1.fx / o1.m;
        let ay = o1.fy / o1.m;

        o1.vx += ax * dt;
        o1.vy += ay * dt;

        o1.x += o1.vx * dt;
        o1.y += o1.vy * dt;
    }



}