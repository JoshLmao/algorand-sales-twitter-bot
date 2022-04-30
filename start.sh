#!/bin/bash
echo "Building Typescript..."
tsc
echo "Typescript completed compilation!"
echo "Starting Twitter Bot..."
node /root/twitter-bot/build/monitor.js