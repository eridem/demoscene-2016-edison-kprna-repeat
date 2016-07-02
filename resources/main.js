var SCALE = 4;
var WIDTH = $(window).width() / SCALE;
var HEIGHT = $(window).height() / SCALE;
var SQUARE_SIZE = WIDTH / 50;
var REDUCE_COLORS = false;
var NUMBER_OF_COLORS = 64;
var DRAW_BOXES = false;

var RAIN_EFFECT = false;
var HORIZONTAL_EFFECT = false;

var IS_DARKER = false;

var USE_BORDERS = false;


$(window).resize(function () {
    window.location.reload();
});

function f(word) {
    var matrix = [[], [], [], [], [], [], []];
    for (var i = 0; i < word.length; i++) {
        var l = word[i];
        var lm = alphabet[l];

        for (var j = 0; j < matrix.length; j++) {
            matrix[j].push.apply(matrix[j], lm[j]);
            matrix[j].push.apply(matrix[j], [0]);
        }
    }
    return matrix;
}


var LOGO = f('');

var LOGO_1D = LOGO.length;
var LOGO_2D = LOGO[0].length;
var LOGO_SQUARE_SIZE = SQUARE_SIZE / 1.75;

var PATTERN_SIZE = 16;

function getSquareSize() {
    return SQUARE_SIZE;
}

function setSquareSize(value) {
    SQUARE_SIZE = value;
}

function getSquareContainerSize() {
    return getSquareSize() - 2;
}

function getSquareContainerSizeHalf() {
    return getSquareContainerSize() - 2;
}

function getLogoSquareSize() {
    return LOGO_SQUARE_SIZE;
}

function setLogoSquareSize(value) {
    LOGO_SQUARE_SIZE = value;
}

function getLogoStartX() {
    return (WIDTH - (LOGO_2D * getLogoSquareSize())) / 2;
}

function getLogoStartY() {
    return (HEIGHT - (LOGO_1D * getLogoSquareSize())) / 2;
}

function getRandom(from, to) {
    return Math.floor(Math.random() * to) + from;
}

function getColor(a, r, g, b) {
    return {
        a: a,
        r: r,
        g: g,
        b: b
    }
}

function getRectangle(color, x1, y1, w, h) {
    return {
        color: color,
        x1: x1,
        y1: y1,
        w: w,
        h: h
    }
}

function runPixelMatrix() {
    // Personalize this for different results
    setSquareSize(WIDTH / 30); //getRandom(15, 30));
    setLogoSquareSize(LOGO_SQUARE_SIZE);// * getRandom(1, 7));

    var bmp = {
        w: WIDTH,
        h: HEIGHT,
        patterns: drawPatterns(),
        logo: drawLogo()
    };


    drawSprite(bmp);
}

function drawLogo() {
    var logo = [];
    for (var ly = 0; ly < LOGO_1D; ly++) {
        for (var lx = 0; lx < LOGO_2D; lx++) {
            var activate = LOGO[ly][lx] === 1;

            if (activate) {
                var color;
                if (!IS_DARKER) {
                    color = getColor(
                       getRandom(255, 255), getRandom(0, 100), getRandom(0, 100), getRandom(0, 100));
                } else {
                    color = getColor(
                       getRandom(255, 255), getRandom(128, 255), getRandom(128, 255), getRandom(128, 255));
                }


                {

                    logo.push(getRectangle(color,
                            getLogoStartX() + (lx * LOGO_SQUARE_SIZE),
                            getLogoStartY() + (ly * LOGO_SQUARE_SIZE),
                            LOGO_SQUARE_SIZE, LOGO_SQUARE_SIZE)
                    );
                }
            }
        }
    }
    return logo;
}

function drawPatterns() {
    var patterns = [];
    for (var y = 0; y < HEIGHT; y += getSquareSize() + (USE_BORDERS ? PATTERN_SIZE : 0)) {
        for (var x = 0; x < WIDTH; x += getSquareSize() + (USE_BORDERS ? PATTERN_SIZE : 0)) {
            patterns.push.apply(patterns, drawPatternAt(x, y));
        }
    }
    return patterns;
}


