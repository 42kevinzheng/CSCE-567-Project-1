#!/bin/bash

if [ "$#" -ne 1 ]; then
	echo "Illegal Number Of Arguments please use -start/stop"
	exit
fi

if [ $1 = "-start" ]; then
	python3 -m http.server 8000 &
elif [ $1 = "-stop" ]; then
	PID=`ps -eaf | grep 'python3 -m http.server 8000' | grep -v grep | awk '{print  $2}'`
	kill -9 $PID
	echo "killing the server"
else 
	echo 'invalid flag, please use -start/stop'
fi