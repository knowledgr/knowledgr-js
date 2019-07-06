import Promise from 'bluebird';
import should from 'should';
import steem from '../src';

const username = process.env.STEEM_USERNAME;
const password = process.env.STEEM_PASSWORD;
const activeWif = password
  ? steem.auth.toWif(username, password, 'active')
  : '5HrfnP3V9wMP5P5uLqW1Ruj4sHFjGBJtt1moGJUzDqL5nvXTSyf';

console.log(`------ activeWif: ${activeWif}`);

describe('steem.broadcast:', () => {
  describe('setOptions', () => {
    it('works', () => {
      let url = steem.config.get('uri');
      if (!url) url = steem.config.get('websocket');
      // steem.api.setOptions({ url: url, useAppbaseApi: true });
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

    it('expertise update works', async () => {
      const payload = {
        admin: username,
        account: 'oleg',
        expertises: [
          "logic: 6"
        ]
      };
      console.log(payload);

      try {
        const tx = await steem.broadcast.sendAsync({
          extensions: [],
          operations: [
            ['account_expertise_update', payload]
          ],
        }, [activeWif]);

        console.log('---------- account_expertise_update tx:', tx);

        // tx.should.have.properties([
        //   'expiration',
        //   'ref_block_num',
        //   'ref_block_prefix',
        //   'extensions',
        //   'operations',
        // ]);
      } catch (error) {
        console.log('--- error', error);
      }
    });
  });
});