function drawPatternAt(px, py) {
    var patterns = [];

    var color;
    if (IS_DARKER) {
         color = getColor(
            getRandom(0, 128), getRandom(0, 100), getRandom(0, 100), getRandom(0, 100));
    } else {
         color = getColor(
            getRandom(0, 128), getRandom(128, 255), getRandom(128, 255), getRandom(128, 255));
    }

    for (var x = px, xStart = px + getSquareContainerSize() - 1;
        x < px + getSquareContainerSizeHalf() ;
        x++, xStart--) {
        for (var y = py; y < py + getSquareContainerSize() ; y += PATTERN_SIZE) {
            if (getRandom(0, 100) < 50) {
                patterns.push(getRectangle(color, x, y, RAIN_EFFECT ? 1 : PATTERN_SIZE, HORIZONTAL_EFFECT ? 1 : PATTERN_SIZE));
                patterns.push(getRectangle(color, xStart, y, RAIN_EFFECT ? 1 : PATTERN_SIZE, HORIZONTAL_EFFECT ? 1 : PATTERN_SIZE));
            }
        }

        xStart--;
    }

    return patterns;
}

function drawSprite(sprite) {
    ccontext.fillStyle = "rgba(255,255,255,1)";
    ccontext.fillRect(0, 0, WIDTH, HEIGHT);


    for (var k = 0; k < sprite.patterns.length; k++) {
        var b = sprite.patterns[k];
        var c = b.color;
        ccontext.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ", " + (c.a / 255) + ")";
        ccontext.fillRect(b.x1, b.y1, b.w, b.h);
    }

    for (var k = 0; k < sprite.logo.length; k++) {
        var b = sprite.logo[k];
        var c = b.color;
        ccontext.fillStyle = "rgba(" + c.r + "," + c.g + "," + c.b + ", " + (c.a / 255) + ")";
        ccontext.fillRect(b.x1, b.y1, b.w, b.h);
    }
}

function init() {
    var canvas = document.getElementById('canvasContainer');
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    WIDTH = $(window).width() / SCALE;
    HEIGHT = $(window).height() / SCALE;

    if (canvas.getContext) {
        window.ccontext = canvas.getContext('2d');
        ccontext.scale(SCALE, SCALE);

        setInterval(function () {
            runPixelMatrix();
        }, 33);

    } else {
        // put code for browsers that don’t support canvas here
        alert("This page uses HTML 5 to render correctly. Other browsers may not see anything.");
    }

        setInterval(function () {
        var word = www[++wwwIndex % www.length];
        LOGO = f(word);
        LOGO_1D = LOGO.length;
        LOGO_2D = LOGO[0].length;


    }, 800);


    var size = false;
    function onHardKick() {
        if (size) {
            LOGO_SQUARE_SIZE = SQUARE_SIZE / 1;

        } else {
            LOGO_SQUARE_SIZE = SQUARE_SIZE / 2;

        }
        size = !size;
    }

    var effects = [{ v: false, h: false }, { v: true, h: false }];
    var effectIndex = -1;
    function onKick() {
        var effect = effects[++effectIndex % effects.length];
        RAIN_EFFECT = effect.v;
        HORIZONTAL_EFFECT = effect.h;
    }

    function onWompBass01() {
        IS_DARKER = true;
        RAIN_EFFECT = false;
        onHardKick();
    }

    function onWompBass02() {
        IS_DARKER = false;
    }


    var trackerInterval = setInterval(function () {
        tracker(onKick, onHardKick, onWompBass01, onWompBass02);
    }, 100);



    function playKick() {
        //kick.play();
    }
}



$(document).bind('click', function () {
    $(document).unbind('click');
    $('#removeit').remove();
    init();
});
