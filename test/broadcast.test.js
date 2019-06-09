import Promise from 'bluebird';
import should from 'should';
import steem from '../src';

const username = process.env.STEEM_USERNAME || 'guest123';
const password = process.env.STEEM_PASSWORD;
const postingWif = password
  ? steem.auth.toWif(username, password, 'posting')
  : '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

describe('steem.broadcast:', () => {
  describe('setOptions', () => {
    it('works', () => {
      let url = steem.config.get('uri');
      if (!url) url = steem.config.get('websocket');
      steem.api.setOptions({ url: url, useAppbaseApi: true });
      // console.log(steem.config);
      // steem.config.setOptions({ 'chain_id': '3ea6e60873c8ad342564b9f4b24def337be8c44509ce81a70d49c9169075dfcf' });
      // steem.config.setOptions({ 'address_prefix': 'KWR' });
    });
  });

  it('exists', () => {
    should.exist(steem.broadcast);
  });

  it('has generated methods', () => {
    should.exist(steem.broadcast.vote);
    should.exist(steem.broadcast.voteWith);
    should.exist(steem.broadcast.comment);
    should.exist(steem.broadcast.transfer);
  });

  it('has backing methods', () => {
    should.exist(steem.broadcast.send);
  });

  it('has promise methods', () => {
    should.exist(steem.broadcast.sendAsync);
    should.exist(steem.broadcast.voteAsync);
    should.exist(steem.broadcast.transferAsync);
  });

  describe('broadcast send test', () => {
    it('works', async () => {

      const suggestPassword = steem.formatter.createSuggestedPassword();
      console.log('------------suggest password: ', suggestPassword);
      const username = 'testuser' + '-' + Math.floor(Math.random() * 10000);
      console.log('------------username: ', username);
      const keys = steem.auth.generateKeys(username, suggestPassword, ['active', 'posting', 'owner', 'memo']);
      console.log(keys);

      // const wif = steem.auth.toWif('initminer', 'P5Jv2ZdePou8H1nLGBPUVzRkfVsk6th3LNgij7mWpQcXRw1Dhcfj', 'active');
      // console.log('---- initminer active wif', wif.toString());

      const payload = {
        fee: "0.030 KNLG",
        creator: 'initminer',
        new_account_name: username,
        "owner": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            [
              // "KWR8jgeh5FRsEn4pJ5Vz2tteQKFa9JeezgrtYsbmXJ3Ya5TXfREWA",
              keys.owner,
              1
            ]
          ]
        },
        "active": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            [
              // "KWR5b8KcTdatUUmW298QSy5Y1p4qKLVnREZ6mE2YgZSi8v5VeBhGo",
              keys.active,
              1
            ]
          ]
        },
        "posting": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            [
              // "KWR5v2naFnAjJDSUDn4wxT3nxR5isGMTnjLLC1C8Sc3HuNcU3hR5Q",
              keys.posting,
              1
            ]
          ]
        },
        // "memo_key": "KWR87AJbZ8WgcQ4m3LF4hbmr4oihi5gM552f2ite1uHuWqtRiUYs2",
        "memo_key": keys.memo,
        json_metadata: "{}",
      };
      // console.log(payload);

      try {
        const tx = await steem.broadcast.sendAsync({
          extensions: [],
          operations: [
            ['account_create', payload]
          ],
        }, ['5Jv2ZdePou8H1nLGBPUVzRkfVsk6th3LNgij7mWpQcXRw1Dhcfj']);

        tx.should.have.properties([
          'expiration',
          'ref_block_num',
          'ref_block_prefix',
          'extensions',
          'operations',
        ]);
      } catch (error) {
        console.log('--- error', error);
      }
    });
  });

  // TODO: following cases should be updated after checking knowledgr rpc apis for broadcast
  /*
  describe('patching transaction with default global properties', () => {
    it('works', async () => {
      const tx = await steem.broadcast._prepareTransaction({
        extensions: [],
        operations: [['vote', {
          voter: 'yamadapc',
          author: 'yamadapc',
          permlink: 'test-1-2-3-4-5-6-7-9',
        }]],
      });

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
      ]);
    });
  });

  describe('downvoting', () => {
    it('works', async () => {
      const tx = await steem.broadcast.voteAsync(
        postingWif,
        username,
        'yamadapc',
        'test-1-2-3-4-5-6-7-9',
        -1000
      );
      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
        'signatures',
      ]);
    });
  });

  describe('voting', () => {
    beforeEach(() => {
      return Promise.delay(2000);
    });

    it('works', async () => {
      const tx = await steem.broadcast.voteAsync(
        postingWif,
        username,
        'yamadapc',
        'test-1-2-3-4-5-6-7-9',
        10000
      );

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
        'signatures',
      ]);
    });

    it('works with callbacks', (done) => {
      steem.broadcast.vote(
        postingWif,
        username,
        'yamadapc',
        'test-1-2-3-4-5-6-7-9',
        5000,
        (err, tx) => {
          if (err) return done(err);
          tx.should.have.properties([
            'expiration',
            'ref_block_num',
            'ref_block_prefix',
            'extensions',
            'operations',
            'signatures',
          ]);
          done();
        }
      );
    });
  });

  describe('customJson', () => {
    before(() => {
      return Promise.delay(2000);
    });

    it('works', async () => {
      const tx = await steem.broadcast.customJsonAsync(
        postingWif,
        [],
        [username],
        'follow',
        JSON.stringify([
          'follow',
          {
            follower: username,
            following: 'fabien',
            what: ['blog'],
          },
        ])
      );

      tx.should.have.properties([
        'expiration',
        'ref_block_num',
        'ref_block_prefix',
        'extensions',
        'operations',
        'signatures',
      ]);
    });
  });
  // */

  // describe('writeOperations', () => {
  //   it('receives a properly formatted error response', () => {
  //     const wif = steem.auth.toWif('kgil', 'P5JBjvZu1ExQvw9a7p4hnVRF3fuYjSB62vMEsp1RdjScWoutFpdr', 'posting');
  //     return steem.broadcast.voteAsync(wif, 'voter', 'author', 'permlink', 0).
  //       then(() => {
  //         throw new Error('writeOperation should have failed but it didn\'t');
  //       }, (e) => {
  //         should.exist(e.message);
  //       });
  //   });
  // });
});
