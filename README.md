# sheetgrid
A simple javascript class for gridifying iconsheets / spritesheets

A helper class fpr creating icons, sprites, etc... from sheets.  It supports both img.src, canvas and style.background-image methods for sheet cells.  It will also support canvas rendering in the near future.  

One downside is that it must run in the browser DOM, but I plan to rectify this problem and make it require-able in node environments also in the near future.  The stratefy will be to add a configuration "useDOMElements" option to return html text rather than elements.  That way DOM would only be required for ( !! useDOMElements ).

Currently supports all major browsers.

Todo
====
+ add in renderToCanvas methods
* add configuration "useDOMElements" option
