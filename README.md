# vRealize Automation Reference Application

## Overview
This is a sample project that demonstrates how to create a simple self-service portal for vRealize Automation using only RESTful APIs. You are encouraged to view the source code to see how the use cases are accomplished and to adapt this application for your own needs.

## vRealize Automation Compatibility
This reference application works with vRealize Automation 7.0.1 or later.

## Installation
Get the code from [https://github.com/vmware/vra-ref-app](https://github.com/vmware/vra-ref-app). You can host this application on any HTTP server, such as Apache HTTP Server, Apache Tomcat, or Nginx.

For a lightweight deployment, you can use Node.js http-server to host this application (requires Node.js).
See:
- [Node.js](https://nodejs.org)
- [http-server](https://www.npmjs.com/package/http-server)

1. Download and install node.js and npm from the [Node.js website](https://nodejs.org).
2. From a terminal window or command prompt, install http-server globally (you might need to use `$ sudo` if you are using Linux or OSX)
`$ npm install http-server -g`
3. Change to the vRealize Automation Reference Application directory.
4. Issue the following command:
`$ http-server`

You are now hosting your vRealize Automation Reference Application on port 8080 on your machine. You can use the `-p` option to change the default port.

## Getting Started
### Client side
You need to configure the application to point to your vRealize Automation instance in the `conf/conf.js` file.

For example, if your vRealize Automation server has the domain name `vra.com`, add the domain to the conf object as follows:
```
var conf = {
  vraDomain: 'vra.com'
};
```

### Server side
#### SSL certificate
This application uses Ajax to send background HTTP requests to the vRealize Automation server. If you are using a self-signed certificate, instead of displaying an unsecure connection warning in the browser window with the option to accept the certificate, the application reports a network error in the console or browser network monitor.

To trust the certificate, browse to the vRealize Automation portal and accept the certificate using the browser or export the certificate and install it locally.

#### CORS
In order to support [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (Cross Origin Resource Sharing), you need to add the `Accept-Control-Allow-Origin` header in the response from your vRealize Automation server. This is only required if the reference application is hosted on a different domain from the vRealize Automation server.

To accomplish this, we create a custom error response file and redirect preflight requests so that the server returns this error file. In the following example, the vRealize Automation domain name is `vra.com`, and the vRealize Automation Reference Application is hosted on `http://vra-ra.com`.

##### Create a custom error file
1. Log in to the vRealize Automation server.
`$ ssh root@vra.com`
2. Change  to the HAProxy configuration directory.
`$ cd /etc/haproxy/`
3. Create a custom 503 error file. In this example the error file is named `preflight.http` and it is created in a new directory called `cors`. You can use any name you like for the HTTP file and directory.
`$ mkdir cors && vi cors/preflight.http`

The contents of the `preflight.http` file should be similar to the following:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin:THE_ORIGIN_YOU_WANT_TO_ALLOW
Access-Control-Allow-Headers:Origin,Content-Type,Accept,X-Requested-With,Authorization
Access-Control-Allow-Methods:POST,GET,PUT,DELETE,HEAD,OPTIONS
Access-Control-Allow-Credentials:true
Access-Control-Max-Age: 31536000
Content-Length: 0
Cache-Control: private

```
Replace `THE_ORIGIN_YOU_WANT_TO_ALLOW` with the URL of the reference application, for example, `http://vra-ra.com`.

**NOTE:** It is important to leave an empty line at the end of the file. It must be a real empty line (only a line break) with no characters including white space. The empty line signifies the the end of the response headers, otherwise the headers will be truncated.

##### Redirect preflight requests
1. On the vRealize Automation server, edit the server configuration file.
`$ vi conf.d/20-vcac.cfg`
2. Make the following additions to the configuration file:
```
frontend https-in
    ...
    use_backend cors_preflight if METH_OPTIONS
    ...

backend cors_preflight
    errorfile 503 /etc/haproxy/cors/preflight.http

backend backend-vra
    ...
    rspadd Access-Control-Allow-Origin:THE_ORIGIN_YOU_WANT_TO_ALLOW
    ...
```

Replace `THE_ORIGIN_YOU_WANT_TO_ALLOW` with the URL of the reference application, for example, `http://vra-ra.com`.

##### Restart the proxy service
1. On the vRealize Automation server, issue the following command:
`$ service haproxy restart`

## References
- [Same Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [Cross Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
- [HAProxy Configuration Manual](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html)

## License
Copyright © 2016 VMware, Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
Some files may be comprised of various open source software components, each of which has its own license that is located in the source code of the respective component.
