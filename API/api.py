from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import requests
import json
import time

app = Flask(__name__)
api = Api(app)

ALERTS = {
    'alert1': {

               'callerID': '12345',
               'token':'token',
               'reason':'cpu %',
               'level':'yellow',
               'callerAddress':'someIP',

               },

}


def abort_if_alert_doesnt_exist(alert_id):
    if alert_id not in ALERTS:
        abort(404, message="Alert {} doesn't exist".format(alert_id))

parser = reqparse.RequestParser()
parser.add_argument('callerID', required=True, help="callerID cannot be blank!")
parser.add_argument('token', required=True, help="token cannot be blank!")
parser.add_argument('reason', required=True, help="reason cannot be blank!")
parser.add_argument('level', required=True, help="level cannot be blank!")
parser.add_argument('callerAddress', required=True, help="callerAddress cannot be blank!")


# Alert
# shows a single alert item and lets you delete an alert item
class Alert(Resource):
    def get(self, alert_id):
        abort_if_alert_doesnt_exist(alert_id)
        return ALERTS[alert_id]

    def delete(self, alert_id):
        abort_if_alert_doesnt_exist(alert_id)
        del ALERTS[alert_id]
        return '', 204


# shows a list of all alerts, and lets you POST to add new alerts
class AlertList(Resource):
    def get(self):
        return ALERTS

    def post(self):
        args = parser.parse_args()
        alert_id = int(max(ALERTS.keys()).lstrip('alert')) + 1
        alert_id = 'alert%i' % alert_id
        ALERTS[alert_id] = {'callerID': args['callerID'], 'token': args['token'], 'reason': args['reason'], 'level': args['level'], 'callerAddress': args['callerAddress']}
        url = "https://api.ciscospark.com/v1/messages"



           #=======================================LEVEL 1============================

        if args['level'] == '1':  #in this case i just send a message to the bot

            payload = {
                        "roomId": "Y2lzY29zcGFyazovL3VzL1JPT00vMWYxMjc5NjEtYzdlZC0zYzdmLWIxMDUtY2QyNTI3NGUxNDA2",
                        "text": "alert "+ args['level']+" caused by "+args['reason']
                      }

            headers = {
                'Content-Type': "application/json",
                'Authorization': "Bearer Y2NjMDgyNzktYzBhNy00MWJjLThhMTItMWMxNzc0N2JiNDY3ZjEyYzM2NjctYjRm"

            }

            r = requests.post(url, data=json.dumps(payload), headers=headers)

            print(r.status_code, r.reason)
            time.sleep(200000)


            #======================================LEVEL 2================================

        elif args['level'] == '2': # in this case i message the bot but also notify the room about what is going on
            payload = {
                "roomId": "Y2lzY29zcGFyazovL3VzL1JPT00vMWYxMjc5NjEtYzdlZC0zYzdmLWIxMDUtY2QyNTI3NGUxNDA2",
                "text": "alert " + args['level'] + " caused by " + args['reason']
            }

            payload1 = {
                "roomId": "Y2lzY29zcGFyazovL3VzL1JPT00vYTVhYjVlYzAtYTYzMS0xMWU4LTllOGEtYzdiZjgxNGU5MGUx",
                "text": "alert " + args['level'] + " caused by " + args['reason']
            }

            headers = {
                'Content-Type': "application/json",
                'Authorization': "Bearer Y2NjMDgyNzktYzBhNy00MWJjLThhMTItMWMxNzc0N2JiNDY3ZjEyYzM2NjctYjRm"

            }

            r1 = requests.post(url, data=json.dumps(payload1), headers=headers)
            r = requests.post(url, data=json.dumps(payload), headers=headers)



            print(r.status_code, r.reason)
            time.sleep(200000)

            return("===================================================================================================================================")




            #===================================LEVEL 3===================================

        else:
            # in this case, i notify bot, room and root admin and need approval from latter to proceed
            payload = {
                "roomId": "Y2lzY29zcGFyazovL3VzL1JPT00vODA4NzI3YzgtYjM5Yi0zZWNhLWI5MGUtM2U0M2IwMTI3M2Vm",
                "text": "alert " + args['level'] + " caused by " + args['reason']
            }

            headers = {
                'Content-Type': "application/json",
                'Authorization': "Bearer YmQyMDYxNjQtOWIzZi00NzA2LTk3ODAtZDFlOWU4ZTFjNDA2NjFhNGRkMzctMGFk"

            }





            r = requests.post(url, data=json.dumps(payload), headers=headers)

            print(r.status_code, r.reason)
            time.sleep(200000)









        return("your alert has been posted successfully"), 201

##
## Actually setup the Api resource routing here
##
api.add_resource(AlertList, '/alerts')
api.add_resource(Alert, '/alerts/<alert_id>')


if __name__ == '__main__':
    app.run(debug=True)

