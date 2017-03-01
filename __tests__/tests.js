var exec = require('child_process').exec;
var path = require('path');

// Get project root
var root = path.parse(__dirname).dir;

describe('Normal use cases', () => {
    it('It should import properly when require.main is the config root', () => {
        exec('NODE_ENV=dev node ' + path.join(root, 'typical', 'app.js'), (err, stdout, stderr) => {
            // Did not error
            expect(err).toBe(null);

            // Correct node env
            var conf = JSON.parse(stdout);
            expect(conf.getconfig.env).toBe('dev');

            // Default values
            expect(conf.default).toBe(true);

            // Overwritten values
            expect(conf.dev).toBe('dev-value');
        });
    });

    it('It should import properly when require.main is not the config root but GETCONFIG_ROOT is set', () => {
        var config_path = path.join(root, 'typical', 'config');
        exec('GETCONFIG_ROOT=' + config_path + ' NODE_ENV=dev node ' + path.join(root, 'nonroot', 'app.js'), (err, stdout, stderr) => {
            // Did not error
            expect(err).toBe(null);

            // Correct node env
            var conf = JSON.parse(stdout);
            expect(conf.getconfig.env).toBe('dev');
        });
    });

    it('It does not merge arrays', () => {
        exec('NODE_ENV=dev node ' + path.join(root, 'typical', 'app.js'), (err, stdout, stderr) => {
            // Did not error
            expect(err).toBe(null);

            // Correct node env
            var conf = JSON.parse(stdout);

            // Only has one item
            expect(conf.array.length).toBe(1);

            // Value comes from dev config
            expect(conf.array[0]).toBe('seven');
        });
    });
});

describe('Environment variable values', () => {
    it('It expands environment variables', () => {
        exec('NODE_ENV=test lowercase_env=test_lowercase node ' + path.join(root, 'typical', 'app.js'), (err, stdout, stderr) => {
            // Did not error
            expect(err).toBe(null);

            var conf = JSON.parse(stdout);

            // Overwritten testEnv
            expect(conf.testEnv).toBe('test');

            // Overwritten value in a deeper level
            expect(conf.deeper.testEnv).toBe('test');

            // Use default value if an env variable is undefined
            expect(conf.undefinedEnv).toBe('default-undefined');

            // Overwritten value in a deeper level
            expect(conf.lowercaseEnv).toBe('test_lowercase');
        });
    });
});
