function toQRS(x) {
    let l = Math.ceil((Math.sqrt(1+8*(x/6))-1)/2);
    // https://en.wikipedia.org/wiki/Centered_hexagonal_number#:~:text=Expressing%20the%20formula%20as
    let y = x && x-(1+3*l*(l-1));
    let i = l ? y % l : 0;
    let z = [i, l, l-i, -i, -l, i-l];
    let segment = l ? Math.floor(y/l) : 0;
    return {
        q:     z[(segment+0)%6],
        r:  z.at((segment-2)%6),
        s: -z.at((segment-1)%6),
    }
}

function fromQRS(qrs) {
    let _ = -1;
    let cube = [
        _,_,_,
        _,2,2,
        _,3,_,
        
        _,0,1,
        4,_,1,
        4,3,_,
        
        _,0,_,
        5,5,_,
        _,_,_,
    ];

    bla = (c, max) => c == max ? 2 : (c == -max) ? 0 : 1;
    let ring = Math.max(...qrs.map(Math.abs));
    let sectant = cube[qrs.reduce((sum, c, i) => {
        return sum+3**i*bla(c, ring);
    }, 0)];
    let [q, r, s] = qrs;
    let i = [q, -s, r, -q, s, -r].at(sectant);
    return [ring, sectant, i];
}

function fromLSI([l, s, i]) {
    return l ? 3*l*(l-1)+l*s+i+1 : l;
}

const indexs = [
    0,
    0, 0, 0, 0, 0, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2,
];

const levels = [
    0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
];

const tests = [   //  I
    // Level 0
    [+0, +0, +0], //  0
    //Q   R   S

    // Level 1
    [+0, -1, +1], //  1
    [+1, -1, +0], //  2
    [+1, -0, -1], //  3
    [+0, +1, -1], //  4
    [-1, +1, +0], //  5
    [-1, +0, +1], //  6
    //Q   R   S

    // Level 2
    [+0, -2, +2], //  7
    [+1, -2, +1], //  8
    [+2, -2, +0], //  9
    [+2, -1, -1], // 10
    [+2, -0, -2], // 11
    [+1, +1, -2], // 12
    [+0, +2, -2], // 13
    [-1, +2, -1], // 14
    [-2, +2, +0], // 15
    [-2, +1, +1], // 16
    [-2, +0, +2], // 17
    [-1, -1, +2], // 18
    //Q   R   S

    // Level 3
    [+0, -3, +3], // 19
    [+1, -3, +2], // 20
    [+2, -3, +1], // 21
    [+3, -3, +0], // 22
    [+3, -2, -1], // 23
    [+3, -1, -2], // 24
    [+3, -0, -3], // 25
    [+2, +1, -3], // 26
    [+1, +2, -3], // 27
    [+0, +3, -3], // 28
    [-1, +3, -2], // 29
    [-2, +3, -1], // 30
    [-3, +3, +0], // 31
    [-3, +2, +1], // 32
    [-3, +1, +2], // 33
    [-3, +0, +3], // 34
    [-2, -1, +3], // 35
    [-1, -2, +3], // 36
    //Q   R   S
];

function naturalize(n) {
    return n < 0 ? -(2*n+1) : 2*n;
}

function realize(n) {
    return n%2 ? -(n+1)/2 : n/2;
}

function cantor(x, y) {
    return 0.5*(x+y)*(x+y+1)+y;
}

function decant(z) {
    const w = Math.floor((Math.sqrt(8*z+1)-1)/2);
    const t = (Math.pow(w, 2)+w)/2;
    const y = z - t;
    const x = w - y;
    return [x, y];
}

function pair(a, b) {
    const x = naturalize(parseInt(a));
    const y = naturalize(parseInt(b));
    return cantor(x, y);
}

function split(z) {
    const [x, y] = decant(z);
    return [realize(x), realize(y)];
}

