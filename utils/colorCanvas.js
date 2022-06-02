const Canvas = require('canvas');

// https://gist.github.com/w3core/e3d9b5b6d69a3ba8671cc84714cca8a4
function brightnessByColor(color) {
    const hasFullSpec = color.length == 7;
    const m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
    const r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16), g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16), b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
    if (typeof r != "undefined") return (((r * 299) + (g * 587) + (b * 114)) / 1000) / 255;
    else return 1.0;
}

module.exports = {
    colorCanvas: function(colorString) {
        const canvas = Canvas.createCanvas(150, 50);
        const ctx = canvas.getContext('2d');
        const x = canvas.width / 2;
        const y = canvas.height / 2;

        ctx.fillStyle = colorString;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '30px Courier';
        ctx.textAlign = 'center';
        ctx.fillStyle = "black";
        ctx.strokeStyle = 'black';
        // if color luminance is too dark, use white text
        if (brightnessByColor(colorString) < 0.35) {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
        }
        ctx.lineWidth = 1;
        ctx.strokeText(colorString, x, y + 10);

        ctx.fillText(colorString.toLowerCase(), x, y + 10);

        return canvas.toBuffer();
    },
};