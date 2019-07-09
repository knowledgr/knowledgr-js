import Promise from 'bluebird';
import should from 'should';
import steem from '../src';
import { doesNotReject } from 'assert';

const username = process.env.STEEM_USERNAME;
const password = process.env.STEEM_PASSWORD;
const activeWif = password
  ? steem.auth.toWif(username, password, 'active')
  : '5HrfnP3V9wMP5P5uLqW1Ruj4sHFjGBJtt1moGJUzDqL5nvXTSyf';

describe('steem.broadcast:', () => {
  describe('setOptions', () => {
    it('works', () => {
      let url = steem.config.get('uri');
      if (!url) url = steem.config.get('websocket');
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
        expertises: [{category: 1, level: 9}] // Logic: 9
      };
      console.log(payload);

      try {
        const tx = await steem.broadcast.sendAsync({
          extensions: [],
          operations: [
            ['account_expertise_update', payload]
          ],
        }, [activeWif]);

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
