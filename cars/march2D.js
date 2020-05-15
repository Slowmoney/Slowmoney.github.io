export class Circle {
    constructor(x, y, r, color = { "r": 255, "g": 0, "b": 255 },ctx) {
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
export class Line {
    constructor(x, y, x1, y1, color = { "r": 255, "g": 0, "b": 255 },ctx) {
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
export class Triangle {
    constructor(x1, y1, x2, y2, x3, y3, color = { "r": 255, "g": 0, "b": 255 },ctx) {
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
export class Box {
    constructor(x, y, s, color = { "r": 255, "g": 0, "b": 255 },ctx) {
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
