const bcrypt = require('bcryptjs');
const password = 'rathod1234';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
