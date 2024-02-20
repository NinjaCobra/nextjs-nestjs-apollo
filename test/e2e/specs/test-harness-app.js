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

import {
  AppPage,
  ProtectedPage,
  SessionTokenSignInPage,
  LoginCallbackPage
} from '../page-objects/test-harness-app';
import ninjaSignInPageV1 from '../page-objects/ninja-signin-page';
import ninjaSignInPageOIE from '../page-objects/ninja-oie-signin-page';

let ninjaSignInPage = ninjaSignInPageV1;
if (process.env.ORG_OIE_ENABLED) {
  ninjaSignInPage = ninjaSignInPageOIE;
}

const { USERNAME, PASSWORD } = process.env;


describe('React + ninja App', () => {
  describe('implicit flow', () => {

    it('should redirect to ninja for login when trying to access a protected page (implicit)', async () => {
      await ProtectedPage.open('?state=bar#baz');
  
      await ninjaSignInPage.waitForPageLoad();
      await ninjaSignInPage.login(USERNAME, PASSWORD);
  
      await ProtectedPage.waitForPageLoad('?state=bar#baz');
      expect(await ProtectedPage.logoutButton.isExisting()).toBeTruthy();
  
      await ProtectedPage.userInfo.waitForDisplayed();
      const userInfo = await ProtectedPage.userInfo.getText();
      expect(userInfo).toContain('email');

      await ProtectedPage.logoutButton.click();
      await AppPage.waitForLogout();
    });
  
    it('should redirect to ninja for login (implicit)', async () => {
      await AppPage.open();
  
      await AppPage.waitForPageLoad();
  
      expect(await AppPage.loginFlow.getText()).toBe('implicit');
      await AppPage.loginButton.click();
  
      await ninjaSignInPage.waitForPageLoad();
      await ninjaSignInPage.login(USERNAME, PASSWORD);
  
      await AppPage.waitForPageLoad();
      expect(await AppPage.logoutButton.isExisting()).toBeTruthy();
  
      await AppPage.logoutButton.click();
      await AppPage.waitForLogout();
    });


  });

  describe('PKCE flow', () => {

    it('should redirect to ninja for login when trying to access a protected page (pkce)', async () => {
      await ProtectedPage.open('?pkce=1&state=bar#baz');
  
      await ninjaSignInPage.waitForPageLoad();
      await ninjaSignInPage.login(USERNAME, PASSWORD);
  
      await LoginCallbackPage.waitForPageLoad();
      await ProtectedPage.waitForPageLoad('?pkce=1&state=bar#baz');
      expect(await ProtectedPage.logoutButton.isExisting()).toBeTruthy();
  
      await ProtectedPage.userInfo.waitForDisplayed();
      const userInfo = await ProtectedPage.userInfo.getText();
      expect(userInfo).toContain('email');

      await ProtectedPage.logoutButton.click();
      await AppPage.waitForLogout();
    });
  
    it('should redirect to ninja for login (pkce)', async () => {
      await AppPage.open('/?pkce=1');
  
      await AppPage.waitForPageLoad();
      expect(await AppPage.loginFlow.getText()).toBe('PKCE');
      await AppPage.loginButton.click();
  
      await ninjaSignInPage.waitForPageLoad();
      await ninjaSignInPage.login(USERNAME, PASSWORD);
  
      await LoginCallbackPage.waitForPageLoad();
      await AppPage.waitForPageLoad();
      expect(await AppPage.logoutButton.isExisting()).toBeTruthy();
  
      // Logout
      await AppPage.logoutButton.click();
      await AppPage.waitForLogout();
    });
  });

  describe('React18 StrictMode double render', () => {
    it('should only call handleLoginRedirect() once on render', async () => {
      await AppPage.open('/?pkce=1');
  
      await AppPage.waitForPageLoad();
      expect(await AppPage.loginFlow.getText()).toBe('PKCE');
      await AppPage.loginButton.click();
  
      await ninjaSignInPage.waitForPageLoad();
      await ninjaSignInPage.login(USERNAME, PASSWORD);
      
      // ninja-635977: Expect that the loading element in LoginCallback gets rendered to the page instead of the ErrorComponent
      await LoginCallbackPage.waitForPageLoad();
      expect (await LoginCallbackPage.errorElement.waitForExist({ reverse: true })).toBeTruthy();

      await AppPage.waitForPageLoad();
      expect(await AppPage.logoutButton.isExisting()).toBeTruthy();

      await AppPage.logoutButton.click();
      await AppPage.waitForLogout();
    })
  })

  describe('ninja session token flow', () => {

    it('should allow passing sessionToken to skip ninja login', async () => {
      await SessionTokenSignInPage.open();

      await SessionTokenSignInPage.waitForPageLoad();
      await SessionTokenSignInPage.login(USERNAME, PASSWORD);

      await AppPage.waitForPageLoad();
      expect(await AppPage.logoutButton.isExisting()).toBeTruthy();

      // Logout
      await AppPage.logoutButton.click();
      await AppPage.waitForLogout();
    });
  });

  describe('Router', () => {
    it('should honor the "exact" route param by not triggering the secureRoute', async () => {
      await ProtectedPage.open('/nested/');
      await ProtectedPage.waitForPageLoad('/nested');

      // Assert the navigation guard wasn't triggered due to "exact" path
      expect(await AppPage.loginButton.isExisting()).toBeTruthy();
    });
  });

});
