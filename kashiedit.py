#!/usr/bin/env python3

import webview

with open('blackfield.html', 'r') as f:
    html = f.read()


webview.create_window("blackfield", html=html)
webview.start()
