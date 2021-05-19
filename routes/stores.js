// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

'use strict';

var express = require('express');
var router = express.Router();
const { SSM } = require('aws-sdk')
const ssm = new SSM()

const f = require('faunadb'),
    q = f.query

let client;

const init = async () => {
    param = process.env.FAUNA_SECRET_PARAMETER
    console.log(`Got secret parameter key ${param}`);

    // Get the Fauna Server Key from AWS Systems Manager Parameter Store at runtime.
    const { Parameter: { Value } } = await ssm.getParameter({ Name:  process.env.FAUNA_SECRET_PARAMETER, WithDecryption: true }).promise();
    
    console.log(`Got decrypted parameter value ${Value}`);
    
    // Setup our Fauna client
    client = new f.Client({ secret: Value }, { headers: { 'X-Fauna-Source': 'blog-app-runner' } })
}

// This starts our initialization before a handler is invoked by calling the `init` function above
const initComplete = init();

/* GET stores listing. */
router.get('/', async function(req, res, next) {
    let results = await client.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection('stores'))),
            q.Lambda(product => q.Get(product))
        )
    );

    res
        .status(200)
        .json(results)
        .send();
});

/* POST stores listing. */
router.post('/', async function(req, res, next) {
    let result = await client.query(
        q.Create(q.Collection('stores'), { data: req.body })
    );

    res
        .status(200)
        .json(result)
        .send();
});

/* PUT stores listing. */
router.put('/:id', async function(req, res, next) {
    let result = await client.query(
        q.Update(
            q.Ref(q.Collection('stores'), req.params.id),
            { data: req.body }
        )
    );

    res
        .status(200)
        .json(result)
        .send();
});

/* DELETE stores listing. */
router.delete('/:id', async function(req, res, next) {
    let result = await client.query(
        q.Delete(q.Ref(q.Collection('stores'), req.params.id)));

    res
        .status(200)
        .json(result)
        .send();
});

module.exports = router;
