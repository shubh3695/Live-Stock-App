# StocksApp
View this app live at http://stock-o-pedia.herokuapp.com/.
## Running Application
Simply do an `npm install`, your project will be setup post install. Then to run, do `npm start` to run the application.

## Features
1. Live Stock information 
2. View Live graph as changes are pushed onto the chart
2. Reconnect to network feature, if failed
3. Service Worker for offline project structure support
4. PWA Compatible(for supported browser versions eg Chrome 70+) (https only)
5. Technically, minified code using Terser + treeshaked ES2015 module

## Stack Used
1. Angular 8
2. RxJs
3. Plain HTML5/SCSS
4. Webpack
5. Workbox Webpack Plugin for Service Worker Generation

## Improvement Scope
1. Stack multiple stock into a single chart
2. Offline caching of pre-existing stock data for offline view via IndexedDB
3. Performance: 
    1. Serve gzipped or brotli compressed files over the network
    2. Chunk Js files categorically and multiplex requests over to the browser [H2]