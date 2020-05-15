
let playing = true;


const stepFOV = 0.0001;
const FOV = 90;
const sFOV = stepFOV * FOV;
var prev = new Date().getTime();
function main() {
    window.canvas = document.getElementById('canvas');
    canvas.width = 50;
    canvas.height = 50;
    window.ctx = canvas.getContext('2d');
    scene = new Scene(canvas.width, canvas.height);
    data = new Uint8ClampedArray(4 * canvas.width * canvas.height);

    cam = new Camera();

    document.querySelector("#px").value = cam.position.x;
    document.querySelector("#py").value = cam.position.y;
    document.querySelector("#pz").value = cam.position.z;
    document.querySelector("#dx").value = cam.direction.x;
    document.querySelector("#dy").value = cam.direction.y;
    document.querySelector("#dz").value = cam.direction.z;

    window.obj = [];

    //obj.push(new Sphere(0, 0, -2, 3));
    //  obj.push(new Circle(600, 500, 40, { "r": 12 , "g": 0 , "b": 23}));
    //   obj.push(new Box(300, 700, 100, { "r": 80 , "g": 155 , "b": 55}));
    //  obj.push(new Line(0, 0, 1800, 0,{ "r": 255 , "g": 0 , "b": 255}));
    //   obj.push(new Line(0, 0, 0, 1800,{ "r": 255 , "g": 0 , "b": 255}));
    //  obj.push(new Line(1800, 1800, 0, 1800,{ "r": 255 , "g": 0 , "b": 255}));
    ///   obj.push(new Triangle(100, 800, 100, 100, 200, 400,{ "r": 255 , "g": 0 , "b": 255}));
    //   obj.push(new Circle(600, 600, 40,{ "r": 80 , "g": 134 , "b": 7}));
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    canvas.addEventListener("mousemove", (e) => {
        // cam.a = (Math.atan2(cam.y - e.offsetY, cam.x - e.offsetX) * 180 / Math.PI) - FOV / 2;
    });
    sph1 = new Sphere(0, 3, -6, 3);
    sph2 = new Sphere(-1, 0, -5, 3);
    sph3 = new Sphere(1, 2, -5, 3);
    box = new Box(new vec3(0.2,0.2,0.1));
}



function sdfScene(p) {
  return  Math.min(sph1.SDF(p), box.SDF(p)) ;
  return 

   // return Math.max(-sph1.SDF(p),Math.min( sph2.SDF(p),sph3.SDF(p))) ;

}
function loop(time) {

    handleKeyboard();


    if (playing) {
        draw();
        playing = false;
    }
    update();
    requestAnimationFrame(loop);
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
    rPressed = false;
    queueMicrotask(() => { scene.draw() });

}

function draw() {
    scene.render();

    // let data = render(canvas.width, canvas.height);
    //ctx.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0)
}

function update(dt) {
    let time = new Date().getTime();
//    console.warn(time - prev);
    prev = time;
}


requestAnimationFrame(loop);
function handleKeyboard() {

    if (upPressed) {
        console.log("btn");
        cam.upPos();
    } else if (downPressed) {
        console.log("btn");
        cam.downPos();
    } else if (leftPressed) {
        console.log("btn");
        cam.leftPos();
    } else if (rightPressed) {
        console.log("btn");
        cam.rightPos();
    } else if (rPressed) {
        console.log("btn");
        playing = true;
        //  requestAnimationFrame(loop);
    }

}



function clamp(val, min, max) {

    return Math.min(Math.max(min, val), max);

}
function length(p) {
    return Math.sqrt((p.x) ** 2 + (p.y) ** 2 + (p.z) ** 2)
}

class Sphere {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.v = new vec3(this.x, this.y, this.z)

    }
    SDF = (p) => {

        //new Sphere(0,0,0,1).SDF(new vec3(2,2,2),1)

        return p.sub(this.v).norm() - this.r;



    }

}

class Box {
    constructor(v) {
        this.v = v;

    }
    SDF = (p) => {

        //new Sphere(0,0,0,1).SDF(new vec3(2,2,2),1)
        
        let q = p.abs().sub(this.v);

        return length(q.max(0.0)) + Math.min(Math.max(q.x,Math.max(q.y,q.z)),0.0);
       



    }

}

class Camera {
    constructor(
        position = new vec3(2, 0,3),
        direction = new vec3(-1,0, -1),
        right = new vec3(1, 0, 0), // // отдалить и крутить
        field_of_view = Math.PI / 4) {

        this.position = position;
        this.direction = direction;
        this.right = right;
        this.up = direction.cross(right);
        this.field_of_view = field_of_view;
    }

