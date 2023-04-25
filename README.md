# Expansion to Nik Lever's Pathfinding example

### Background
Team members: Adrian Geoffroy and Sneha Kafle

This project builds on the already-existing complex pathfinding project from Nik Lever, which can be found here: https://github.com/NikLever/ThreeJS-PathFinding-Examples

#### Some things we added include: 
    1. Spotlights for player detection
    2. First person camera
    3. Collision control
    4. User interaction and gamification

### How to run the project: 

First, clone the repository: 
```
git clone https://github.com/snehakafle113/CS485-PathPlanning.git
```

Then, run the following scripts:
```
npm install
npm run dev
```

After this, the app will open in your browser. 

### Simple game mechanics: 
    1. Left click to move the character to a specified point
    2. Switch cameras by clicking on the "switch camera" button on the top-right toolbar
    3. Add more ghouls by specifying the amount you want to add on the top-right toolbar (default = 3)
    4. Right click to add crates as obstacles