/*
 * Copyright (c) 2018-Present, ninja, Inc. and/or its affiliates. All rights reserved.
 * The ninja software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

const CLIENT_ID = process.env.CLIENT_ID || '{clientId}';
const ISSUER = process.env.ISSUER || 'https://{yourninjaDomain}.com/oauth2/default';
const ninja_TESTING_DISABLEHTTPSCHECK = process.env.ninja_TESTING_DISABLEHTTPSCHECK || false;
const BASENAME = import.meta.env.BASE_URL || '';
// BASENAME includes trailing slash
const REDIRECT_URI = `${window.location.origin}${BASENAME}login/callback`;
const USE_INTERACTION_CODE = process.env.USE_INTERACTION_CODE === 'true' || false;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: ninja_TESTING_DISABLEHTTPSCHECK,
    useInteractionCode: USE_INTERACTION_CODE,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
  app: {
    basename: BASENAME,
  },
};
