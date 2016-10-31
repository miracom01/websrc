#echo "[`date +%Y/%m/%d_%H:%M:%S`]" >> ./log/log.out
#nohup node ./server.js >> ./log/log.out &

PROC_NAME="server.js"
PID=`ps -ef | grep "${PROC_NAME}" | grep -v "grep" | cut -d" " -f4`

if [ ${PID} ];then
  echo "[`date +%Y/%m/%d_%H:%M:%S`] Server still alive::::::PID : ${PID}"
else
 # echo "${PROC_NAME} KILL PID : ${PID}"
 # kill ${PID}
  nohup node /home/ubuntu/group_2/${PROC_NAME} &
  echo "[`date +%Y/%m/%d_%H:%M:%S`] restart Server!"
fi
