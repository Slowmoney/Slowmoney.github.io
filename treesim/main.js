canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 1000;

ctx = canvas.getContext("2d");
var boxsz = 10;

loop = () => {
    trees.forEach((t) => {
        t.step();
        //console.log(t);
        t.struct.forEach((s) => {
            drawBox(s.x + 500, -s.y + 500, boxsz, boxsz,s.color);
            s.color =  {r:127,g:0,b:127}
        });
    });
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
trees = [];
class Tree {
    constructor(x, y) {
        this.children = [];
        this.struct = [
            {
                x: x,
                y: y,
                color: {r:127,g:127,b:127}
            }
        ];
         this.gen = [1, 3,1,1,1,3,3,3,3,3,4];
        this.energy = this.gen.length + 100;
        trees.push(this);

    }
    step = () => {
        if (this.struct.length >= 50 || this.energy <= 0||this.struct == [] ) {
            this.struct = []
            return ;
        }
       
        try {


            let s = this.struct[this.struct.length - 1];

            this.gen.forEach((i) => {
                try {
                    let s = this.struct[this.struct.length - 1];
                    switch (i) {
                        case 0:

                            break;
                        case 1://up

                            this.putStruct(s.x, s.y + boxsz);

                            break;

                        case 2:
                            this.putStruct(s.x, s.y - boxsz);

                            break;
                        case 3:
                            this.putStruct(s.x + boxsz, s.y);

                            break;
                        case 4:
                            this.putStruct(s.x - boxsz, s.y);

                            break;
                        case 5:
                            this.putStruct(s.x - boxsz, s.y);

                            break;
                        default:
                            break;
                    }
                } catch (error) {

                }

            });
            this.energy += s.y / boxsz;
        } catch (error) {

        }

    }
    putStruct = (x = 0, y = 0) => {
        if (this.energy > 0) {
            this.struct.push({
                x: x,
                y: y,
                color: {r:0,g:127,b:127}
            });
            this.energy--;
        } else {

        }


    }
}
new Tree(0, 0);
new Tree(500, 0);
function drawBox(x, y, x1, y1, color = { r: 255, g: 127, b: 127 }) {
    ctx.beginPath();

    ctx.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.fillRect(x, y, x1, y1);
    ctx.stroke();
}