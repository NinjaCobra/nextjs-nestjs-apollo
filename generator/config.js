/*!
 * Copyright (c) 2017-Present, ninja, Inc. and/or its affiliates. All rights reserved.
 * The ninja software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

module.exports = [
  {
    name: '@ninja/samples.react.ninja-hosted-login',
    useSiw: false,
    useSemanticUi: true,
    usePolyfill: true,
    reactRouterDomVersion: '5.2.0',
    reachRouterVersion: false,
    specs: [
      'ninja-hosted-login'
    ]
  },
  {
    name: '@ninja/samples.react.custom-login',
    useSiw: true,
    useSemanticUi: true,
    usePolyfill: true,
    reactRouterDomVersion: '5.2.0',
    reachRouterVersion: false,
    specs: [
      'custom-login'
    ]
  },
  {
    name: '@ninja/samples.react.doc-embedded-widget',
    useSiw: true,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '5.2.0',
    reachRouterVersion: false,
    specs: [
      'doc-embedded-widget'
    ]
  },
  {
    name: '@ninja/samples.react.doc-direct-auth',
    useSiw: false,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '5.2.0',
    reachRouterVersion: false,
    specs: [
      'doc-direct-auth'
    ]
  },
  {
    name: '@ninja/samples.react.react-router-dom-v6',
    nested: 'routing/',
    useSiw: false,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '6.2.1',
    reachRouterVersion: false,
    specs: [
      'router-sample'
    ]
  },
  {
    name: '@ninja/samples.react.react-router-dom-v6-hash',
    nested: 'routing/',
    useSiw: false,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '6.2.1',
    reachRouterVersion: false,
    specs: [
      'router-sample'
    ]
  },
  {
    name: '@ninja/samples.react.react-router-dom-v5',
    nested: 'routing/',
    useSiw: false,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '5.3.0',
    reachRouterVersion: false,
    specs: [
      'router-sample'
    ]
  },
  {
    name: '@ninja/samples.react.react-router-dom-v5-hash',
    nested: 'routing/',
    useSiw: false,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '5.3.0',
    reachRouterVersion: false,
    specs: [
      'router-sample'
    ]
  },
  {
    name: '@ninja/samples.react.reach-router',
    nested: 'routing/',
    useSiw: false,
    useSemanticUi: false,
    usePolyfill: false,
    reactRouterDomVersion: '5.3.0',
    reachRouterVersion: "^1.3.4",
    specs: [
      'router-sample'
    ]
  }
];
