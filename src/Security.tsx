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

import * as React from 'react';
import { AuthSdkError, AuthState, ninjaAuth } from '@ninja/ninja-auth-js';
import ninjaContext, { OnAuthRequiredFunction, RestoreOriginalUriFunction } from './ninjaContext';
import ninjaError from './ninjaError';
import { compare as compareVersions } from 'compare-versions';

declare const AUTH_JS: {
  minSupportedVersion: string;
}

declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;
declare const SKIP_VERSION_CHECK: string;

const Security: React.FC<{
  ninjaAuth: ninjaAuth,
  restoreOriginalUri: RestoreOriginalUriFunction, 
  onAuthRequired?: OnAuthRequiredFunction,
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>> = ({ 
  ninjaAuth,
  restoreOriginalUri, 
  onAuthRequired, 
  children
}) => { 
  const [authState, setAuthState] = React.useState(() => {
    if (!ninjaAuth) {
      return null;
    }
    return ninjaAuth.authStateManager.getAuthState();
  });

  React.useEffect(() => {
    if (!ninjaAuth || !restoreOriginalUri) {
      return;
    }

    // Add default restoreOriginalUri callback
    // props.restoreOriginalUri is required, therefore if options.restoreOriginalUri exists, there are 2 callbacks
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ninjaAuth.options.restoreOriginalUri) {
      console.warn('Two custom restoreOriginalUri callbacks are detected. The one from the ninjaAuth configuration will be overridden by the provided restoreOriginalUri prop from the Security component.');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ninjaAuth.options.restoreOriginalUri = (async (ninjaAuth: unknown, originalUri: string) => {
      return restoreOriginalUri(ninjaAuth as ninjaAuth, originalUri);
    }) as ((ninjaAuth: ninjaAuth, originalUri?: string) => Promise<void>);

  }, []); // empty array, only check on component mount

  React.useEffect(() => {
    if (!ninjaAuth) {
      return;
    }

    // Add ninja-react userAgent
    if (ninjaAuth._ninjaUserAgent) {
      ninjaAuth._ninjaUserAgent.addEnvironment(`${PACKAGE_NAME}/${PACKAGE_VERSION}`);
    } else {
      console.warn('_ninjaUserAgent is not available on auth SDK instance. Please use ninja-auth-js@^5.3.1 .');
    }

    // Update Security provider with latest authState
    const currentAuthState = ninjaAuth.authStateManager.getAuthState();
    if (currentAuthState !== authState) {
      setAuthState(currentAuthState);
    }
    const handler = (authState: AuthState) => {
      setAuthState(authState);
    };
    ninjaAuth.authStateManager.subscribe(handler);

    // Trigger an initial change event to make sure authState is latest
    ninjaAuth.start();

    return () => {
      ninjaAuth.authStateManager.unsubscribe(handler);
    };
  }, [ninjaAuth]);

  if (!ninjaAuth) {
    const err = new AuthSdkError('No ninjaAuth instance passed to Security Component.');
    return <ninjaError error={err} />;
  }

  if (!restoreOriginalUri) {
    const err = new AuthSdkError('No restoreOriginalUri callback passed to Security Component.');
    return <ninjaError error={err} />;
  }

  if (!ninjaAuth._ninjaUserAgent) {
    console.warn('_ninjaUserAgent is not available on auth SDK instance. Please use ninja-auth-js@^5.3.1 .');
  }
  else {
    // use SKIP_VERSION_CHECK flag to control version check in tests
    // ninja-465157: remove SKIP_VERSION_CHECK
    const isAuthJsSupported = SKIP_VERSION_CHECK === '1' ||
      compareVersions(ninjaAuth._ninjaUserAgent.getVersion(), AUTH_JS.minSupportedVersion, '>=');
    if (!isAuthJsSupported) {
      const err = new AuthSdkError(`
        Passed in ninjaAuth is not compatible with the SDK,
        minimum supported ninja-auth-js version is ${AUTH_JS.minSupportedVersion}.
      `);
      return <ninjaError error={err} />;
    }
  }

  return (
    <ninjaContext.Provider value={{ 
      ninjaAuth, 
      authState, 
      _onAuthRequired: onAuthRequired
    }}>
      {children}
    </ninjaContext.Provider>
  );
};

export default Security;
