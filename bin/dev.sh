#!/bin/bash

SESSION="seazit_app"
CONDA_PATH="$HOME/opt/anaconda3/etc/profile.d/conda.sh"
CONDA_ENV="seazit"
PROJECT_DIR="project"

# Avoid duplicate session
if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "⚠️  Tmux session '$SESSION' already exists. Attaching..."
  tmux attach -t "$SESSION"
  exit
fi

# Start session with one window
tmux new-session -d -s "$SESSION" -n main

# Split right vertically (left 70%, right 30%)
tmux split-window -h -p 30 -t "$SESSION"

# Split the right pane (now pane 1) horizontally (top/bottom 50%)
tmux split-window -v -t "$SESSION:0.1"

# Send commands to each pane
tmux send-keys -t "$SESSION:0.0" "source $CONDA_PATH && conda activate $CONDA_ENV && cd $PROJECT_DIR && python manage.py runserver" C-m
tmux send-keys -t "$SESSION:0.1" "source $CONDA_PATH && conda activate $CONDA_ENV && cd $PROJECT_DIR && npm start" C-m
tmux send-keys -t "$SESSION:0.2" "source $CONDA_PATH && conda activate sandbox && cd ~/dev/sandbox/project" C-m

# Focus back to main pane (left)
tmux select-pane -t "$SESSION:0.0"
tmux attach-session -t "$SESSION"
