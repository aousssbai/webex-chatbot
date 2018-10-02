# webex-chatbot

There are multiple parts that need to be run concurrently in this system:

1) an AWS instance
2) a load generator
3) a pipe script that will connect via ssh to the VM
4) a monitoring script that will be run through the ssh tunnel on the VM
5) the API that will receive the alerts from the monitoring script and transfer them to webex teams
6) the bot script that defines its conversational logic

Firstly, you need to connect to the aws instance unsing these credentials: 

username: aouss.sbai.15@ucl.ac.uk
password: Karlcfkh97*

When you are connected, you need to turn the instance on. You will then have access to the public IPV4 address of the VM. 
(this IP address is re-generated everytime the instance is turned off)

Now that the instance is up and running, you can input the VM IP address in the load generator (client/venv/connection.py) and in the pipe script (client/venv/pipe.py)

from now, 



