from scapy.all import *

from random import randint
import time
from threading import *
import os
import requests
import http.client






start_time = time.time()

send(IP(dst="13.58.203.174")/ICMP()/"from scapy packet", count=10000, inter=0.001)

print (time.time() - start_time, "seconds")
