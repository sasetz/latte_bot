const fs = require('node:fs');
const path = require('node:path');

const dependencyPath = path.join(__dirname, 'dependencies');
const dependencyFiles = fs.readdirSync(dependencyPath).filter(file => file.endsWith('.js'));

const container = {};

for (const file of dependencyFiles) {
    const filePath = path.join(dependencyPath, file);
    const dependency = require(filePath);
    const dependencyName = file.replace(/\.js$/, '');

    if (dependency === undefined || dependency === null) {
        console.error(`There was an error loading module ${dependencyName}. Exiting`);
        process.exit(1);
    }

    container[dependencyName] = dependency;
}

module.exports = container;

