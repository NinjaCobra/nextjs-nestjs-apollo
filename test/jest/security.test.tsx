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
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import Security from '../../src/Security';
import { useninjaAuth } from '../../src/ninjaContext';
import { AuthState, ninjaAuth } from '@ninja/ninja-auth-js';

declare global {
  let SKIP_VERSION_CHECK: any;
}

console.warn = jest.fn();

describe('<Security />', () => {
  let ninjaAuth: ninjaAuth;
  let initialAuthState: AuthState | null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const restoreOriginalUri = async (_: ninjaAuth, url: string) => {
    // leaving empty, doesn't affect tests, was causing jsdom error (location.href is not supported)
    // location.href = url;
  };
  beforeEach(() => {
    jest.clearAllMocks();

    initialAuthState = {
      isInitialState: true
    };
    ninjaAuth = {
      _ninjaUserAgent: {
        addEnvironment: jest.fn(),
        getHttpHeader: jest.fn(),
        getVersion: jest.fn()
      } as any,
      options: {},
      authStateManager: {
        getAuthState: jest.fn().mockImplementation(() => initialAuthState),
        updateAuthState: jest.fn(),
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
      } as any,
      start: jest.fn(),
      stop: jest.fn(),
      isLoginRedirect: jest.fn().mockImplementation(() => false),
    } as any;
  });

  it('adds an environmemnt to ninjaAuth\'s _ninjaUserAgent', () => {
    const addEnvironmentSpy = jest.spyOn(ninjaAuth._ninjaUserAgent, 'addEnvironment');

    const mockProps = {
      ninjaAuth,
      restoreOriginalUri
    };
    mount(<Security {...mockProps} />);
    // package name and version defined in jest.config.js
    expect(addEnvironmentSpy).toBeCalledWith(`ninja-react-test/3.14.15`);
  });

  it('logs a warning in case _ninjaUserAgent is not available on auth SDK instance', () => {
    const ninjaAuthWithoutUserAgent: any = {
      ...ninjaAuth
    };
    delete ninjaAuthWithoutUserAgent['_ninjaUserAgent'];
    const mockProps = {
      ninjaAuth: ninjaAuthWithoutUserAgent,
      restoreOriginalUri
    };
    mount(<Security {...mockProps} />);
    expect(console.warn).toBeCalled();
  });

  describe('throws version not match error', () => {
    let originalConsole: any;

    // turn off SKIP_VERSION_CHECK to test the functionality
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      SKIP_VERSION_CHECK = '0';

      originalConsole = global.console;
      global.console = {
        ...originalConsole,
        warn: jest.fn()
      };
    });
    afterEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      SKIP_VERSION_CHECK = '1';
      global.console = originalConsole;
    });
    it('throws runtime error when passed in authJS version is too low', () => {
      const ninjaAuthWithMismatchingSDKVersion = {
        ...ninjaAuth,
        _ninjaUserAgent: {
          addEnvironment: jest.fn(),
          getVersion: jest.fn().mockReturnValue('1.0.0') // intentional large mock version
        } as any
      } as ninjaAuth;

      const mockProps = {
        ninjaAuth: ninjaAuthWithMismatchingSDKVersion,
        restoreOriginalUri
      };

      const wrapper = mount(<Security {...mockProps} />);
      expect(wrapper.find(Security).text().trim()).toBe(`AuthSdkError: 
        Passed in ninjaAuth is not compatible with the SDK,
        minimum supported ninja-auth-js version is 5.3.1.`
      );
    });

    it('logs a warning when _ninjaUserAgent is not available', () => {
      const ninjaAuthWithMismatchingSDKVersion = {
        ...ninjaAuth,
        _ninjaUserAgent: undefined
      };

      const mockProps = {
        ninjaAuth: ninjaAuthWithMismatchingSDKVersion as any,
        restoreOriginalUri
      };

      mount(<Security {...mockProps} />);
      expect(global.console.warn).toHaveBeenCalledWith('_ninjaUserAgent is not available on auth SDK instance. Please use ninja-auth-js@^5.3.1 .');
    });
  });

  describe('restoreOriginalUri', () => {
    it('should set default restoreOriginalUri callback in ninjaAuth.options', () => {
      ninjaAuth.options = {};
      const mockProps = {
        ninjaAuth,
        restoreOriginalUri
      };
      mount(<Security {...mockProps} />);
      expect(ninjaAuth.options.restoreOriginalUri).toBeDefined();
    });

    it('should only log warning of restoreOriginalUri option once', () => {
      ninjaAuth.options = {
        restoreOriginalUri
      };
      const mockProps = {
        ninjaAuth,
        restoreOriginalUri
      };
      const warning = 'Two custom restoreOriginalUri callbacks are detected. The one from the ninjaAuth configuration will be overridden by the provided restoreOriginalUri prop from the Security component.';
      const spy = jest.spyOn(console, 'warn');
      const wrapper = mount(<Security {...mockProps} />);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(warning);
      spy.mockClear();
      wrapper.setProps({restoreOriginalUri: 'foo'});    // forces rerender
      expect(spy).toBeCalledTimes(0);
    });

    it('should await the resulting Promise when a fn returning a Promise is provided', async () => {
      ninjaAuth.options = {};

      let hasResolved = false;
      const restoreSpy = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          // adds small sleep so non-awaited promises will "fallthrough"
          // and the test will fail, unless it awaits for the sleep duration
          // (meaning the resulting promise was awaited)
          setTimeout(() => {
            hasResolved = true;
            resolve('foo');
          }, 500);
        });
      });

      mount(<Security ninjaAuth={ninjaAuth} restoreOriginalUri={restoreSpy} />);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await ninjaAuth.options.restoreOriginalUri!(ninjaAuth, 'foo');
      expect(hasResolved).toEqual(true);
      expect(restoreSpy).toHaveBeenCalledTimes(1);
      expect(restoreSpy).toHaveBeenCalledWith(ninjaAuth, 'foo');
    });
  });

  it('gets initial state from ninjaAuth and exposes it on the context', () => {
    const mockProps = {
      ninjaAuth,
      restoreOriginalUri
    };
    const MyComponent = jest.fn().mockImplementation(() => {
      const ninjaProps = useninjaAuth();
      expect(ninjaProps.authState).toBe(initialAuthState);
      return null; 
    });
    mount(
      <MemoryRouter>
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      </MemoryRouter>
    );
    expect(ninjaAuth.authStateManager.getAuthState).toHaveBeenCalled();
    expect(MyComponent).toHaveBeenCalled();
  });

  it('calls start and updates the context, does NOT call stop', () => {
    initialAuthState = null;
    const newAuthState = {
      fromUpdateAuthState: true
    };
    let callback: (state: AuthState | null) => void;
    ninjaAuth.authStateManager.subscribe = jest.fn().mockImplementation(fn => {
      callback = fn;
    });
    ninjaAuth.start = jest.fn().mockImplementation(() => {
      callback(newAuthState);
    });
    const mockProps = {
      ninjaAuth,
      restoreOriginalUri
    };

    const MyComponent = jest.fn()
      // first call
      .mockImplementationOnce(() => {
        const ninjaProps = useninjaAuth();
        expect(ninjaProps.authState).toBe(initialAuthState);
        return null;
      })
      // second call
      .mockImplementationOnce(() => {
        const ninjaProps = useninjaAuth();
        expect(ninjaProps.authState).toBe(newAuthState);
        return null;
      });

    const component = mount(
      <MemoryRouter>
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      </MemoryRouter>
    );

    expect(ninjaAuth.authStateManager.subscribe).toHaveBeenCalledTimes(1);
    expect(ninjaAuth.start).toHaveBeenCalledTimes(1);
    expect(MyComponent).toHaveBeenCalledTimes(2);
    component.unmount();
    expect(ninjaAuth.authStateManager.unsubscribe).toHaveBeenCalledTimes(1);
    expect(ninjaAuth.stop).toHaveBeenCalledTimes(0);
  });

  it('subscribes to "authStateChange" and updates the context', () => {
    const mockAuthStates: Array<AuthState | null> = [
      initialAuthState,
      {
        fromUpdateAuthState: true
      },
      {
        fromEventDispatch: true
      }
    ];
    const callbacks: Array<(state: AuthState | null) => void> = [];
    let stateCount = 0;
    callbacks.push(() => {
      // dummy subscriber that should be preserved after `<Security />` unmount
    });
    ninjaAuth.authStateManager.getAuthState = jest.fn().mockImplementation( () => { 
      return mockAuthStates[stateCount];
    });
    ninjaAuth.authStateManager.subscribe = jest.fn().mockImplementation(fn => {
      callbacks.push(fn);
    });
    ninjaAuth.authStateManager.unsubscribe = jest.fn().mockImplementation(fn => {
      const index = callbacks.indexOf(fn);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    });
    ninjaAuth.start = jest.fn().mockImplementation(() => {
      stateCount++;
      callbacks.map(fn => fn(mockAuthStates[stateCount]));
    });
    const mockProps = {
      ninjaAuth,
      restoreOriginalUri
    };
    const MyComponent = jest.fn()
      // first call
      .mockImplementationOnce(() => {
        const ninjaProps = useninjaAuth();
        expect(ninjaProps.authState).toBe(initialAuthState);
        return null;
      })
      // second call
      .mockImplementationOnce(() => {
        const ninjaProps = useninjaAuth();
        expect(ninjaProps.authState).toBe(mockAuthStates[1]);
        return null;
      })
      // third call
      .mockImplementationOnce(() => {
        const ninjaProps = useninjaAuth();
        expect(ninjaProps.authState).toBe(mockAuthStates[2]);
        return null;
      });

    const component = mount(
      <MemoryRouter>
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      </MemoryRouter>
    );

    expect(callbacks.length).toEqual(2);
    expect(ninjaAuth.authStateManager.subscribe).toHaveBeenCalledTimes(1);
    expect(ninjaAuth.start).toHaveBeenCalledTimes(1);
    expect(MyComponent).toHaveBeenCalledTimes(2);
    MyComponent.mockClear();
    act(() => {
      stateCount++;
      callbacks.map(fn => fn(mockAuthStates[stateCount]));
    });
    expect(MyComponent).toHaveBeenCalledTimes(1);

    component.unmount();
    expect(ninjaAuth.stop).toHaveBeenCalledTimes(0);
    expect(ninjaAuth.authStateManager.unsubscribe).toHaveBeenCalledTimes(1);
    expect(callbacks.length).toEqual(1);
  });

  it('should accept a className prop and render a component using the className', () => {
    const mockProps = {
      ninjaAuth,
      restoreOriginalUri
    };
    const wrapper = mount(
      <MemoryRouter>
        <Security {...mockProps} className='foo bar' />
      </MemoryRouter>
    );
    expect(wrapper.find(Security).hasClass('foo bar')).toEqual(true);
    expect(wrapper.find(Security).props().className).toBe('foo bar');
  });

  describe('render children', () => {
    const MyComponent = function() {
      const { authState } = useninjaAuth();
      if (!authState) {
        return <div>loading</div>;
      }

      if (authState.isAuthenticated) {
        return <div>Authenticated!</div>;
      }

      return <div>Not authenticated!</div>;
    };

    it('should render "Authenticated" with preset authState.isAuthenticated as true', () => {
      initialAuthState = {
        isAuthenticated: true
      };
      const mockProps = {
        ninjaAuth,
        restoreOriginalUri
      };
      const wrapper = mount(
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      );
      expect(wrapper.find(MyComponent).html()).toBe('<div>Authenticated!</div>');
    });

    it('should render "Not authenticated" with preset authState.isAuthenticated as false', () => {
      initialAuthState = {
        isAuthenticated: false
      };
      const mockProps = {
        ninjaAuth,
        restoreOriginalUri
      };
      const wrapper = mount(
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      );
      expect(wrapper.find(MyComponent).html()).toBe('<div>Not authenticated!</div>');
    });

    it('should render "loading" with preset authState is null', () => {
      initialAuthState = null;
      const mockProps = {
        ninjaAuth,
        restoreOriginalUri
      };
      const wrapper = mount(
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      );
      expect(wrapper.find(MyComponent).html()).toBe('<div>loading</div>');
    });

    it('should render error if ninjaAuth props is not provided', () => {
      const mockProps = {
        ninjaAuth: null as any,
        restoreOriginalUri
      };
      const wrapper = mount(
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      );
      expect(wrapper.find(Security).html()).toBe('<p>AuthSdkError: No ninjaAuth instance passed to Security Component.</p>');
    });

    it('should render error if restoreOriginalUri prop is not provided', () => {
      const mockProps = {
        ninjaAuth,
        restoreOriginalUri: null as any
      };
      const wrapper = mount(
        <Security {...mockProps}>
          <MyComponent />
        </Security>
      );
      expect(wrapper.find(Security).html()).toBe('<p>AuthSdkError: No restoreOriginalUri callback passed to Security Component.</p>');
    });
  });
});
