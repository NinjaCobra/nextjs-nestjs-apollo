---
to: ../samples/<%= dest %>/package.json
force: true
---
{
  "comment": "IMPORTANT: THIS FILE IS GENERATED, CHANGES SHOULD BE MADE WITHIN '@ninja/generator'",
  "name": "<%= pkgName %>",
  "private": true,
  "version": "0.3.0",
  "scripts": {
    "prestart": "STANDALONE_SAMPLE_BUILD=1 vite build",
    "start": "vite preview",
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
<% if (reactRouterDomVersion !== 'false') { -%>
    "react-router-dom": "<%= reactRouterDomVersion %>",
<% } -%>
    "@ninja/ninja-auth-js": "<%= ninjaAuthJsVersion %>",
<% if (useSiw === 'true') { -%>
    "@ninja/ninja-signin-widget": "^<%= siwVersion %>",
<% } -%>
<% if (useSemanticUi === 'true') { -%>
    "semantic-ui-css": "2.4.1",
    "semantic-ui-react": "2.0.3",
<% } -%>
<% if (usePolyfill === 'true') { -%>
    "text-encoding": "0.7.0",
<% } -%>
<% if (reachRouterVersion !== 'false') { -%>
    "@reach/router":"<%= reachRouterVersion %>",
    "@types/reach__router": "<%= reachRouterVersion %>",
<% } -%>
    "@ninja/ninja-react": "*"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^1.3.2",
    "vite": "^2.8.0",
    "dotenv": "^16.0.0"
  }
}