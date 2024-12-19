# NTP SEAZIT

A django web-application for the NTP. This is designed to be an area for rapid development and prototyping of new ideas; 

The public website is here(SEAZIT coming soon): https://orio.niehs.nih.gov/seazit/

The staging website is here(SEAZIT coming soon): https://ods.ntp.niehs.nih.gov/seazit

Deploy see: https://gitlab.niehs.nih.gov/ods/deploy-seazit/-/blob/master/readme.md


For local user development command:

Create a conda env named seazit:

conda activate seazit  &&  python manage.py runserver

conda activate seazit  && npm start

540  conda env remove -n SEAZIT_backup
  541  conda env create -f conda.yml
  542  conda activate SEAZIT
  543  pip install -r requirements/dev.txt
  544  conda install pygraphviz
  545  cd project/
  546  yarn install
  547  npm start
  548  history
-----