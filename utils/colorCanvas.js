const Canvas = require('canvas');

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
        ctx.fillText(colorString.toLowerCase(), x, y + 10);

        return canvas.toBuffer();
    },
};