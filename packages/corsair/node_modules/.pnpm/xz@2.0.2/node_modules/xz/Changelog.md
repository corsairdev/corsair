## 2.0.1  (16 jul 2019)

- upgrade node-gyp because it had some security updates


## 2.0.0  (16 dec 2018)

- make c++ layer use `AsyncWorker` so it can use a background core
- changed lower-level API to be callback or promise based (depending on your preference)


## 1.4.0  (30 nov 2018)

- exposed a new method `process()` for people who don't want to use nodejs streams
- changed the internal API


## 1.3.0  (17 nov 2018)

- upgraded for node 10, and replaced NaN with node-addon-api


## 1.2.2  (6 may 2016)

- upgraded to NaN 2.2 [pgbross]


## 1.2.1  (26 dec 2015)

- upgraded to Babel 6.0


## 1.2.0  (20 aug 2015)

- upgraded to NaN 2.0 [pgbross]


## 1.1.1  (8 feb 2015)

- converted all the javascript code from coffee-script to ES6 (no visible external changes)


## 1.1.0  (8 feb 2015)

- switched to using NaN for the v8 bindings, which should fix it to work with io.js


## 1.0.4  (7 dec 2014)

- fixed xz build on Linux by doing hand-to-hand combat with gyp
- removed low-level support for compressing strings, since it leaks memory (use buffers)


## 1.0.3  (4 sep 2014)

- fixed "package.json" again


## 1.0.2  (4 sep 2014)

- fixed "package.json" to make a usable package (previous versions wouldn't even install correctly)


## 1.0.1  (29 jul 2014)

- removed unused dependencies
