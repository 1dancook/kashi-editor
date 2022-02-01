#!/usr/bin/env python3

import webview

class API:
    def __init__(self):
        pass


if __name__ == '__main__':

    title = "歌詞エディター"
    js_api = API()

    window = webview.create_window(
            title,
            url="assets/kashiedit-html.html",
            width=1200,
            height=780,
            min_size=(800,600),
            )

    webview.start(
            debug=True, 
            gui="cef", # cef is for windows
            ) 
