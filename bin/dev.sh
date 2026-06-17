#!/bin/bash

# Shell tmux script to start application

# use local development environment if it exists
if [ -f ./bin/dev.local.sh ]; then
   source ./bin/dev.local.sh
   exit
fi

# create the session to be used
tmux new-session -d -s seazit_app

# split the windows (horizontal split, then split the right pane vertically)
tmux split-window -h
tmux select-pane -t 1
tmux split-window -v

# run commands
tmux send-keys -t 0 "conda activate seazit" enter
tmux send-keys -t 1 "conda activate seazit && cd project && npm start" enter
tmux send-keys -t 2 "conda activate seazit && cd project && python manage.py runserver " enter

# attach to shell
tmux select-pane -t 0
tmux attach-session