const fs = require('fs');
const os = require('os');

class SleekLog {
  constructor(options = {}) {
    const defaultLevels = {
      info: { color: "\x1b[34m" },
      warn: { color: "\x1b[33m" },
      error: { color: "\x1b[31m" },
      success: { color: "\x1b[32m" }
    };

    this.colors = {
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      underscore: "\x1b[4m",
      blink: "\x1b[5m",
      reverse: "\x1b[7m",
      hidden: "\x1b[8m",
      fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
      },
      bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
      },
      ...options.colors
    };

    this.levels = { ...defaultLevels, ...options.levels };
    this.logFilePath = options.logFilePath || 'application.log';
    this.enableFileLogging = options.enableFileLogging || false;
  }

  formatTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  }

  log(level, message) {
    if (!this.levels[level]) {
      throw new Error(`Log level '${level}' not defined.`);
    }
    const color = this.levels[level].color || this.colors.reset;
    const timestamp = this.formatTimestamp();
    const formattedMessage = `${color}[${timestamp}] ${message}${this.colors.reset}`;
    console.log(formattedMessage);
    if (this.enableFileLogging) {
      this.logToFile(`[${timestamp}] ${message}`);
    }
  }

  logToFile(message) {
    fs.appendFile(this.logFilePath, message + os.EOL, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
  }

  logError(message, error) {
    const stack = error && error.stack ? `\nStack Trace:\n${error.stack}` : '';
    this.log('error', `${message}${stack}`);
  }

  defineLogLevel(level, color) {
    this.levels[level] = { color };
  }

  drawBar(label, value, maxValue, width, labelColor = this.colors.fg.white, barColor = this.colors.fg.green) {
    const percentage = (value / maxValue) * 100;
    const barWidth = Math.round((percentage / 100) * width);
    const bar = `${barColor}${'█'.repeat(barWidth)}${this.colors.reset}${'░'.repeat(width - barWidth)}`;
    this.log('info', `${labelColor}${label}: ${bar} ${percentage.toFixed(2)}%`);
  }
}

module.exports = SleekLog;