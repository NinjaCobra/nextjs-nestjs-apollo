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
import { Routes, Route } from 'react-router-dom';
import { LoginCallback } from '@ninja/ninja-react';
import { RequiredAuth } from './SecureRoute';

import Home from '../pages/Home';
import Protected from '../pages/Protected';
import Loading from './Loading';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='login/callback' element={<LoginCallback loadingElement={<Loading />} />} />
      <Route path='/protected' element={<RequiredAuth />}>
        <Route path='' element={<Protected />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
