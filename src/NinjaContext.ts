/*
 * Copyright (c) 2020-Present, ninja, Inc. and/or its affiliates. All rights reserved.
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
import { AuthState, ninjaAuth } from '@ninja/ninja-auth-js';

export type OnAuthRequiredFunction = (ninjaAuth: ninjaAuth) => Promise<void> | void;
export type OnAuthResumeFunction = () => void;

export type RestoreOriginalUriFunction = (ninjaAuth: ninjaAuth, originalUri: string) => Promise<void> | void;

export interface IninjaContext {
    ninjaAuth: ninjaAuth;
    authState: AuthState | null;
    _onAuthRequired?: OnAuthRequiredFunction;
}

const ninjaContext = React.createContext<IninjaContext | null>(null);

export const useninjaAuth = (): IninjaContext => React.useContext(ninjaContext) as IninjaContext;

export default ninjaContext;
