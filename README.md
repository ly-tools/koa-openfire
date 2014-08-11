koa-openfire
===
A middleware to build web IM with Openfire

Usage
---
First, you should have startup an Openfire server. You can download Openfire from [Ignite Realtime](http://www.igniterealtime.org/projects/openfire/) or [Github](https://github.com/igniterealtime/Openfire). If you startup it at `192.168.0.123`, you can set koa-openfire like this. Then your application can send xmpp xml message to `http://localhost/JHB/`

```javascript
var koa = require('koa');
var serve = require('koa-static');
var openfire = require('koa-openfire');
var app = koa();

app.use(openfire({
	host: '192.168.0.123',
	port: 7070,
	path: '/http-bind/',
	method: 'POST',
	listen: '/JHB/'
}));

app.use(serve('.'));
app.listen(3000);
```

Options
---
###host
default: `127.0.0.1`

The host of your Openfire server.

###port
default: `7070`

The port of your Openfire bosh server. If you have startuped an Openfire, you can go `[openfire's host]:9090` to check which port the bosh server is using.

###path
default: `http-bind`

The path of your Openfire bosh server.

###method
default: `post`

The http method to send message to your Openfire bosh server.

###listen
default: `/JHB/`

The path which need to be deal with. If your set it like `/xmpp/`, then your web application should send all XMPP messages to `/xmpp/`. Otherwise, this middleware will ignore those messages.

License
---
MIT