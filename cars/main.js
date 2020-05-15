class Game {
    constructor(canvas, width, height) {
        this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        this.obj = [];
        this.keyDown = [];
        this.toDraw = []
        this.canvas.addEventListener("mousedown", (e) => {
            window.canvasButtons.forEach((but) => {
                but.click(e.offsetX, e.offsetY);
            });
        });
    }
    clear = () => {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
    handleKeyboard = (key) => {
        if (key.type == "keydown") {
            this.keyDown[key.keyCode] = true;
            if (key.keyCode == 70) {
                neuroStep();
            }
        } else {
            this.keyDown[key.keyCode] = false;
        }
    }
    draw = () => {
        this.toDraw.forEach((e) => {
            e();
        })
    }
}
class Button {
    constructor(xy = [0, 0, 0, 0, 50, 50], ctx, name = "", attr = [{ checkBox: true }], callback) {
        window.canvasButtons.push(this)
        this.ctx = ctx;
        this.x = (xy[0] == undefined) ? 0 : xy[0];

        this.y = (xy[1] == undefined) ? 0 : xy[1];
        this.offsetX = (xy[2] == undefined) ? 0 : xy[2];

        this.offsetY = (xy[3] == undefined) ? 0 : xy[3];
        this.boxszx = (xy[4] == undefined) ? 50 : xy[4];
        this.boxszy = (xy[5] == undefined) ? 50 : xy[5];

        this.checkBox = attr[0].checkBox;
        this.stroke = attr[0].stroke;
        this.name = name;
        this.a = [];
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                this.a.push({
                    x: x * this.boxszx + this.offsetX,
                    y: y * this.boxszy + this.offsetY,
                    color: "#ff0000",
                    checked: false,
                    attr: {

                    }
                });
            }
        }
        this.callback = callback;
    }
    click = (x, y, t) => {
        let i;
        this.a.forEach((b, ib) => {
            if ((x >= b.x && x < b.x + this.boxszx) && (y >= b.y && y < b.y + this.boxszy)) {
                if (this.checkBox) {
                    if (t) {
                        b.checked = t;
                    } else {
                        b.checked = !b.checked;
                    }



                }
                if (typeof (this.callback) == "function") {
                    this.callback(this);
                }
                i = ib;
                return;
            }
        });
        return i;
    }
    draw = () => {
        //this.drawBox(this.offsetX, this.offsetY, "#fff", false, this.boxszx * this.x, this.boxszy * this.y, true)
        this.a.forEach((e, i) => {
            this.drawBox({ x: e.x, y: e.y, color: e.color, c: e.checked, szx: this.boxszx, szy: this.boxszy, s: this.stroke, n: i })
        });

    }
    drawBox = (options = { x, y, color, c, szx, szy, s, n }) => {

        this.ctx.save();

        this.ctx.beginPath();

        this.ctx.rect(options.x, options.y, options.szx, options.szy);

        if (options.c) {
            this.ctx.fillStyle = options.color;
            this.ctx.fill()
        }
        if (options.s) {
            this.ctx.stroke();
        }
        this.ctx.addHitRegion({ id: [options.n, this.name] })
        this.ctx.restore()
    }
};
class Level {
    constructor(game) {
        this.ctx = game.ctx;
        game.toDraw.push(this.draw)
        this.level = [];
        //this.level.push(new Ellipse(600, 50,  { "r": 12, "g": 0, "b": 23 }, this.ctx));
        // this.level.push(new Circle(600, 500, 40, { "r": 12, "g": 0, "b": 23 }, this.ctx));
        this.level.push(new Box(500, 500, 800, { "r": 80, "g": 155, "b": 55 }, this.ctx));
        /*   this.level.push(new Line(0, 0, 500, 0, { "r": 255, "g": 0, "b": 255 }, this.ctx));
          this.level.push(new Line(0, 0, 0, 500, { "r": 255, "g": 0, "b": 255 }, this.ctx));
          this.level.push(new Line(500, 500, 0, 500, { "r": 255, "g": 0, "b": 255 }, this.ctx)); */
        /*  this.level.push(new Triangle(100, 800, 100, 100, 200, 400, { "r": 255, "g": 0, "b": 255 }, this.ctx));
         this.level.push(new Circle(600, 600, 40, { "r": 80, "g": 134, "b": 7 }, this.ctx)); */
    }
    drawCircle = (x, y, r, color) => {
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#fff"
        this.ctx.strokeStyle = "rgb(" + color * 0 + "," + color * 255 + "," + 0 + ")"
        this.ctx.lineWidth = color * 5 + 1;
        this.ctx.fill();
        this.ctx.stroke()
        this.ctx.restore()
    }
    drawLine = (x0, y0, x1, y1, color) => {
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.strokeStyle = "rgb(" + color * 0 + "," + color * 255 + "," + 0 + ")"
        this.ctx.lineWidth = color * 5;
        this.ctx.stroke();
        this.ctx.restore()
    }
    drawText = (x, y, t) => {
        this.ctx.font = this.text.font;
        this.ctx.fillText(t, x, y);
    }
    draw = () => {
        this.level.forEach(d => {
            d.draw()
        });
    }
}
class Car {
    constructor(game, x, y, level) {
        this.game = game;
        game.toDraw.push(this.draw)
        this.ctx = game.ctx;

        this.level = level;
        this.height = this.ctx.canvas.height;
        this.width = this.ctx.canvas.width;
        game.obj.push(this);
        this.x = x;
        this.y = y;
        this.a = 0;
        this.speed = 0;
        this.topSpeed = 16;
        this.acceleration = 0.5;
        this.friction = 0.1;
        this.brakeFriction = 1;
        this.ast = 2;
        this.size = [40, 60]
        this.keys =
        {
            up: {
                keyCode: 87,
                callback: this.forward
            },

            brake: {
                keyCode: 83,
                callback: this.brake
            },
            back: {
                keyCode: 83,
                callback: this.back
            },
            right: {
                keyCode: 65,
                callback: this.right
            },
            left: {
                keyCode: 68,
                callback: this.left
            },
        }
        this.points = [];



    }
    drawCircle = (x, y, r, color) => {
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.arc(x, y, Math.abs(r), 0, 2 * Math.PI);
        //this.ctx.fillStyle = "#fff"
        this.ctx.strokeStyle = color
        //this.ctx.lineWidth = color * 5 + 1;
        //this.ctx.fill();
        this.ctx.stroke()
        this.ctx.restore()
    }
    drawBox = (x, y, color, f, szx, szy) => {

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, szx, szy);

