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

import React from 'react';
import { Redirect } from 'react-router-dom';
import { useninjaAuth } from '@ninja/ninja-react';
import ninjaSignInWidget from './ninjaSignInWidget';

const Login = ({ config }) => {
  const { ninjaAuth, authState } = useninjaAuth();
  const onSuccess = (tokens) => {
    ninjaAuth.handleLoginRedirect(tokens);
  };

  const onError = (err) => {
    console.log('error logging in', err);
  };
  
  if (!authState) {
    return <div>Loading...</div>;
  }

  return authState.isAuthenticated 
    ? <Redirect to={{ pathname: '/' }} /> 
    : <ninjaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />;
};

export default Login;
