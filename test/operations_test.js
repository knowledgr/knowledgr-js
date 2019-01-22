var assert = require('assert');
var types = require('../src/auth/serializer/src/types');
var ops = require('../src/auth/serializer/src/operations');

describe("steem.auth: operation test", ()=> {

    it("templates", ()=> {
        for(let op in ops) {
            switch(op) {
                case "operation" : continue
            }
            template(ops[op])
        }
    })

    it("account_create", ()=> {
        let tx = {"ref_block_num": 19297,"ref_block_prefix": 1608085982,"expiration": "2016-03-23T22:41:21","operations": [ ["account_create",{"fee": "0.000 KNLG","creator": "initminer","new_account_name": "scott","owner": {"weight_threshold": 1,"account_auths": [],"key_auths": [ ["KWR7DTS62msowgpAZJBNRMStMUt5bfRA4hc9j5wjwU4vKhi3KFkKb",1 ]]},"active": {"weight_threshold": 1,"account_auths": [],"key_auths": [ ["KWR8k1f8fvHxLrCTqMdRUJcK2rCE3y7SQBb8PremyadWvVWMeedZy",1 ]]},"posting": {"weight_threshold": 1,"account_auths": [],"key_auths": [ ["KWR6DgpKJqoVGg7o6J1jdiP45xxbgoUg5VGzs96YBxX42NZu2bZea",1 ]]},"memo_key": "KWR6ppNVEFmvBW4jEkzxXnGKuKuwYjMUrhz2WX1kHeGSchGdWJEDQ","json_metadata": ""} ]],"extensions": [], "signatures": []}

        let tx_hex = "614bde71d95f911bf35601090000000000000000034b4e4c4700000009696e69746d696e65720573636f74740100000000010332757668fa45c2bc21447a2ff1dc2bbed9d9dda1616fd7b700255bd28e9d674a010001000000000103fb8900a262d51b908846be54fcf04b3a80d12ee749b9446f976b58b220ba4eed010001000000000102af4963d0f034043f4b4b0c99220e6a4b5d8b9cc71e5cd7d110f7602f3a0a11d1010002ff0de11ef55b998daf88047f1a00a60ed5dffb0c23c3279f8bd42a733845c5da000000"

        // 03 4b 4e 4c 47 00 0000
        assert.equal("KNLG", new Buffer("4b4e4c47", "hex").toString())
        let tx_object1 = ops.signed_transaction.fromObject(tx)
        let tx_object2 = ops.signed_transaction.fromHex(tx_hex)
        assert.deepEqual(tx, ops.signed_transaction.toObject(tx_object1))
        assert.deepEqual(tx, ops.signed_transaction.toObject(tx_object2))
        assert.deepEqual(tx_hex, ops.signed_transaction.toHex(tx_object1))
        assert.deepEqual(tx_hex, ops.signed_transaction.toHex(tx_object2))
    })

})

function template(op) {

    assert(op.toObject({}, {use_default: true}))
    assert(op.toObject({}, {use_default: true, annotate: true}))


}
