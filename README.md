# dip-chrome-assist
A Chrome extension for improving the vftf Diplomacy experience

See Issues for planned improvements.

## Dev Environment

1) Download Node https://nodejs.org/en/
2) `npm install --global yarn`
3) `yarn`
4) `yarn dev`
5) Navigate to chrome://extensions/
6) Click `Load unpacked` -> open `dist`

To produce files for distribution:  yarn webpack --mode=production --progress --hide-modules