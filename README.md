# Playcanvas-UI-Components
This repository provides scripts for UI components, that can be used in forms.

This components is basically helps you to build forms on your Playcanvas script, without dealing HTML styling. You can simply drag&drop input script to an element and use it's functionality without dealing some style properties, such as font, positioning and visibility.

There are 4 different input types that can be used in script.
- Text input
- Select input
- Checkbox
- Slider

Since I use these components in my games, there are some other functions that is useful in games. Like store value option. That function simply keeps value in text element, even after page reload. I was using that functionality on settings, or guest username.

You can simply reach the input's value with getValue function in the script. If you use input element, you can use entity.script.input.getValue(); to get it. setValue function also can be used.

The scripts are very easy. You can write your own script in a short time. But I wrote these components once and thought it can be good to share with people. I always use them on my projects.

Anyway, here is the demo link :
https://playcanv.as/p/54XFJtDK/

Here is the project link :
https://playcanvas.com/project/644577/overview/uicomponents

Here is the github repository : 
https://github.com/devcem/Playcanvas-UI-Components

And here is the youtube video, in case you need assist :
https://www.youtube.com/watch?v=YYoOtq_Spio&feature=youtu.be

Video for template system : 


## Features
- storeValue : This option basically stores the input value after change. It can be useful for settings and username.
- focusEntity : It simply shows or hides an entity on playcanvas while input active.

## Changelog
- Timeline.js now can play same animation again if autoplay is enabled on state change.
- Container.js bugs fixed.