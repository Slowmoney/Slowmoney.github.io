var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var width = 300;
var height = 200;
canvas.width = width;
canvas.height = height;

var graf = document.getElementById("graf");
var ctxg = graf.getContext('2d');

graf.width = 300;
graf.height = 200;

var mx = 10;
var my = 10;
canvas.addEventListener("mousemove", (e) => {
    mx = e.offsetX;
    my = e.offsetY;

});
function point(e) {


    o[e.id] = e.valueAsNumber;
   // requestAnimationFrame(loop);
}
var o = [1, 2, 1, 1];

let colorArr = [];
var simplex = new SimplexNoise();
  
function loop() {
    let max = Math.max.apply(null, o);
    let min = Math.min.apply(null, o);
    let data = new Uint8ClampedArray(4 * canvas.width * canvas.height);
    let gd = new Uint8ClampedArray(4 * graf.width * graf.height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {


            let color = biLine({ x: 0, y: 0 }, { x: width, y: height }, o[0], o[1], o[2], o[3], { x: x, y: y });
            let c = constarain(map(color, min, max, 0, 0.8), 0, 0.8);
         //  let c = Math.random();
        // let c = simplex.noise2D(x, y)
            //c = 0---> 0.8 
            if (true) {//y == my
                let p = map(c, 0, 1, 0, 100).toFixed();

            
           // gd[4 * (x + p * graf.width) + 0] = 0;
           // gd[4 * (x + p * graf.width) + 1] = 0;
          //  gd[4 * (x + p * graf.width) + 2] = 0;
            gd[4 * (x + p * graf.width) + 3] = y;
            }
            
            let rgb = HSVtoRGB(c, 1, 1);
            data[4 * (x + y * width) + 0] = rgb.r;
            data[4 * (x + y * width) + 1] = rgb.b;
            data[4 * (x + y * width) + 2] = rgb.g;
            data[4 * (x + y * width) + 3] = 255;

        }

    }
    
  
    ctx.putImageData(new ImageData(data, width, height), 0, 0)
    ctxg.putImageData(new ImageData(gd, width, height), 0, 0)
    requestAnimationFrame(loop);
}

function grf(p, x, y) {

}


//lineInterpol(2,20,4,40,3.5) == 35
function lineInterpol(x0, y0, x1, y1, x) {
    return ((x - x0) / (x1 - x0)) * (y1 - y0) + y0;
}
function biLine(q00, q11, f00, f10, f01, f11, p) {
    return ((f00) / ((q11.x - q00.x) * (q11.y - q00.y))) * (q11.x - p.x) * (q11.y - p.y) + (f10 / ((q11.x - q00.x) * (q11.y - q00.y))) * (p.x - q00.x) * (q11.y - p.y) + (f01 / ((q11.x - q00.x) * (q11.y - q00.y))) * (q11.x - p.x) * (p.y - q00.y) + (f11 / ((q11.x - q00.x) * (q11.y - q00.y))) * (p.x - q00.x) * (p.x - q00.y);



}
requestAnimationFrame(loop);
function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
function constarain(x, min, max) {
    if (x > max) {
        return max;
    }
    if (x < min) {
        return min;
    }
    return x;
}