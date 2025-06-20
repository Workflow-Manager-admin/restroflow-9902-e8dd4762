#!/bin/bash
cd /home/kavia/workspace/code-generation/restroflow-9902-e8dd4762/restroflow_backend
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