        if (f) {
            this.ctx.fillStyle = color;
            this.ctx.fill()
        }
        this.ctx.strokeStyle = color;

        this.ctx.stroke();
        this.ctx.restore()
    }
    drawCar = (x, y, color, f, szx, szy) => {

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.a * Math.PI / 180);
        this.ctx.beginPath();
        this.ctx.rect(0, 0, szx, szy);

        if (f) {
            this.ctx.fillStyle = color;
            this.ctx.fill()
        }
        this.ctx.strokeStyle = color;

        this.ctx.stroke();
        //this.drawBox(0,0,"#000",false,300,300)
        this.ctx.restore()

    }
    draw = () => {
        this.drawBox(0, 0, "#000", false, this.ctx.canvas.width, this.ctx.canvas.height)
        this.drawCar((Math.cos((this.a) * Math.PI / 180) * -20) + this.x, (Math.sin((this.a) * Math.PI / 180) * -20) + this.y, "#000", false, this.size[0], this.size[1])
        let radius = this.getDistance(this.x, this.y);
        this.drawCircle(this.x, this.y, Math.abs(radius), "#0f0");
        let side = [];//0, -180, -90, 90
        for (let i = 45; i < 360 - 180; i += 45) {
            side.push(i)

        }
        let four = [
            /* { x: this.xcos(this.a + side[0], radius, this.x), y: this.ysin(this.a + side[0], radius, this.y), dist: radius, a: side[0] },
            { x: this.xcos(this.a + side[1], radius, this.x), y: this.ysin(this.a + side[1], radius, this.y), dist: radius, a: side[1] },
            { x: this.xcos(this.a + side[2], radius, this.x), y: this.ysin(this.a + side[2], radius, this.y), dist: radius, a: side[2] },
            { x: this.xcos(this.a + side[3], radius, this.x), y: this.ysin(this.a + side[3], radius, this.y), dist: radius, a: side[3] }, */
        ];
        side.forEach((s, i) => {
            four.push({ x: this.xcos(this.a + s, radius, this.x), y: this.ysin(this.a + s, radius, this.y), dist: radius, a: s });
        });
        four.forEach((f, i) => {
            this.drawLine(f.x, f.y, this.x, this.y, "#000")
            let m = this.march(f.x, f.y, f.dist, f.a)
            f.dist = m[0];
            this.drawLine(f.x, f.y, m[1], m[2], "#000")
            this.drawBox(m[1] - 15, m[2] - 15, "#000", true, 20, 20);
            //this.drawCircle(m[1], m[2], 100, "#f0f");
            //console.log(f.dist);
            // this.drawLine(10+i * 10, 0, 10+i * 10, f.dist, "#000",10)
        });
        //

        let t = four.map((e) => { return e.dist });
        let tmax = Math.max.apply(Math, t);
        window.train = t.map((e, i) => { return isNaN(e / tmax) ? (((i == 0) ? 0.6 : ((i == 1) ? 0.3 : ((i == 2) ? 1 : 0)))) : (e / tmax) })
        this.drawLine(0, this.y, this.height, this.y, "#000")
        this.drawLine(this.x, 0, this.x, this.height, "#000")
        this.drawBox(0, 0, "#000", false, this.height, this.width)
        this.points.push([this.x, this.y]);
        if (this.points.length >= 500) {
            this.points.shift()
        }

        this.points.forEach(e => {
            this.drawBox(e[0], e[1], "#000", true, 1, 1);
        });

    }

    march = (stx, sty, dist, angel = 0) => {

        let total = dist;
        let x = stx;
        let y = sty;

        for (let i = 0; i < 100; i++) {
            let d = this.marchStep(x, y)
            this.drawCircle(x, y, d, "#0f0");
            //this.drawBox(x, y, "#000", true, 5, 5);
            total += d;
            if (d < 0.0001) {
                break;
            }
            x = this.xcos(this.a + angel, d, x)
            y = this.ysin(this.a + angel, d, y)
        }
        return [total, x, y];
    }

    marchStep = (x, y) => {
        let dist = this.getDistance(x, y);
        return dist;
    }
    getDistance = (x, y) => {
        //return Math.min.apply(Math, [x, y, this.width - x, this.height - y]);
        let d = this.level.level[0].distance(x, y);
        for (var i = 1; i < this.level.level.length; i++) {
            let k = this.level.level[i].distance(x, y);
            if (k < d) {
                d = k;
            }
        }
        return Math.min.apply(Math, [x, y, this.width - x, this.height - y, d]);
        //return 
    }
    xcos = (a, r, x) => {
        return (Math.cos((a) * Math.PI / 180) * r) + x
    }
    ysin = (a, r, y) => {
        return (Math.sin((a) * Math.PI / 180) * r) + y;
    }
    getCol = (b, a) => {
        let x1 = b * Math.tan((a) * Math.PI / 180);
        return x1;
    }
    drawLine = (x0, y0, x1, y1, color, l = 1) => {
        this.ctx.save()
        this.ctx.beginPath();
        //this.ctx.translate(-20, -20);
        this.ctx.moveTo(x0, y0);

        this.ctx.lineTo(x1, y1);
        //this.ctx.lineTo((Math.cos((this.a) * Math.PI / 180)*20)+this.x, (Math.sin((this.a) * Math.PI / 180)*20)+this.y);
        this.ctx.strokeStyle = color
        this.ctx.lineWidth = l;
        this.ctx.stroke();
        //this.drawBox(0,0,"#000",false,300,300)
        this.ctx.restore()
    }
    collision = () => {

    }
    intersect = () => {

    }
    forward = () => {
        this.speed += this.acceleration;
        if (this.speed > this.topSpeed) {
            this.speed = this.topSpeed
        }
    }
    back = () => {
        this.speed -= this.acceleration;
        if (this.speed < -this.topSpeed) {
            this.speed = -this.topSpeed
        }
    }
    brake = (s) => {
        this.speed -= s ? this.brakeFriction : this.friction;
        if (this.speed < 0) {
            this.speed = 0;
        }
    }
    left = () => {
        this.a += this.ast;
        if (this.a >= 360) {
            this.a = 0;
        }
    }
    right = () => {
        this.a -= this.ast;
        if (this.a <= 0) {
            this.a = 360;
        }
    }
    speedk = (k, a) => {
        this.speed += this.acceleration * k
        this.a += a;
        if (this.speed > this.topSpeed) {
            this.speed = this.topSpeed
        }
    }
    handleKeyboard = () => {
        if (this.game.keyDown[this.keys.up.keyCode]) {
            this.keys.up.callback()
            if (this.game.keyDown[this.keys.left.keyCode]) {
                this.keys.left.callback()
            } else if (this.game.keyDown[this.keys.right.keyCode]) {
                this.keys.right.callback()
            }
        } else {
            this.keys.brake.callback(this.game.keyDown[this.keys.brake.keyCode]);
        }
    }
    step = (dt) => {
        this.x -= Math.sin(this.a * (Math.PI / 180)) * this.speed;
        this.y += Math.cos(this.a * (Math.PI / 180)) * this.speed;
        if (this.x >= this.width) {
            this.x = this.width
        }
        if (this.y >= this.height) {
            this.y = this.height
        }
        if (this.x <= 0) {
            this.x = 0
        }
        if (this.y <= 0) {
            this.y = 0
        }

    }
}
class Circle {
    constructor(x, y, r, color = { "r": 255, "g": 0, "b": 255 }, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    distance = (x, y) => {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) - this.r;
    }
    draw = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        this.ctx.stroke();
    }
}
class Line {
    constructor(x, y, x1, y1, color = { "r": 255, "g": 0, "b": 255 }, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.color = color;
    }
    distance = (x, y) => {
        const p0p1X = this.x - this.x1;
        const p0p1Y = this.y - this.y1;
        const l2 = p0p1X * p0p1X + p0p1Y * p0p1Y;
        const pp0X = x - this.x;
        const pp0Y = y - this.y;
        if (l2 === 0) {
            return pp0X * pp0X + pp0Y * pp0Y;
        }
        const p1p0X = this.x1 - this.x;
        const p1p0Y = this.y1 - this.y;
        const t = this.clamp((pp0X * p1p0X + pp0Y * p1p0Y) / l2, 0, 1);
        const ptX = this.x + t * p1p0X;
        const ptY = this.y + t * p1p0Y;
        const pX = x - ptX;
        const pY = y - ptY;
        return Math.sqrt(pX * pX + pY * pY);
    }
    clamp = (val, min, max) => {
        return Math.min(Math.max(min, val), max);
    }
    draw = () => {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x1, this.y1);
        this.ctx.stroke();
    }
}
class Triangle {
    constructor(x1, y1, x2, y2, x3, y3, color = { "r": 255, "g": 0, "b": 255 }, ctx) {
        this.ctx = ctx;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.color = color;
    }
    distance = (x, y) => {
        const centerX = (this.x1 + this.x2 + this.x3) / 3;
        const centerY = (this.y1 + this.y2 + this.y3) / 3;
        const cpX = centerX - x;
        const cpY = centerY - y;
        const edge0X = this.x2 - this.x1;
        const edge0Y = this.y2 - this.y1;
        const edge1X = this.x3 - this.x2;
        const edge1Y = this.y3 - this.y2;
        const edge2X = this.x1 - this.x3;
        const edge2Y = this.y1 - this.y3;
        const denominator0 = edge0Y * cpX - edge0X * cpY;
        const denominator1 = edge1Y * cpX - edge1X * cpY;
        const denominator2 = edge2Y * cpX - edge2X * cpY;
        if (denominator0 === 0 || denominator1 === 0 || denominator2 === 0) {
            return 0;
        }
        const pP0X = x - this.x1;
        const pP0Y = y - this.y1;
        const pP1X = x - this.x2;
        const pP1Y = y - this.y2;
        const pP2X = x - this.x3;
        const pP2Y = y - this.y3;
        const ua0 = (edge0X * pP0Y - edge0Y * pP0X) / denominator0;
        const ub0 = (cpX * pP0Y - cpY * pP0X) / denominator0;
        const ua1 = (edge1X * pP1Y - edge1Y * pP1X) / denominator1;
        const ub1 = (cpX * pP1Y - cpY * pP1X) / denominator1;
        const ua2 = (edge2X * pP2Y - edge2Y * pP2X) / denominator2;
        const ub2 = (cpX * pP2Y - cpY * pP2X) / denominator2;
        if (ua0 >= 0 && ua0 <= 1 && ub0 >= 0 && ub0 <= 1) {
            return this.distanceToLine(x, y, this.x1, this.y1, this.x2, this.y2);
        } else if (ua1 >= 0 && ua1 <= 1 && ub1 >= 0 && ub1 <= 1) {
            return this.distanceToLine(x, y, this.x2, this.y2, this.x3, this.y3);
        } else if (ua2 >= 0 && ua2 <= 1 && ub2 >= 0 && ub2 <= 1) {
            return this.distanceToLine(x, y, this.x3, this.y3, this.x1, this.y1);
        } else {
            return 0;
        }
        return this.distanceToLine(x, y, this.x1, this.y1, this.x2, this.y2);
    }
    distanceToLine = (x, y, x1, y1, x2, y2) => {
        const p0p1X = x2 - x1;
        const p0p1Y = y2 - y1;
        const l2 = p0p1X * p0p1X + p0p1Y * p0p1Y;
        const pp0X = x - x2;
        const pp0Y = y - y2;
        if (l2 === 0) {
            return pp0X * pp0X + pp0Y * pp0Y;
        }
        const p1p0X = x1 - x2;
        const p1p0Y = y1 - y2;
        const t = this.clamp((pp0X * p1p0X + pp0Y * p1p0Y) / l2, 0, 1);
        const ptX = x2 + t * p1p0X;
        const ptY = y2 + t * p1p0Y;
        const pX = x - ptX;
        const pY = y - ptY;
        return Math.sqrt(pX * pX + pY * pY);
    }
    draw = () => {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x1, this.y1);
        this.ctx.lineTo(this.x2, this.y2);
        this.ctx.lineTo(this.x3, this.y3);
        this.ctx.lineTo(this.x1, this.y1);
        this.ctx.stroke();
    }
    clamp = (val, min, max) => {
        return Math.min(Math.max(min, val), max);
    }
}
class Box {
    constructor(x, y, s, color = { "r": 255, "g": 0, "b": 255 }, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.s = s;
        this.color = color;
    }
    distance = (x, y) => {
        const offsetX = Math.abs(x - this.x) - this.s / 2;
        const offsetY = Math.abs(y - this.y) - this.s / 2;
        const offsetMaxX = Math.max(offsetX, 0);
        const offsetMaxY = Math.max(offsetY, 0);
        const offsetMinX = Math.min(offsetX, 0);
        const offsetMinY = Math.min(offsetY, 0);
        const unsignedDst = Math.sqrt(offsetMaxX * offsetMaxX + offsetMaxY * offsetMaxY);
        const dstInsideBox = Math.max(offsetMinX, offsetMinY);
        return unsignedDst + dstInsideBox;
    }
    draw = () => {
        this.ctx.beginPath();
        this.ctx.rect(this.x - this.s / 2, this.y - this.s / 2, this.s, this.s);
        this.ctx.stroke();
    }

}
class Ellipse {
    constructor(x, y, color = { "r": 255, "g": 0, "b": 255 }, ctx) {
        this.ctx = ctx;
        this.a = x;
        this.b = y;

        this.color = color;
    }
    distance = (x, y) => {
        x = Math.abs(x); y = Math.abs(y);
        if (x > y) {

            x = [y, y = x][0];
            this.b = [this.a, this.a = this.b][0];

        }

        let l = this.b * this.b - this.a * this.a;

        let m = this.a * x / l; let m2 = m * m;
        let n = this.b * y / l; let n2 = n * n;
        let c = (m2 + n2 - 1.0) / 3.0; let c3 = c * c * c;
        let q = c3 + m2 * n2 * 2.0;
        let d = c3 + m2 * n2;
        let g = m + m * n2;
        let co;
        if (d < 0.0) {
            let h = Math.acos(q / c3) / 3.0;
            let s = Math.cos(h);
            let t = Math.sin(h) * Math.sqrt(3.0);
            let rx = Math.sqrt(-c * (s + t + 2.0) + m2);
            let ry = Math.sqrt(-c * (s - t + 2.0) + m2);
            co = (ry + Math.sign(l) * rx + Math.abs(g) / (rx * ry) - m) / 2.0;
        }
        else {
            let h = 2.0 * m * n * Math.sqrt(d);
            let s = Math.sign(q + h) * Math.pow(Math.abs(q + h), 1.0 / 3.0);
            let u = Math.sign(q - h) * Math.pow(Math.abs(q - h), 1.0 / 3.0);
            let rx = -s - u - c * 4.0 + 2.0 * m2;
            let ry = (s - u) * Math.sqrt(3.0);
            let rm = Math.sqrt(rx * rx + ry * ry);
            co = (ry / Math.sqrt(rm - rx) + 2.0 * g / rm - m) / 2.0;
        }

        let rx = this.a * co;
        let ry = this.b * Math.sqrt(1.0 - co * co);
        //let r = ab * vec2(co, Math.sqrt(1.0 - co * co));//vec2

        return Math.sqrt((rx - x) ** 2 + (ry - y) ** 2) * Math.sign(y - ry);
        // return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) - this.r;
    }
    draw = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        this.ctx.stroke();
    }
}
const config = {
    //input: 4,
    binaryThresh: 0.5, // ¯\_(ツ)_/¯
    hiddenLayers: [30, 20, 10], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
    // outputLayer: 4
};
const net = new brain.NeuralNetwork(config);
const trainConfig = {
    // Defaults values --> expected validation
    iterations: 50000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.0001, // the acceptable error percentage from training data --> number between 0 and 1
    log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 100, // iterations between logging out --> number greater than 0
    learningRate: 0.5, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.4, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: 100000000, // the max number of milliseconds to train for --> number greater than 0
}
getTrainSet = (n, out = [0]) => {

    let trainingset = [{
        input: new Array(n).fill(0),
        output: out
    }]
    try {

        trainingset = JSON.parse(localStorage.getItem("trainingset"))
        if (trainingset[0].input.length != n) {
            trainingset = [{
                input: new Array(n).fill(0),
                output: out
            }];
        }
        if (typeof (trainingset[0]) != "object") {

            trainingset = [{
                input: new Array(n).fill(0),
                output: out
            }];
        }
    } catch (error) {
        trainingset = [{
            input: new Array(n).fill(0),
            output: out
        }]
    }
    return trainingset;
}

