/*
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

import * as React from 'react';
import { useninjaAuth, OnAuthResumeFunction } from './ninjaContext';
import ninjaError from './ninjaError';

interface LoginCallbackProps {
  errorComponent?: React.ComponentType<{ error: Error }>;
  onAuthResume?: OnAuthResumeFunction;
  loadingElement?: React.ReactElement;
}

let handledRedirect = false;

const LoginCallback: React.FC<LoginCallbackProps> = ({ errorComponent, loadingElement = null, onAuthResume }) => { 
  const { ninjaAuth, authState } = useninjaAuth();
  const [callbackError, setCallbackError] = React.useState(null);

  const ErrorReporter = errorComponent || ninjaError;
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore ninja-464505: backward compatibility support for auth-js@5
    const isInteractionRequired = ninjaAuth.idx.isInteractionRequired || ninjaAuth.isInteractionRequired.bind(ninjaAuth);
    if (onAuthResume && isInteractionRequired()) {
      onAuthResume();
      return;
    }
    // ninja-635977: Prevents multiple calls of handleLoginRedirect() in React18 StrictMode
    // Top-level variable solution follows: https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
    if (!handledRedirect) {
      ninjaAuth.handleLoginRedirect().catch(e => {
        setCallbackError(e);
      })
      handledRedirect = true;
    }
  }, [ninjaAuth]);

  const authError = authState?.error;
  const displayError = callbackError || authError;
  if (displayError) { 
    return <ErrorReporter error={displayError}/>;
  }

  return loadingElement;
};

export default LoginCallback;
