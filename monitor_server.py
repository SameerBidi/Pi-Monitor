import flask
import subprocess
import re
import json
from flask import Response
from flask_cors import CORS
from waitress import serve

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)


@app.route('/getHwdInfo', methods=['GET'])
def getHwdInfo():
  model = subprocess.run(['cat', '/sys/firmware/devicetree/base/model'], stdout=subprocess.PIPE).stdout.decode('utf-8')
  date = subprocess.run(['date', '+%d %b %Y - %I:%M:%S %p'], stdout=subprocess.PIPE).stdout.decode('utf-8')

  response = {
    'MODEL' : re.sub(r'[^a-zA-Z0-9:_. ]+', '', model),
    'DATE' : re.sub(r'[^a-zA-Z0-9:\-_. ]+', '', date)
  }

  result = subprocess.run(['/home/sam/hwdinfo.sh'], stdout=subprocess.PIPE)
  parsed_result = re.sub(r'[^0-9:_.]+', '', str(result.stdout)) \
                  .replace('111394911', '') \
                  .replace('1113949', '') \
                  .split(':')
  
  count = int(parsed_result[0])

  response['CPU COUNT'] = count

  cpus = []
  for i in range(count):
    data = parsed_result[i + 1].split('_')
    cpus.append({'NAME' : 'CPU' + str(i), 'FREQ' : float(data[0]) / 1000.0, 'USAGE' : float(data[1])})

  response['CPUS'] = cpus
  response['CPU TEMP'] = float(parsed_result[count + 1])
  response['GPU TEMP'] = float(parsed_result[count + 2])
  response['MEMORY'] = float(parsed_result[count + 3])
  response['DISK'] = float(parsed_result[count + 4])

  return Response(json.dumps(response), mimetype='application/json')

serve(app, host="0.0.0.0", port=9999)