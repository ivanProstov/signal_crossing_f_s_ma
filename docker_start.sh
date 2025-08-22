#!/bin/bash

docker stop signal_crossing_f_s_ma
docker rm signal_crossing_f_s_ma

docker build -t signal_crossing_f_s_ma_image .

docker run -d -p 3001:3000 --name signal_crossing_f_s_ma signal_crossing_f_s_ma_image