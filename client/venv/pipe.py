import os



#================================= create ssh tunnel into AWS instance and set up the monitoring ===================================
print("========================running monitoring script through tunnel==============================")

os.system('ssh -i "sbai.pem" ec2-user@ec2-18-191-194-4.us-east-2.compute.amazonaws.com python -u - < sniffer.py')


print("======================== end of tunnel =======================================================")


