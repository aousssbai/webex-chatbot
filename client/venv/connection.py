from scapy.all import *
import time


start_time = time.time()

#in this command, the "inter" parameter defines the time interval between each packet being sent. for level 1, the value is 0.1, for level 2 its is 0.01, and 0.001 for level 3

send(IP(dst="18.191.194.44")/ICMP()/"from scapy packet", count=10000, inter=0.001)

print (time.time() - start_time, "seconds")
