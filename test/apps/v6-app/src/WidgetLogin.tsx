/*
 * Copyright (c) 2018, ninja, Inc. and/or its affiliates. All rights reserved.
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
import { useninjaAuth } from '@ninja/ninja-react';

declare global {
  // TODO: Remove "any"s once widget has TS definitions
  interface Window { ninjaSignIn: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}

const WidgetLogin: React.FC<{
  baseUrl: string;
}> = (baseUrl) => {
  const { ninjaAuth } = useninjaAuth();
  const widgetRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect( () => {
    if (!widgetRef.current) {
      return;
    }

    const widget = new window.ninjaSignIn({
      baseUrl,
      authClient: ninjaAuth, // Note: the interactionCodeFlow below requires PKCE enabled on the authClient 
      useInteractionCodeFlow: true, // Set to true, if your org is OIE enabled
    });

    widget.on('afterError', (context: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log({ context });
      // The Widget is ready for user input
    });

    widget.renderEl(
      { el: widgetRef.current },
      (res: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log(res);
        ninjaAuth.handleLoginRedirect(res.tokens);
      },
      (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log({ err });  
        throw err;
      },
    );

    return () => widget.remove();
  }, [ninjaAuth, baseUrl]);

  return (
    <div>
      <p>Note: Requires interaction code flow and PKCE</p>
      <div ref={widgetRef} />
    </div>
  );
};
export default WidgetLogin;
