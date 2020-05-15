var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var width = 2000;
var height = 2000;
canvas.width = width;
canvas.height = height;
function Noise(x, y) {
    var seed = (x << 18) | (y << 4) | 49734321;

    // Robert Jenkins' 32 bit integer hash function.
    // See http://www.concentric.net/~ttwang/tech/inthash.htm (original)
    // and http://stackoverflow.com/questions/3428136/javascript-integer-math-incorrect-results/3428186#3428186 (JavaScript version)
    seed = ((seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
    seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
    seed = ((seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
    seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
    seed = ((seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
    seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
    return (seed & 0xfffffff) / 0x10000000;
}

function SmoothedNoise(x, y) {
    var corners = (Noise(x - 1, y - 1) + Noise(x + 1, y - 1) + Noise(x - 1, y + 1) + Noise(x + 1, y + 1)) / 16;
    var sides = (Noise(x - 1, y) + Noise(x + 1, y) + Noise(x, y - 1) + Noise(x, y + 1)) / 8;
    var center = Noise(x, y) / 4;
    return corners + sides + center;
}

function Interpolate(a, b, x) {
    var ft = x * Math.PI;
    var f = (1.0 - Math.cos(ft)) * 0.5;

    return (a * (1.0 - f)) + (b * f);
}

function InterpolatedNoise(x, y) {
    var x_int = Math.floor(x);
    var x_fractional = x - x_int;

    var y_int = Math.floor(y);
    var y_fractional = y - y_int;

    var v1 = SmoothedNoise(x_int, y_int);
    var v2 = SmoothedNoise(x_int + 1, y_int);
    var v3 = SmoothedNoise(x_int, y_int + 1);
    var v4 = SmoothedNoise(x_int + 1, y_int + 1);

    var i1 = Interpolate(v1, v2, x_fractional);
    var i2 = Interpolate(v3, v4, x_fractional);

    return Interpolate(i1, i2, y_fractional);
}

var Noise2D = function (x, y, octaves, persistence) {
    var total = 0;

    for (var octave = 0; octave < octaves; ++octave) {
        var frequency = Math.pow(2, octave);
        var amplitude = Math.pow(persistence, octave);

        total += InterpolatedNoise(x * frequency, y * frequency, octave) * amplitude;
    }

    return total;
}

function Random() {
    this.m = 2147483647; //2^31 - 1
    this.a = 16807; //7^5; primitive root of m
    this.q = 127773; // m / a
    this.r = 2836; // m % a
    this.seed = 1;

    this.setSeed = function (seed) {
        if (seed <= 0) {
            seed = -(seed % (this.m - 1)) + 1;
        }
        if (seed > this.m - 1) {
            seed = this.m - 1;
        }
        this.seed = seed;
    };

    this.nextLong = function () {
        var res = this.a * (this.seed % this.q) - this.r * Math.floor(this.seed / this.q);
        if (res <= 0) {
            res += this.m;
        }
        this.seed = res;
        return res;
    };

    this.next = function () {
        var res = this.nextLong();
        return res / this.m;
    };
}

function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

function PerlinSampler2D(width, height, randseed) {
    this.width = width;
    this.height = height;
    this.randseed = randseed;
    this.gradients = new Array(width * height * 2);

    var rand = new Random();
    rand.setSeed(randseed);
    for (var i = 0; i < this.gradients.length; i += 2) {
        var x, y;

        var angle = rand.next() * Math.PI * 2;
        x = Math.sin(angle);
        y = Math.cos(angle);

        this.gradients[i] = x;
        this.gradients[i + 1] = y;
    }

    this.dot = function (cellX, cellY, vx, vy) {
        var offset = (cellX + cellY * this.width) * 2;
        var wx = this.gradients[offset];
        var wy = this.gradients[offset + 1];
        return wx * vx + wy * vy;
    };

    this.lerp = function (a, b, t) {
        return a + t * (b - a);
    };

    this.sCurve = function (t) {
        return t * t * (3 - 2 * t);
    };

    this.getValue = function (x, y) {
        var xCell = Math.floor(x);
        var yCell = Math.floor(y);
        var xFrac = x - xCell;
        var yFrac = y - yCell;

        var x0 = xCell;
        var y0 = yCell;
        var x1 = xCell === this.width - 1 ? 0 : xCell + 1;
        var y1 = yCell === this.height - 1 ? 0 : yCell + 1;



        var v00 = this.dot(x0, y0, xFrac, yFrac);
        var v10 = this.dot(x1, y0, xFrac - 1, yFrac);
        var v01 = this.dot(x0, y1, xFrac, yFrac - 1);
        var v11 = this.dot(x1, y1, xFrac - 1, yFrac - 1);

        var vx0 = this.lerp(v00, v10, this.sCurve(xFrac));
        var vx1 = this.lerp(v01, v11, this.sCurve(xFrac));

        return this.lerp(vx0, vx1, this.sCurve(yFrac));
    };
}

function Image(width, height) {
    this.width = width;
    this.height = height;

    this.data = new Array(width * height * 4);

    this.setColor = function (x, y, color) {
        var offset = ((y * this.width) + x) * 4;

        this.data[offset] = color.r;
        this.data[offset + 1] = color.g;
        this.data[offset + 2] = color.b;
        this.data[offset + 3] = color.a;
    };

    this.setRgba = function (x, y, r, g, b, a) {
        var offset = ((y * this.width) + x) * 4;

        this.data[offset] = r;
        this.data[offset + 1] = g;
        this.data[offset + 2] = b;
        this.data[offset + 3] = a;
    };

    this.createPerlinNoise = function (period, randseed) {
        var sampler = new PerlinSampler2D(Math.ceil(this.width / period), Math.ceil(this.height / period), randseed);

        for (var j = 0; j < this.height; ++j) {
            for (var i = 0; i < this.width; ++i) {
                var val = sampler.getValue(i / period, j / period);
                var b = (val + 1) / 2 * 256;

                this.setRgba(i, j,
                    b, b, b, 0xff);
            }
        }
    };


    this.toImageContext = function (ctx) {
        var imgData = ctx.createImageData(this.width, this.height);

        for (var i = 0, len = width * height * 4; i < len; i++) {
            imgData.data[i] = this.data[i];
        }

        return imgData;
    };
}



function loop() {
    var spec = {};

    spec.randseed = 1;
    spec.period = 20;
    spec.levels = 1;
    spec.atten = .6;
    
    spec.absolute = 0;
    spec.color = 0;
    spec.alpha = 0;





    var img = new Image(width, height);
    //img.createChecker(period);
    img.createPerlinNoise(20, 1);
    //img.createTurbulence(spec);
    var imgData = img.toImageContext(ctx);
    ctx.putImageData(imgData, 0, 0);

}
requestAnimationFrame(loop);