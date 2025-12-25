#!/bin/bash

mkdir -p mov-$1
povray +Iscene-$1.pov +Omov-$1/frame.png +FN +W640 +H512 +KFI0 +KFF359 +KI0
ffmpeg -framerate 30 -i mov-$1/frame%03d.png -c:v libx264 -pix_fmt yuv420p t$1.mp4
