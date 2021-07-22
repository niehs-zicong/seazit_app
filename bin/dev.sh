#!/bin/bash

# Shell tmux script to start application

# use local development environment if it exists
if [ -f ./bin/dev.local.sh ]; then
   source ./bin/dev.local.sh
   exit
fi

# create the session to be used
tmux new-session -d -s seazit_app

# split the windows
tmux split-window -h
tmux split-window -v
tmux select-pane -t 2
tmux split-window -h

# run commands
tmux send-keys -t 0 "conda activate seazit && cd ~/NTPapps/seazit_app/project" enter
tmux send-keys -t 1 "conda activate seazit && cd ~/NTPapps/seazit_app/project && npm start" enter
tmux send-keys -t 2 "conda activate seazit && cd ~/NTPapps/seazit_app/project && python manage.py runserver 8001" enter
tmux send-keys -t 3 "conda activate seazit && cd ~/NTPapps/seazit_app/project && python manage.py shell_plus --ipython" enter

# attach to shell
tmux select-pane -t 0
tmux attach-session
