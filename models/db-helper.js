// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

'use strict';

const { SSM } = require('aws-sdk')
const ssm = new SSM()

const f = require('faunadb');

let client;

const init = async () => {
    let parameterName = process.env.FAUNA_SECRET_PARAMETER

    // Get the Fauna Server Key from AWS Systems Manager Parameter Store at runtime.
    const { Parameter: { Value } } = await ssm.getParameter({ Name: parameterName, WithDecryption: true }).promise();
    
    // Setup our Fauna client
    client = new f.Client({ secret: Value }, { headers: { 'X-Fauna-Source': 'blog-app-runner' } })
}

// This starts our initialization before a handler is invoked by calling the `init` function above
module.exports.default = init();

// Export the client for others to use.
module.exports.client = client;
