echo "[`date +%Y/%m/%d_%H:%M:%S`]" >> ./log/log.out
nohup node ./server.js >> ./log/log.out &

