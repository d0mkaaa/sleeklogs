const fs = require('fs');
const os = require('os');
const colorFunctions = require('./colors');
const rawColors = require('./colors.json');
const colors = colorFunctions.convertColorCodes(rawColors);

function supportsTrueColor() {
    return process.env.COLORTERM === 'truecolor' || process.env.TERM_PROGRAM === 'iTerm.app';
}

class SleekLog {
    constructor(options = {}) {
        this.enableColors = options.enableColors !== false && supportsTrueColor();
        this.colors = this.enableColors ? colors : this.stripColors(colors);
        this.levels = {
            info: { color: this.colors.fg.blue, format: options.format || "[%timestamp%] %message%" },
            warn: { color: this.colors.fg.yellow, format: options.format || "[%timestamp%] %message%" },
            error: { color: this.colors.fg.red, format: options.format || "[%timestamp%] %message%" },
            success: { color: this.colors.fg.green, format: options.format || "[%timestamp%] %message%" },
            ...options.levels
        };
        this.logFilePath = options.logFilePath || 'application.log';
        this.enableFileLogging = options.enableFileLogging || false;
    }

    formatTimestamp() {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    formatMessage(level, message) {
        let format = this.levels[level].format;
        return format.replace('%timestamp%', this.formatTimestamp()).replace('%message%', message);
    }

    log(level, message, hexColor = null) {
        const ansiColor = hexColor ? (supportsTrueColor() ? colorFunctions.hexToTrueColorAnsi(hexColor) : colorFunctions.hexToAnsi(hexColor)) : this.levels[level] ? this.levels[level].color : this.colors.reset;
        const formattedMessage = `${ansiColor}${this.formatMessage(level, message)}${this.colors.reset}`;
        console.log(formattedMessage);
        if (this.enableFileLogging) {
            this.logToFile(`[${this.formatTimestamp()}] ${this.stripAnsi(message)}`);
        }
    }

    stripAnsi(message) {
        return message.replace(/\x1b\[[0-9;]*m/g, '');
    }

    logToFile(message) {
        fs.appendFile(this.logFilePath, message + os.EOL, err => {
            if (err) console.error('Error writing to log file:', err);
        });
    }

    logError(message, error) {
        this.log('error', `${message}\nStack Trace:\n${error.stack}`);
    }

    drawBar(label, value, maxValue, width, labelColor = this.colors.fg.white, barColor = this.colors.fg.green) {
        const percentage = (value / maxValue) * 100;
        const barWidth = Math.round((percentage / 100) * width);
        const bar = `${barColor}${'█'.repeat(barWidth)}${this.colors.reset}${'░'.repeat(width - barWidth)}`;
        this.log('info', `${labelColor}${label}: ${bar} ${percentage.toFixed(2)}%`);
    }

    startSpinner(duration = 3000, message = 'Loading...', spinnerColor = this.colors.fg.cyan) {
        const spinnerFrames = ['⠋', '⠙', '⠚', '⠒', '⠂', '⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐', '⠐', '⠒', '⠓', '⠋'];
        let i = 0;
        const spinner = setInterval(() => {
            process.stdout.write(`\r${spinnerColor}${spinnerFrames[i++ % spinnerFrames.length]} ${message}${this.colors.reset}`);
        }, 80);

        setTimeout(() => {
            clearInterval(spinner);
            process.stdout.write(`\r${' '.repeat(message.length + 20)}\r`);
            console.log('Done!');
        }, duration);
    }

    stripColors(colors) {
        const noColor = {};
        Object.keys(colors).forEach(key => {
            if (typeof colors[key] === 'object') {
                noColor[key] = this.stripColors(colors[key]);
            } else {
                noColor[key] = '';
            }
        });
        return noColor;
    }
}

module.exports = SleekLog;
