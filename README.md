# Dash Show

A very simple gnome shell extension that simply moves the dash from 
the overview layer to the background layer, and moves the dash back 
from the background layer to the overview layer when the overview is opened.

## Simple

1. The advantage of the background layer is that it won't obscure any 
application windows, so there's no need to write complex code to 
automatically hide the dash when a window obscures it. Since there's 
no mouse, and there's no way to wake up a hidden dock on a touchscreen, 
the only way to wake up a hidden dock is to move the window away.
it's perfectly fine to just put the dash in the background.

2. Because this extension is very simple, it is less likely to conflict with other extensions.

## Warning

This extension has only been tested and passed in the latest GNOME 49.

## Note

1. This extension will remain as simple as possible, and will not provide any extra features or keyboard shortcuts.

## Acknowledgements:

This extension references the implementation 
at https://github.com/fthx/dock-express. Thank you.
