# SleekLog

SleekLog is a Node.js logging library designed to enhance the way developers log information in their applications. This library provides customizable and color-coded log outputs, file logging capabilities, and support for custom log levels, making it versatile for both development and production environments.

## Features

- **Color-coded Log Output**: Customize log colors for better visual distinction between log levels.
- **Custom Log Levels**: Define and use custom log levels that suit your application's needs.
- **File Logging**: Enable logging to a file for persistent log storage.
- **Error Handling with Traceability**: Log errors with stack traces for easier debugging.
- **Bar Chart Logging**: Draw ASCII bar charts in the console for visual representation of metrics like CPU and memory usage.
- **Flexible Configuration**: Configure logging preferences such as file logging paths and whether to enable or disable certain features.

## Supported Colors

SleekLog supports the following colors for log customization:

- **Foreground Colors**:
  - Black: `\x1b[30m`
  - Red: `\x1b[31m`
  - Green: `\x1b[32m`
  - Yellow: `\x1b[33m`
  - Blue: `\x1b[34m`
  - Magenta: `\x1b[35m`
  - Cyan: `\x1b[36m`
  - White: `\x1b[37m`

- **Background Colors**:
  - Black: `\x1b[40m`
  - Red: `\x1b[41m`
  - Green: `\x1b[42m`
  - Yellow: `\x1b[43m`
  - Blue: `\x1b[44m`
  - Magenta: `\x1b[45m`
  - Cyan: `\x1b[46m`
  - White: `\x1b[47m`

## Installation

Install SleekLog using npm:

```bash
npm install sleeklogs
```

Please do not use

```bash
@lmaoleonix/sleeklogs
```
It's the same but just use sleeklogs.

## Usage 

Here's how to get started with SleekLog:

```js
const SleekLog = require('sleeklogs');
const logger = new SleekLog({
    enableFileLogging: true,
    levels: {
        debug: { color: "\x1b[36m" }  // Example of the custom log level
    }
});

logger.log('debug', 'This is a custom debug message.');
logger.logError('An error occurred', new Error('Something went wrong'));

// Example of drawing a bar chart for CPU and memory usage
const currentCpuUsage = 30;
const totalCpuCapacity = 100;
const usedMemory = 4;
const totalMemory = 16;

logger.drawBar('CPU Usage', currentCpuUsage, totalCpuCapacity, 40);
logger.drawBar('Memory Usage', usedMemory, totalMemory, 40);

// A nice spinner if you need it for loading something
logger.startSpinner(5000, 'Processing data...', logger.colors.fg.magenta);
setTimeout(() => {
  console.log('Operation completed.');
}, 6000);
```

## Reporting Issues

Please report any bugs or issues you find while using SleekLog on our [GitHub Issues](https://github.com/lmaoleonix/sleeklogs/issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/lmaoleonix/sleeklogs/blob/main/LICENSE) file for details.