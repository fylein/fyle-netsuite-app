# Fyle NetSuite APP
Angular 8 client for Fyle NetSuite Integration

### Setup

* Setup environment variables in src/environments/environment.ts

    ```javascript
    export const environment = {
        production: false,
        fyle_url: '{{FYLE_URL}}',
        fyle_client_id: '{{FYLE_CLIENT_ID}}',
        callback_uri: '{{CALLBACK_URI}}',
        api_url: '{{API_URL}}',
        app_url: '{{APP_URL}}'
    }
   ``` 

* Install the requirements

    ```
    npm install
    ```

* Run the Development server

    Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

* Code scaffolding

    Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

