# USWDS install for DNT-Seazit, DNT-DIVER, Sandbox. 

# United States Web Design System

[![CircleCI Build Status](https://img.shields.io/circleci/build/gh/uswds/uswds/develop?style=for-the-badge&logo=circleci)](https://circleci.com/gh/uswds/uswds/tree/develop) ![Snyk vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@uswds/uswds?style=for-the-badge) [![npm Version](https://img.shields.io/npm/v/@uswds/uswds?style=for-the-badge)](https://www.npmjs.com/package/uswds) [![npm Downloads](https://img.shields.io/npm/dt/@uswds/uswds?style=for-the-badge)](https://www.npmjs.com/package/uswds) [![GitHub issues](https://img.shields.io/github/issues/uswds/uswds?style=for-the-badge&logo=github)](https://github.com/uswds/uswds/issues) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4?style=for-the-badge)](https://github.com/prettier/prettier)

The [United States Web Design System](https://designsystem.digital.gov) includes a library of open source UI components and a visual style guide for U.S. federal government websites.

This repository is for the design system code itself. We maintain [another repository for the documentation and website](https://github.com/uswds/uswds-site). To see the design system and its documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).


### Install using Node and npm
npm is a package manager for Node-based projects. USWDS maintains the [`@uswds/uswds` package](https://www.npmjs.com/package/uswds) that includes both the pre-compiled and compiled files. npm packages make it easy to update and install the design system from the command line.

1. Install `Node/npm`. Below is a link to find the install method that coincides with your operating system:

   - Node v12.13.2 (current LTS), [Installation guides](https://nodejs.org/en/download/)

   **Note for Windows users:** If you are using Windows and are unfamiliar with Node or npm, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information.

2. Make sure you have installed it correctly:

   ```shell
   npm -v
   6.13.0 # This line may vary depending on what version of Node you've installed.
   ```

3. Create a `package.json` file. You can do this manually, but an easier method is to use the `npm init` command. This command will prompt you with a few questions to create your `package.json` file.

4. Add `@uswds/uswds` to your project’s `package.json`:

   ```shell
   npm install --save @uswds/uswds@latest
   ```

The `@uswds/uswds` module is now installed as a dependency. You can use the compiled files found in the `node_modules/@uswds/uswds/dist/` directory or the source files in the `node_modules/@uswds/uswds/packages/` directory.

**Note:** We do _not_ recommend directly editing the design system files in `node_modules`. One of the benefits of using a package manager is its ease of upgrade and installation. If you make customizations to the files in the package, any upgrade or re-installation will wipe them out.
