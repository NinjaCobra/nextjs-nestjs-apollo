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

import React from 'react';

import { useHistory } from 'react-router-dom';
import { Security } from '@ninja/ninja-react';
import { ninjaAuth, toRelativeUrl } from '@ninja/ninja-auth-js';
import config from './config';

import Footer from './components/Footer';
import Nav from './components/Nav';
import Routes from './components/Routes';


const ninjaAuth = new ninjaAuth(config.oidc);

function App() {
  const history = useHistory();
  const restoreOriginalUri = (_ninjaAuth: any,  originalUri: string) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security ninjaAuth={ninjaAuth} restoreOriginalUri={restoreOriginalUri}>
      <div className="App">
        <header className="App-header">
          <Nav />
        </header>
        <main>
          <Routes />
        </main>
        <Footer />
      </div>
    </Security>
  );
}

export default App;
