# webex-chatbot

There are multiple parts that need to be run concurrently in this system:

1) an AWS instance
2) a load generator
3) a pipe script that will connect via ssh to the VM
4) a monitoring script that will be run through the ssh tunnel on the VM
5) the API that will receive the alerts from the monitoring script and transfer them to webex teams
6) the bot script that defines its conversational logic

Firstly, you need to connect to the aws instance unsing these credentials: 
```
username: aouss.sbai.15@ucl.ac.uk 
password: Karlcfkh97*
```


When you are connected, you need to turn the instance on. You will then have access to the public IPV4 address of the VM. 
(this IP address is re-generated everytime the instance is turned off)

Now that the instance is up and running, you can input the VM IP address in the [load generator](client/venv/connection.py) and in the [pipe script](client/venv/pipe.py)

The next component that we need to deal with is the API. It is built with Flask and by default running on localhost on port 5000. To allow the monitoring script to make API calls and send alerts, we need to expose this port. So we use a temporary [Ngrok](https://ngrok.com/download) link (expires every 7hrs). This link needs to be input in the [monitoring script](client/venv/sniffer.py).

NB: In the [API](API webex teams /api.py) is specified, for each threshold, the bearer token (which specifies the webex sender) and the roomID (which specifies the destination of the message). So if you want to test the system on your webex teams, you can get those tokens with the webex API directly. 

At this point, the system will monitor the traffic from the VM and send alert messages in the rooms specified in the API. However, the bot logic is not connected yet. To do so, once again, we will use an Ngrok link on port 4001. This will expose the localhost port on which the bot script is running. All the connections with Webexteams have been set up so no further action is required for this part. 









