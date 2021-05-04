const COLOR = "#000000";

const LINE_WIDTH = 1;

const DEG_PER_HOUR = 30;
const DEG_PER_MINUTE = DEG_PER_SECOND = 6;

const WIDTH = HEIGHT = 256;
const CENTER_X = CENTER_Y = 128;
const CLOCK_RADIUS = 128;
const HAND_OFFSET = 12;

const HAND_LENGTH_HOUR = 64;
const HAND_LENGTH_MINUTE = 96;
const HAND_LENGTH_SECOND = 112;

const BAR_OFFSET = 120;
const BAR_LENGTH_LONG = 16;
const BAR_LENGTH_SHORT = 8;

const SMOOTH_HAND_HOUR = true;
const SMOOTH_HAND_MINUTE = true;
const SMOOTH_HAND_SECOND = false;

let D2R = (deg) => deg * (Math.PI / 180);
let FixedAngle = (a) => a - 90;

let HandStartX = (angle) => CENTER_X - HAND_OFFSET * Math.cos(angle);
let HandStartY = (angle) => CENTER_Y - HAND_OFFSET * Math.sin(angle);

let HandEndX = (length, angle) => CENTER_X + length * Math.cos(angle);
let HandEndY = (length, angle) => CENTER_Y + length * Math.sin(angle);

function getClockData() {
    time = new Date();
    let res = new Object();
    res.ms_alfa = time.getMilliseconds() * 0.360;
    res.s_alfa = time.getSeconds() * DEG_PER_SECOND + (SMOOTH_HAND_SECOND ? (res.ms_alfa / 360) * DEG_PER_SECOND : 0);
    res.m_alfa = time.getMinutes() * DEG_PER_MINUTE + (SMOOTH_HAND_MINUTE ? (res.s_alfa / 360) * DEG_PER_MINUTE : 0);
    res.h_alfa = time.getHours() % 12 * DEG_PER_HOUR + (SMOOTH_HAND_HOUR ? (res.m_alfa / 360) * DEG_PER_HOUR : (((res.m_alfa / 360) * DEG_PER_HOUR) / 6 | 0) * 6);
    return res;
}

function drawLine(ctx, length, angle) {
    ctx.moveTo(HandStartX(angle), HandStartY(angle));
    ctx.lineTo(HandEndX(length, angle), HandEndY(length, angle));
}

function draw(ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, CLOCK_RADIUS, 0, Math.PI * 2, true);
    for (let a = 0; a < 360; a += 6) {
        let len = a % 30 ? BAR_LENGTH_SHORT : BAR_LENGTH_LONG;
        let aRad = D2R(a);
        ctx.moveTo(CENTER_X + (BAR_OFFSET - len) * Math.cos(aRad), CENTER_Y + (BAR_OFFSET - len) * Math.sin(aRad));
        ctx.lineTo(CENTER_X + BAR_OFFSET * Math.cos(aRad), CENTER_Y + BAR_OFFSET * Math.sin(aRad));
    }
    let t = getClockData();
    let sRadFixed = D2R(FixedAngle(t.s_alfa));
    let mRadFixed = D2R(FixedAngle(t.m_alfa));
    let hRadFixed = D2R(FixedAngle(t.h_alfa));
    drawLine(ctx, HAND_LENGTH_SECOND, sRadFixed);
    drawLine(ctx, HAND_LENGTH_MINUTE, mRadFixed);
    drawLine(ctx, HAND_LENGTH_HOUR, hRadFixed);
    ctx.stroke();
    requestAnimationFrame(draw.bind(draw, ctx));
}

function init() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = LINE_WIDTH;
    draw(ctx);
}

init();