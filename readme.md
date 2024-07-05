# XO challenge (tic-tac-toe)
## how to play
this is a strictly multiplayer game. you need either to devices or two browser windows. one of them has to create a new game and send the room id with the other. joining is done through the join button and the game follows standard tic-tac-toe rules.
## start up
### the backend:
i use bun for development and deployment. i have setup a few scripts to help with that but you must install the dependencies first
```bash
bun i
```
development: this will hot-reload on file changes
```bash
bun dev
```
deployment:
```bash
bun start
```
### the frontend:
the frontend only uses html and css with vanilla javascript. you can view it using python, javascript, live server...
example:
```bash
python -m http.server
```
for deployment you must go in to the file and change the fetch links from localhost to your ip address i think.

if you don't want to go through all that trouble, there is a 50% chance that the server is still up on [here](http://147.182.250.104:8000/game/).
