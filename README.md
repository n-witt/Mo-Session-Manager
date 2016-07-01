![](https://raw.githubusercontent.com/n-witt/screencasts/master/mo-demo.gif)

# Mo - Session Manager
If you have >10 open tabs in your browser for "later examination" and you are using several different machines across the day, this is for you.

Mo is a chrome extension (and hopefully also a Firefox extension, sometime in the near future) that allows you to store a browser session (i.e. the urls of all open tabs in your browser) onto a server and restore it wherever you want. The server part is also provided, which allows you to run it in your preferred environment on your own machine.

## Installation

### Server
* Download and install [Anaconda](https://www.continuum.io/downloads). Although this step is optional, I highly recommend using Anaconda. The rest of this guide will assumes you are using Anaconda. If you don't, adapt the installation process accordingly, but remember: little puppies will die if you dispise Anaconda!
* Create and activate a new environment:
```
$ conda create -n mo python=3.5
$ . activate mo
```
Replace 'mo' with your favorite name. It's important to note here, that this is a Python project, not a Python2.x project! You'll need Python 3.5+.
* Clone the Repository
* Find `config.py` in the `server` directory and adapt it to your needs. It is a gunicorn config file. So if you have trouble, google for `gunicorn config file <problem description>`.
* In order to start the server daemon, find `./start.sh` in the `server` directory and start it.
### Options
* If you want to start the server in the foreground, remove the `-D` flag in `start.sh`
* In case you need to increase the performance of the server, use a Nginx reverse proxy in front of gunicorn. [Here](https://www.digitalocean.com/community/tutorials/how-to-deploy-python-wsgi-apps-using-gunicorn-http-server-behind-nginx) you can find a guide.
* If you want the daemon to start after the system has booted, follow [this](http://docs.gunicorn.org/en/latest/deploy.html) guide (find the __Monitoring__ section in the middle of the page).

### Chrome Extension
Since the software is in an early state, it's not available via Chrome Web Store, yet. Hence, you need to install it manually. [Here](http://superuser.com/a/252990), you can find a decent guide on how to install Chrome extensions manually. Navigate to the location where you have cloned this repo to and select the `chrome_extension` folder.

## Configuring the Chrome Extension
After clicking the "Settings" button, you are presented two input fields. The first field should be filled with __Some unique ID__ (see Security section). The ID identifies the place where your sessions are stored. If you change it, your session will be stored under the new name. But the session stored using the old name will not disappear. In fact, if you switch back to the old name you can recover the old session.

## Security
Let's face it: __there is no security here__. You have to consider your data as being public, if you are using this software. The security issue is so complex, that I've decided to ignore it for the moment. This means, there are some implications you should be aware of:
* If someone takes possession of the unique ID you are using, she can read your latest session and overwrite it. This can also happen by accident. So chose a sufficiently random ID.
* HTTP is used to store and retrieve your data. If someone wiretaps you, she can easily intercept and manipulate your communication.
* URLs may contain personal data. If you want to keep them private, don't store them using Mo.
* You don't have to sign-up. Just use Mo!

## Raw Access
You can access the server's API directly by using the following URL:

`http://<server name>:<port>/pop?u_id=<some id>`

where `<some id>` is the ID you used to store you session. The other variables are self-explanatory.

## To Do
* Error logging in the server
* Versioning
* Firefox extension
* Security

## Name
Mo is the symbol for the chemical element Molybdenum. The element with the atom number 42.

## License
This software and all it's components are distributed under der GNU General Public License v3.0.
