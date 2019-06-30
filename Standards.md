# Code Standards & General Explanation

## SharedModule
1. All components which could be reused over different modules are declared and imported here, and then exported for various modules.
2. Charts component is separate reusable component, which could be reused at different places using select name.

## General Specs
1. App Module is the entry point for the application.
2. Webpack Config is added for Service Worker Generation & PWA Compatibility.
3. RxJs paradigm followed to kept maximum code asynchronous using Subject & Observables.
4. For brevity purposes, added a separate variables, classes.scss. These files pull out the maximum redundant code and convert styles to classes and hex/rgba codes to readable names.
5. Private functions are at the bottom and marked starting with an `_`(underscore).
