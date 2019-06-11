import Promise from 'bluebird';
import should from 'should';
import steem from '../src';
import paramTypes from '../src/broadcast/param_types';
import pkg from '../package.json';

const username = process.env.STEEM_USERNAME || 'kgil';
const password = process.env.STEEM_PASSWORD || 'P5JBjvZu1ExQvw9a7p4hnVRF3fuYjSB62vMEsp1RdjScWoutFpdr';
const postingWif = password
  ? steem.auth.toWif(username, password, 'posting')
  : '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

// console.log('----- postingWif: ', postingWif);
describe('steem.broadcast:', () => {

  describe('comment with options', () => {
    before(() => {
      return Promise.delay(2000);
    });

    it('paramTypes', () => {
      paramTypes.expertise_category[1].should.eql('Logic');
      paramTypes.comment_type[0].should.eql({ key: 'O', label: 'Observation' })
    })

    it('works', async () => {
      const permlink = steem.formatter.commentPermlink(username, 'test') + Math.floor(Math.random() * 10000);
      // console.log('------ permlink: ', permlink);
      const summary = 'This is test summary';
      const operations = [
        ['comment',
          {
            parent_author: '',
            parent_permlink: 'knowledgr',
            author: username,
            permlink,
            title: 'Test',
            body: `This is a test using Steem.js v${pkg.version}.`,
            // json_metadata: '{}',
            json_metadata: JSON.stringify({
              tags: ['test'],
              app: `steemjs/${pkg.version}`,
              summary
            }),
            type: 0, // O : paramTypes.comment_type[0]
            citations: [
              {
                author: 'kgil',
                permlink: 're-kgil-test-20190610t062342711z4019'
              }
            ],
            categories: [
              0, // Logic : paramTypes.expertise_category[1]
              1, // Mathematics  : paramTypes.expertise_category[2]
            ],
          }
        ],
        ['comment_options', {
          author: username,
          permlink,
          max_accepted_payout: '10000.000 KNLG',
          percent_knowledgr_dollars: 10000,
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [
            [0, {
              beneficiaries: [
                { account: 'kgil', weight: 2000 },
                { account: 'null', weight: 5000 }
              ]
            }]
          ]
        }]
      ];

      // console.log('------ operations: ', operations);
      const tx = await steem.broadcast.sendAsync(
        { operations, extensions: [] },
        { posting: postingWif }
      );
      // console.log('------ tx: ', tx);

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
});
