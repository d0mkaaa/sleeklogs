function convertColorCodes(colors) {
    let convertedColors = {};
    for (let key in colors) {
        if (typeof colors[key] === 'string') {
            convertedColors[key] = colors[key].replace(/\\x1b/g, '\x1b');
        } else if (typeof colors[key] === 'object') {
            convertedColors[key] = convertColorCodes(colors[key]);
        } else {
            convertedColors[key] = colors[key];
        }
    }
    return convertedColors;
}

function hexToAnsi(hex) {
    const hexColor = hex.replace('#', '').toLowerCase();
    const rgb = parseInt(hexColor, 16);
    const red = (rgb >> 16) & 0xFF;
    const green = (rgb >> 8) & 0xFF;
    const blue = rgb & 0xFF;
    const intensity = (red + green + blue) / 3;
    if (intensity < 85) return '\x1b[30m';
    if (intensity > 170) return '\x1b[37m';
    const index = (red > 128) | ((green > 128) << 1) | ((blue > 128) << 2);
    return ['\x1b[30m', '\x1b[31m', '\x1b[32m', '\x1b[33m', '\x1b[34m', '\x1b[35m', '\x1b[36m', '\x1b[37m'][index];
}

function hexToTrueColorAnsi(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const red = (rgb >> 16) & 0xFF;
    const green = (rgb >> 8) & 0xFF;
    const blue = rgb & 0xFF;
    return `\x1b[38;2;${red};${green};${blue}m`;
}

module.exports = {
    convertColorCodes,
    hexToAnsi,
    hexToTrueColorAnsi
};
