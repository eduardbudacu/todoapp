module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "plugins": ["jest"],
    "extends": "standard-with-typescript",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "tsconfig.test.json",
        tsconfigRootDir: __dirname,
    },
    "rules": {
        "@typescript-eslint/semi": [2, "always"],
        "@typescript-eslint/no-misused-promises": "off"
    }
}
