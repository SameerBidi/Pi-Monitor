# Pi-Monitor

Simple Hardware Monitor for you Raspberry Pi or any Linux Machine

Monitor: CPU/GPU temps, usage, frequencies, memory, disk


Required libraries to run: Flask, Flask-CORS, waitress

How to use:

1. Install necessary libraries
2. Place hwdinfo.sh file in proper path and make it executable by 'chmod +x'
3. Change sh file path accordingly in monitor_server.py
4. Run monitor_server.py on Raspberry Pi / Server
5. Change Api ip and port in Handler.js
6. Run index.html
