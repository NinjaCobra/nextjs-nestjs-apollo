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

import { useNavigate } from 'react-router-dom';
import { useninjaAuth } from '@ninja/ninja-react';

const LoginCallback: React.FC<{
  homePath: string,
  loadingElement: React.ReactElement
}> = ({ homePath, loadingElement }) => {
  const { ninjaAuth } = useninjaAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleLoginRedirect = async () => {
      await ninjaAuth.handleLoginRedirect();
    };
  
    if (ninjaAuth.token.isLoginRedirect()) {
      // store redirectUri, it's cleared after `handleLoginRedirect` call
      const redirectUri = ninjaAuth.getOriginalUri();
      handleLoginRedirect()
      .then(() => {
        if (!redirectUri) {
          // manual redirect when redirectUri is not set
          // otherwise allow default behavior
          navigate(homePath, { replace: true });
        }
      })
      .catch(e => {
        // TODO: handle error state(s)
        console.error(e);
      });
    }
    else {
      // we landed on root path, but do not have login callback params in url query string
      navigate(homePath, { replace: true });
    }
  }, [ninjaAuth, navigate, homePath]);

  return loadingElement;
};

export default LoginCallback;
