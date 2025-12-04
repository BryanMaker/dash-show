# Dash Show

A very simple gnome shell extension that simply moves the dash from 
the overview layer to the background layer, and moves the dash back 
from the background layer to the overview layer when the overview is opened.

## Simple

The advantage of the background layer is that it won't obscure any 
application windows, so there's no need to write complex code to 
automatically hide the dash when a window obscures it. Since there's 
no mouse, and there's no way to wake up a hidden dock on a touchscreen, 
the only way to wake up a hidden dock is to move the window away.
it's perfectly fine to just put the dash in the background.

## Known problem

1.Unable to move the dash back to overview at the start of the showing of 
overview. It will only move back when overview has been shown by using signal 
"shown" of Main.overview. There is no "showing" signal in GNOME version 49.

2.If the dash's width exceeds the screen height, switching to portrait mode 
will cause the dash's position and size to be incorrect; reopening the 
overview will automatically restore it.

## Warning

This extension has only been tested and passed in the latest GNOME 49.

## Note

1.I need to test and find out how the dash automatically adjusts its 
size when its width exceeds the screen height.

2.I don't have time to maintain it, but anyone is welcome to fork it 
to get the code or publish it to the GNOME extension store.
