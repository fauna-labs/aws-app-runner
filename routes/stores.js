// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

'use strict';

var express = require('express');
var router = express.Router();

const f = require('faunadb'),
    q = f.query

let fauna = require('../models/db-helper');
let client = fauna.client;

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
