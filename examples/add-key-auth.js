const steem = require('../lib');

/* Generate private active WIF */
const username = process.env.STEEM_USERNAME;
const password = process.env.STEEM_PASSWORD;
const privActiveWif = steem.auth.toWif(username, password, 'active');

/** Add posting key auth */
steem.broadcast.addKeyAuth({
    signingKey: privActiveWif,
    username,
    authorizedKey: 'KWR7YH9c5qkNGZ2u5AnyuKSYDjhDW5taNi6ELLnNxUtRAHVaXBfCq',
    role: 'posting',
  },
  (err, result) => {
    console.log(err, result);
  }
);