//let trainingset = getTrainSet(8, new Array(2).fill(0));
let trainingset = [{
    "input": [1.0, 1.0, 1.0],
    "output": [1.0, 0.5]
}, {
    "input": [0.5, 1.0, 1.0],
    "output": [0.6, 0.7]
}, {
    "input": [1.0, 1.0, 0.5],
    "output": [0.6, 0.3]
}, {
    "input": [1.0, 0.5, 1.0],
    "output": [0.3, 0.4]
}, {
    "input": [0.5, 1.0, 0.5],
    "output": [0.7, 0.5]
}, {
    "input": [0.0, 0.0, 0.0],
    "output": [0.2, 0.2]
}, {
    "input": [0.5, 0.5, 0.5],
    "output": [0.5, 0.4]
}, {
    "input": [0.0, 1.0, 1.0],
    "output": [0.4, 0.9]
}, {
    "input": [1.0, 1.0, 0.0],
    "output": [0.4, 0.1]
}, {
    "input": [1.0, 0.0, 1.0],
    "output": [0.2, 0.2]
}, {
    "input": [0.0, 1.0, 0.0],
    "output": [1.0, 0.5]
}, {
    "input": [0.0, 0.0, 1.0],
    "output": [0.3, 0.8]
}, {
    "input": [1.0, 0.0, 0.0],
    "output": [0.3, 0.2]
}, {
    "input": [0.3, 0.4, 0.1],
    "output": [0.5, 0.3]
}, {
    "input": [0.1, 0.4, 0.3],
    "output": [0.5, 0.7]
}, {
    "input": [0.0, 0.1, 0.2],
    "output": [0.3, 0.9]
}, {
    "input": [0.2, 0.1, 0.0],
    "output": [0.3, 0.1]
}, {
    "input": [0.0, 0.3, 0.6],
    "output": [0.5, 0.8]
}, {
    "input": [0.6, 0.3, 0.0],
    "output": [0.5, 0.2]
}, {
    "input": [0.2, 0.3, 0.4],
    "output": [0.5, 0.9]
}, {
    "input": [0.4, 0.3, 0.2],
    "output": [0.4, 0.1]
}];

