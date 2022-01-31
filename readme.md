# Kashi Editor

This editor is for editing lyrics for use with OpenLP projection software. It is targeted towards quickly being able to edit Japanese text.

The GUI interface is in Japanese.

## Installation

Right now no binary file is available.

### Windows

Requires python 3.8 for windows because of a dependency for pywebview.

- `pip install pywebview`
- `pip install pywebview[cef]`

I am unsure if webview2 is required.

### MacOS

- `pip install pywebview`

## Compilation

### Windows
- will use pyinstaller

### Mac
- can use py2app



## How to Use

Tags are configured to be like this:

`{rb}KANJI{rt}READING{/rt}{/rb}`

In OpenLP you must configure these formatting tags to be used. It is the same format as html but shortened for brevity. `<ruby>KANJI<rt>READING</rt></ruby>`

`Ctrl+R` will insert tags. If there is a selection it will use that for KANJI.

There is an option selection menu for inserting separators in OpenLP syntax.

`Alt+v` to insert verse and auto increment the number.

`Alt+c` to insert a chorus line.

`Alt+b` to insert a bridge separator.