let radius = 10;
const dimensions = { width: 500, height: 500 };
const centre = { x: dimensions.width / 2, y: dimensions.height / 2 };
const r3 = Math.sqrt(3);
function drawCircle(ctx, x, y, r, c) {
    context.fillStyle = c;
    context.beginPath();
    // context.arc(x, y, r, 0, 2 * Math.PI);
    // context.moveTo(x, y);
    [
        [-1, -r3], [+1, -r3], [+2,  +0],
        [+1, +r3], [-1, +r3], [-2,  +0],
    ]
    .map(([a, b]) => [x+r*a, y+r*b])
    .map(([x, y]) => context.lineTo(x, y));
    context.closePath();
    context.stroke();
    context.fill();
}
const circle = document.getElementById("canvas");
circle.width = dimensions.width;
circle.height = dimensions.height;
const context = circle.getContext("2d");
context.fillStyle = "black";
context.fillRect(0, 0, dimensions.width, dimensions.height);
const current = [null, null];
let cells = {};
circle.addEventListener("mousemove", () => {
    const { offsetX, offsetY } = event;
    const [a, b] = foo(offsetX-centre.x, offsetY-centre.y);
    if (current[0] != a || current[1] != b) {
        current[0] = a; current[1] = b;
        draw();
        drawCell(context, current[0], current[1], "white");
    }
});
circle.addEventListener("click", event => {
    const { offsetX, offsetY } = event;
    const [a, b] = foo(offsetX-centre.x, offsetY-centre.y);
    toggle(a, b);
    draw();
});
const directions = [
    [1, 0], [1, -1], [0, -1],
    [-1, 0], [-1, 1], [0, 1],
];
const colors = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
];
function toggle(a, b) {
    cells[a] ??= {};
    if (cells[a][b]) {
        delete cells[a][b];
        for (let direction of directions) {
            const x = a+direction[0];
            const y = b+direction[1];
            if (cells[x] && cells[x][y]) {
                cells[x][y]--;
            }    
        }
    } else {
        cells[a][b] = 1;
        for (let direction of directions) {
            const x = a+direction[0];
            const y = b+direction[1];
            if (cells[x] && cells[x][y]) {
                cells[x][y]++;
                cells[a][b]++;
            }    
        }
    }

}
function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, dimensions.width, dimensions.height);
    for (let a in cells) {
        for (let b in cells[a]) {
            const cell = cells[a][b];
            const color = colors[cell];
            drawCell(context, parseInt(a), parseInt(b), color);
        }
    }
}
function round(coords) {
    return [Math.round(coords[0]), Math.round(coords[1])];
}
function foo(x, y) {
    const r3 = Math.sqrt(3);
    // const a = x/r3 - y/3;
    // const b = 2*y/3;
    const b = y/r3 - x/3;
    const a = 2*x/3;
    return round([a/radius, b/radius]);
}
function drawCell(context, a, b, col) {
    const r3 = Math.sqrt(3);
    // const x = r3*(a+b/2);
    // const y = 3*b/2;
    const y = r3*(b+a/2);
    const x = 3*a/2;
    drawCircle(context, centre.x + x*radius, centre.y + y*radius, radius/2, col);
}
function load(game, ms=500, zoom=1) {
    function ArrayPlusDelay(array, delegate, delay) {
      let i = 0;
      let interval = setInterval(() => {
          delegate(array[i]);
          if (i++ >= array.length - 1) clearInterval(interval);
      }, delay)
      return interval
    }
    cells = {};
    draw();
    function show(n) {
        // let [a, b] = split(n);
        // toggle(a, b);
        let { q, r, s } = toQRS(n);
        toggle(r, s);
        draw();
        radius *= zoom;
    }
    return ArrayPlusDelay(game, show, ms);
}
games = [
    // [0,5,14,27,65,90,119,9,54,77,104,20,2,3,12,42,63,117,52,75,133,18,7,10,61,86,115,148,31,131,100,166,16,205,21,38,59,146,98,129,246,71,57,82,144,181,96,46,201,162,291,342,55,109,142,179,125,94,199,160,67,289,340,395,78,107,140,197,123,287,338,393,105,121,391,336,156,285,236,283,334,193,389,332,387,1,8,19,53,76,134,26,43,89,4,6,17,32,101,132,167,206,41,62,87,116,15,72,99,130,247,22,39,114,47,97,163,202,292,343,58,37,112,145,45,68,95,126,161,200,290,341,396,81,110,143,66,124,198,288,339,394,79,108,91,122,157,286,337,392,194,237,284,335,390,333,388],
    [...new Array(100).keys()],
];
// load([...new Array(397).keys()], 0, 1);
// load(games[0].sort(), 0)
// load([0], 0, 1);
// load([...new Array(7).keys()], 0);
(n => { x = [0, ...[...new Array(n).keys()].map(n => 2*(n))]; load(x, 0, 1); })(316)
// x = [1,0, ...[...new Array(166).keys()].map(n => 2*(n))]; load(x, 0, 1)