trainNeuro = () => {
    if (localStorage.neuro != "") {
        net.fromJSON(JSON.parse(localStorage.neuro))
    } else {
        net.trainAsync(trainingset, trainConfig).then(() => { localStorage.neuro = JSON.stringify(net.toJSON()) });
    }
}
trainNeuro();
window.canvasButtons = []
var game = new Game('canvas', 1024, 1024);
var lv1 = new Level(game);
var car = new Car(game, 10, 10, lv1);
let up = new Button([1, 1, 400, 400], game.ctx, "up", [{ checkBox: false, stroke: true }], () => {

    trainingset.push({
        input: window.train,
        output: [0.7, 0.5]//left,up,rigth,back
    })

    console.log(trainingset);
});
let left = new Button([1, 1, 350, 425], game.ctx, "left", [{ checkBox: false, stroke: true }], () => {

    /*   trainingset.push({
          input: window.train,
          output: [1, 0]//left,up,rigth,back
      })
      console.log(trainingset); */
});
let right = new Button([1, 1, 450, 425], game.ctx, "right", [{ checkBox: false, stroke: true }], () => {

    /* trainingset.push({
        input: window.train,
        output: [0, 0]//left,up,rigth,back
    })
    console.log(trainingset); */
});
let funcbut = new Button([1, 1, 500, 500], game.ctx, "train", [{ checkBox: false, stroke: true }], () => {
    localStorage.setItem("trainingset", JSON.stringify(trainingset))
    net.trainAsync(trainingset, trainConfig).then(() => { localStorage.neuro = JSON.stringify(net.toJSON()) });
});
let st = new Button([1, 1, 600, 500], game.ctx, "step", [{ checkBox: false, stroke: true }], () => {
    neuroStep();
});
neuroStep = () => {
    let out = net.run(window.train);
    //console.log(out);
    let angel = 0;
    let an = 0.45
    //angel = (((out[1] - an) < (out[1] + 1 - an)) ? ((out[1] - an) * 10) : (-(out[1] + 1 - an) * 10))
      if (out[1] > (1 - an) ) {
        //console.log(out[1] + 0.5, "right");
        angel = (out[1] - an) * 10;

    }
    else if (out[1] < an) {
        //console.log(out[1] + 0.45, "left");
        angel = -(out[1] + 1 - an) * 10;

    } 
    let kspeed = 0;
    if (out[0] > 0.9) {
        //console.log(1,"full forward");
        kspeed = out[0];
    } else if (out[0] <= 0.9 && out[0] > 0.65) {
        // console.log(out[0],"ускорение");
        kspeed = out[0]
    } else if (out[0] <= 0.65 && out[0] > 0.55) {
        //console.log(out[0],"небольшое уск");
        kspeed = out[0]
    } else if (out[0] <= 0.55 && out[0] > 0.45) {
        //console.log(out[0],"Без изм");
        kspeed = out[0]
    } else if (out[0] <= 0.45 && out[0] > 0.2) {
        //console.log(0,"торм");
        kspeed = out[0]
    } else {
        //console.log(-0.5,"обр");
        car.speed = -out[0]
        kspeed = -out[0]
    }
    car.speedk(kspeed, angel)
    console.info(kspeed, angel, out);

}
let prevdt = 0;
document.addEventListener("keydown", (e) => { game.handleKeyboard(e); });
document.addEventListener("keyup", (e) => { game.handleKeyboard(e); });

loop = (t) => {
    game.clear();
    let dt = (t - prevdt) / 5000;
    prevdt = dt;

    car.step(dt);
    game.draw();
    neuroStep();
    car.handleKeyboard();

    window.canvasButtons.forEach((e) => {
        e.draw();
    })

    //console.log(e);


    requestAnimationFrame(loop)


}
requestAnimationFrame(loop)


