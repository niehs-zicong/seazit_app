conda env create -f env_seazit.yml
conda activate seazit
brew install freetype
update: cd /opt/anaconda3/envs/seazit/lib/python3.8/site-packages/selectable/base.py
(use nano or something edit base.py file)

from django.core.urlresolvers import reverse, NoReverseMatch
from django.urls import reverse, NoReverseMatch

aftre install cp cert to nginx:
docker cp certificate_key.pem seazit_app_nginx_1:etc/nginx/ssl
For test vm: 
docker cp /ddfrom django.core.urlresolversn/gs1/home/noltesz/nginxcert/certificate_key.pem seazit_app_nginx_1:etc/nginx/ssl

--
/opt/conda/envs/seazit/bin/gunicorn main.wsgi --workers 8 --bind 0.0.0.0:5000 --chdir /app/project
--


$$$$$$$$$#
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 4 taps (homebrew/core, homebrew/cask, homebrew/services and mongodb/brew).
==> New Formulae
code-minimap     gpg-tui          matterbridge     principalmapper  pywhat           simde            storj-uplink
==> Updated Formulae
Updated 282 formulae.
==> Deleted Formulae
mongodb/brew/mongodb-community@4.4
==> New Casks
blobsaver                                                   microsoft-openjdk
==> Updated Casks
Updated 218 casks.
==> Deleted Casks
appstudio                     filedrop                      itrash                        resxtreme
auristor-client               hex                           netbeans-php                  rss
cricut-design-space           iograph                       opera-mail                    wraparound

Warning: freetype 2.10.4 is already installed and up-to-date.
To reinstall 2.10.4, run:
  brew reinstall freetype
  #########
pip install -r requirements/dev.txt

Generator expression must be parenthesized (widgets.py, line 152)
ImportError: cannot import name 'six' from 'django.utils' (/opt/anaconda3/envs/seazit_test/lib/python3.8/site-packages/django/utils/__init__.py)

#fix the problems

pip install -U Django
pip install --upgrade django-cors-headers

-------Django project structure------
python manage.py graph_models -a -g -o test.png

#matplotlib RuntimeError: Python is not installed as a framework.
Add a line:
  backend: TkAgg
in file:
~/.matplotlib/matplotlibrc



Csnap0910Csnap0910

For local development command:
conda activate seazit  &&  python manage.py runserver
conda activate seazit  && npm start

