# Report on Carcinogens PDFs

## Purpose

The NTP Report on Carcinogen (RoC) uses [HAWC project](https://hawcproject.org) for literature screening. They use full-text PDFs on their projects. However, HAWC is not designed to store full-text PDFs due to ownership issues on documents. It can however link to a URL where the PDF is present.

Therefore, this application copies PDFs from a shared location on the NIEHS network to the a path on the NTP sandbox where the files can be shared via nginx. It copies the files in a path, and then creates an Excel file which links the filename with the access URL for that file.

**Source**: [https://gitlab.niehs.nih.gov/ods/roc_pdfs](https://gitlab.niehs.nih.gov/ods/roc_pdfs)

## Application details

- Staging: ✔
- Production: ✘

**Note:** This app will only be deployed in the staging environment which is behind the NIEHS firewall; it shouldn't be deployed on the production (public) NTP sandbox, since we don't want the PDFs to be publicly available.

There is no application; this is a set of python scripts which moves PDFs from a specified shared-drive location to a directory which is served via nginx.

To run the scripts, a user will need access to the shared drive:

    smb://ntp-nas.niehs.nih.gov/RoC-ILS

The user will also need access to the sandbox-staging server, as well as the ability to run the docker-compose scripts on the server required for accessing the docker containers:

    ehshpclp119
