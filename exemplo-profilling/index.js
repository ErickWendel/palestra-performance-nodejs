"use strict";
const crypto = require('crypto');
function hash(password, cb) {
    crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', cb);
}

// Imagine that loop below is real requests to some route
for (let i = 0; i < 15; i++) {
    hash('random_password', (error, hash) => console.log(i));
}