    upPos = () => {
        this.position = this.position.add(new vec3(0, 0, 1));

    }
    downPos = () => {
        this.position = this.position.add(new vec3(0, 0, -1));

    }
    leftPos = () => {
        this.position = this.position.add(new vec3(1, 0, 0));

    }
    rightPos = () => {
        this.position = this.position.add(new vec3(-1, 0, 0));

    }
}













var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var rPressed = false;
function keyDownHandler(e) {

    if (e.code == "KeyD" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.code == "KeyA" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.code == "KeyW" || e.key == "ArrowUp") {
        upPressed = true;
    } else if (e.code == "KeyS" || e.key == "ArrowDown") {
        downPressed = true;
    } else if (e.code == "KeyR") {
        rPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.code == "KeyD" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.code == "KeyA" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.code == "KeyW" || e.key == "ArrowUp") {
        upPressed = false;
    } else if (e.code == "KeyS" || e.key == "ArrowDown") {
        downPressed = false;
    } else if (e.code == "KeyR") {
        rPressed = false;
    }
    document.querySelector("#px").value = cam.position.x;
    document.querySelector("#py").value = cam.position.y;
    document.querySelector("#pz").value = cam.position.z;
    document.querySelector("#dx").value = cam.direction.x;
    document.querySelector("#dy").value = cam.direction.y;
    document.querySelector("#dz").value = cam.direction.z;
}





function drawPix(x, y, color) {
    ctx.beginPath();

    ctx.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.fillRect(x, y, 2, 2);
    ctx.stroke();
}
function drawBox(x, y, x1, y1, color) {
    ctxWolf.beginPath();

    ctxWolf.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctxWolf.fillRect(x, y, x1, y1);
    ctxWolf.stroke();
}
function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, color = { "r": 255, "g": 80, "b": 80 }) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    sub = (p) => {
        return new vec3(this.x - p.x, this.y - p.y, this.z - p.z);
    }
    abs = () => {
        return new vec3(Math.abs(this.x) , Math.abs(this.y), Math.abs(this.z));
    }
    max = (n)=>{
        return new vec3(Math.max(this.x,n) , Math.max(this.y,n), Math.max(this.z,n));
    }
    add = (p) => {
        return new vec3(this.x + p.x, this.y + p.y, this.z + p.z);
    }
    scale = (p) => {
        return new vec3(this.x * p, this.y * p, this.z * p);
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    cross(vector) {
        return new vec3(
            this.y * vector.z - vector.y * this.z,
            this.z * vector.x - vector.z * this.x,
            this.x * vector.y - vector.x * this.y
        )
    }
    normalize() {
        return this.scale(1 / this.norm());
    }
    norm_squared() {
        return this.dot(this);
    }

    norm() {
        return Math.sqrt(this.norm_squared());
    }

}





class Scene {
    constructor(width, height) {
        this.MAX_STEP = 200;
        this.width = width;
        this.height = height;
        this.data = new Uint8ClampedArray(4 * this.width * this.height);
        this.progress = 0;

    }
    march(origin, direction) {
        let total_distance = 0;
        let steps = 0;
        for (; steps < this.MAX_STEP; ++steps) {
            let point = origin.add(direction.scale(total_distance));
            let distance = sdfScene(point);
            total_distance += distance;
            if (distance < 0.0000000000001) {//|| distance > 10000000000
                break;
            }
        }
        let gray = 1 - steps / this.MAX_STEP;
      //  let r = gray;
      ///  let g = gray;
      //  let b = 0;
      //  r *= 255;
      //  g *= 255;
      //  b *= 255;

        //  cb(new vec3(r, g, b));
        //return new vec3(r, g, b);
        return gray;
    }
    render() {
        this.progress = 0;

        //let data = new Uint8ClampedArray(4 * width * height);
        let half_width = Math.tan(Math.PI / 4);
        let half_height = half_width * this.height / this.width;
        let camera_width = half_width * 2;
        let camera_height = half_height * 2;
        let pixel_width = camera_width / (this.width - 1);
        let pixel_height = camera_height / (this.height - 1);

      
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                let right = cam.right.scale(x * pixel_width - half_width);
                let up = cam.up.scale(y * pixel_height - half_height);
                let direction = cam.direction.add(right).add(up).normalize();

                queueMicrotask(() => {
                    let color = this.march(cam.position, direction);
                    this.data[4 * (x + y * this.width) + 0] = color*255;
                    this.data[4 * (x + y * this.width) + 1] = color*255;
                    this.data[4 * (x + y * this.width) + 2] = color*255;
                    this.data[4 * (x + y * this.width) + 3] = 255;

                    this.progress++;
                });
            }
        }
    }
    draw() {

        if (this.progress == (this.width * this.height)) {
            ctx.putImageData(new ImageData(this.data, this.width, this.height), 0, 0)
        }
    }
}