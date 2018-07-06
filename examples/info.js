#!/usr/bin/env node
// *****************************************************************************
// Copyright 2013-2018 Aerospike, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// *****************************************************************************

const Aerospike = require('aerospike')
const shared = require('./shared')

shared.cli.checkMainRunner(module)

async function info (client, argv) {
  const request = argv.requests.join('\n')
  if (argv.any) {
    return infoAny(client, request)
  } else {
    return infoAll(client, request)
  }
}

async function infoAny (client, request) {
  let response = await client.infoAny(request)
  if (response) {
    console.info(response.trim())
  } else {
    console.info('Invalid request')
  }
}

async function infoAll (client, request) {
  let responses = await client.infoAll(request)
  if (responses.some((response) => response.info)) {
    responses.map((response) => {
      console.info(`${response.host.node_id}:`)
      console.info(response.info.trim())
    })
  } else {
    console.info('Invalid request')
  }
}

exports.command = 'info <requests...>'
exports.describe = 'Send an info request to the cluster'
exports.handler = shared.run(info)
exports.builder = {
  'any': {
    describe: 'Send request to a single, randomly selected cluster node',
    group: 'Command:',
    requiresArg: false,
    conflicts: ['all']
  },
  'all': {
    describe: 'Send request to all cluster nodes',
    group: 'Command:',
    requiresArg: false,
    conflicts: ['any']
  }
}
