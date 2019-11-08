module.exports = {
    "extends": "airbnb-base",
    "plugins": ["prettier"],
    "rules": {
        "prettier/prettier": ["error"],
        "no-console": 0,
        "no-underscore-dangle": 0
    },
    "env": {
        "mocha": true
    },
};