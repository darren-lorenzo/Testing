module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 1000],
        'subject-case': [0],
        'subject-full-stop': [0],
    },
};
