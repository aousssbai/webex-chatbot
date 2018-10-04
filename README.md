# webex-chatbot

## Overview

There are multiple parts that need to be run concurrently in this system:

1) an AWS instance
2) a [load generator](client/venv/connection.py)
3) a [pipe script](client/venv/pipe.py) that will connect via ssh to the VM
4) a [monitoring script](client/venv/sniffer.py) that will be run through the ssh tunnel on the VM
5) the [API](API/api.py) that will receive the alerts from the monitoring script and transfer them to webex teams
6) the [bot script](wam_spark_bot/bot.js) that defines its conversational logic


## AWS VM
Firstly, you need to connect to the aws instance unsing these credentials: 
`will put them ont he cisco repo`


When you are connected, navigate to the EC2 dashboard and turn the instance on. 


![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/start:stopvm.png)




You will then have access to the public IPV4 address of the VM. (this IP address is re-generated everytime the instance is turned off)


![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/publicIP.png)



Now that the instance is up and running, you can input the VM IP address in the [load generator](client/venv/connection.py) and in the [pipe script](client/venv/pipe.py) as follows: 

![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/vmIPconn.png)

![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/vmIPpipe.png)

IMPORTANT NOTE: the VM is running with a free Tier account which allows 750 hours of run time. Configuring the VM being a very long process (installing python, lots of libraries...), please remember to stop the VM when you are not using it anymore to make sure the account doesnt get shut down by amazon before the important demos 


## API


The next component that we need to deal with is the API. It is built with Flask and by default running on localhost on port 5000. To allow the monitoring script to make API calls and send alerts, we need to expose this port. So we use a temporary [Ngrok](https://ngrok.com/download) link (expires every 7hrs).





![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/ngrok.png)




This link needs to be input in the [monitoring script](client/venv/sniffer.py)



![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/sniffLink.png)



NB: In the [API](API/api.py) is specified, for each threshold, the bearer token (which specifies the webex sender) and the roomID (which specifies the destination of the message). So if you want to test the system on your webex teams, you can get those tokens with the webex API directly. 


## Bot
At this point, the system will monitor the traffic from the VM and send alert messages in the rooms specified in the API. However, the bot logic is not connected yet. To do so, once again, we will use an Ngrok link on port 4001. This will expose the localhost port on which the bot script is running. However this time, we need to enter the ngrok link in the [environment file](wam_spark_bot/.env) of the bot :



![picture](https://raw.github.com/aousssbai/webex-chatbot/master/pictures/botngrok.png)




All the connections with Webexteams have been set up so no further action is required for this part. The chatbot has its own [Readme](wam_spark_bot/readme.md) if you want more insight into how the NLP works and its implementation in the [bot script](wam_spark_bot/bot.js)


## Dependencies


Before running the project, make sure you have the following python libraries/dependencies installed: 

1) [Flask](http://flask.pocoo.org/docs/1.0/installation/) on which runs the API
2) [scapy](https://scapy.readthedocs.io/en/latest/installation.html#installing-scapy-v2-x), which is used to generate the load

if you encounter any error due to a missing library, a simple `pip install <name of the missing library>` should solve the issue

## Running the project

Once all this is done, you need to run those 4 programs concurrently: 



`pyhton api.py` to run the API

`python pipe.py` to create the pipe between your local machine and the VM, and run the monitoring script remotely

`python connection.py` to trigger the load generator

`node bot.js` to connect the bot logic to the webex teams bot

And this is it !






