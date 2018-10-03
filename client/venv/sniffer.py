
from random import randint
import time
from threading import *
import os
import psutil
import requests
import json
import os
import time

#================================= we check the metrics of the instance ===================================


print("let's check the incoming byte stream")
p=0
while(True):

    sum=0
    average=0
    for i in range(0,5):

        p1 = psutil.net_io_counters(pernic=False, nowrap=True)
        stat1 = p1[1]

        time.sleep(1)

        p2 = psutil.net_io_counters(pernic=False, nowrap=True)
        stat2 = p2[1]

        final = stat2-stat1
        sum+=final
    average=sum/5
    print("average rate: "+str(average)+" bytes/s")


   # ====alert level 1=======

    if (250<=average<500):


    #I need to put the args as variables and not "magical" values (refine the monitor system)

        #in this case i just need to send a message to the chat and let the upscaling happen automatically (send a message privately to the bot

        os.system('curl http://44225179.ngrok.io/alerts -d "callerID=12345" -d "token=token" -d "reason=excessive connections" -d "level=1" -d "callerAddress=someIPPPPPPP" POST -v')





    # ====alert level 2=======

    if(500<=average<1000):

        #in this case, i need to send a message privately to the admin and let them know about the upscaling and
        os.system('curl http://44225179.ngrok.io/alerts -d "callerID=12345" -d "token=token" -d "reason=excessive connections" -d "level=2" -d "callerAddress=someIPPPPPPP" POST -v')


    # ====alert level 3=======

    if(1000<average):
        print("level3")
        #in this case, ask for admin permission
        
        os.system('curl http://44225179.ngrok.io/alerts -d "callerID=12345" -d "token=token" -d "reason=excessive connections" -d "level=3" -d "callerAddress=someIPPPPPPP" POST -v')

        time.sleep(20000)







