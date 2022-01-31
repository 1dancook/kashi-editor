function update_preview() {
  let text = document.querySelector("#editing").value;
  
  // regex for tags
  let ruby_start = /{rb}/g; //match {rb}
  let ruby_stop = /{\/rb}/g; // match {/rb}
  let reading_start = /{rt}/g; // match {rt}
  let reading_stop = /{\/rt}/g; // match {/rt}
  let separators = /\n(---\[)(.*?)(\]---\s*\n)/g; // only if new line is also there
  
  // substitutions
  let ruby_start_sub = '<ruby>';
  let ruby_stop_sub = '</ruby>';
  let reading_start_sub = '<rt>';
  let reading_stop_sub = '</rt>';
  let separator_sub = '<br><p class="separator-preview">$2</p>'

  // replacements
  text = text.replaceAll(separators, separator_sub)
  text = text.replaceAll(ruby_start, ruby_start_sub);
  text = text.replaceAll(ruby_stop, ruby_stop_sub);
  text = text.replaceAll(reading_start, reading_start_sub);
  text = text.replaceAll(reading_stop, reading_stop_sub);
  text = text.replaceAll(/\n/g, '<br>')
  
  let preview = document.querySelector("#preview");
  preview.innerHTML = text
  
}


function insert_sep() {
  let editor = document.querySelector("#editing");
  let text = editor.value;
  let separator = document.querySelector("#separator-select").value;
  //let n = prompt("何番？", 1)
  let n = 1
  if (!n) {
    editor.focus()
    return;
  }
  let insertion = "\n" + "---[" + separator + ":" + n + "]---\n";
  
  
  editor.focus()
  let sel_start = editor.selectionStart;
  let sel_end = editor.selectionEnd;
  let beginning = text.slice(0,sel_end);
  let end = text.slice(sel_end, text.length);
  
  editor.value = beginning + insertion + end;
  
  update(editor.value)
}

function insert_tags() {
  let editor = document.querySelector("#editing");
  let text = editor.value;
  editor.focus()
  let sel_start = editor.selectionStart;
  let sel_end = editor.selectionEnd;
  let selection = text.slice(sel_start, sel_end);
  let beginning = text.slice(0,sel_start);
  let end = text.slice(sel_end, text.length);
  let insertion = "{rb}" + selection + "{rt}{/rt}{/rb}";
  editor.value = beginning + insertion + end;
  
  // change cursor based on some logic
  // if there is a selection, go to reading spot
  if (selection.length > 0) {
    editor.selectionEnd = sel_end + 8
  }
  // if there is no selection, go to kanji/word spot
  if (selection.length == 0) {
    editor.selectionEnd = sel_start + 4
  }

  update(editor.value)
}

function highlight(text) {

  // regular expressions
  let separators = /(---\[.*?\]---\s*)/g; // match the song part separator syntax
  let ruby_phrase = /({rb}.*?{rt}.*?{\/rt}{\/rb})/g
  let ruby_start = /{rb}/g; //match {rb}
  let ruby_stop = /{\/rb}/g; // match {/rb}
  let ruby_inner = /({rb})(.*?)({rt})/g; // match text needing ruby
  let reading_start = /{rt}/g; // match {rt}
  let reading_stop = /{\/rt}/g; // match {/rt}
  let reading_inner = /({rt})(.*?)({\/rt})/g
  
  // substitutions
  let separator_sub = '<span class="separator">$1</span>'
  let ruby_phrase_sub = '<span class="rb-phrase">$1</span>'
  let ruby_inner_sub = '{rb}<span class="rb-inner">$2</span>{rt}';
  let reading_inner_sub = '{rt}<span class="rt-inner">$2</span>{/rt}'  
  let ruby_start_sub = '<span class="rb">{rb}</span>';
  let ruby_stop_sub = '<span class="rb">{/rb}</span>';
  let reading_start_sub = '<span class="rt">{rt}</span>';
  let reading_stop_sub = '<span class="rt">{/rt}</span>';

  // replacements
  text = text.replaceAll(separators, separator_sub)
  // must do the wrapping ones first
  text = text.replaceAll(ruby_phrase, ruby_phrase_sub);
  text = text.replaceAll(ruby_inner, ruby_inner_sub);  
  text = text.replaceAll(reading_inner, reading_inner_sub);
  // then tags
  text = text.replaceAll(ruby_start, ruby_start_sub);
  text = text.replaceAll(ruby_stop, ruby_stop_sub);
  text = text.replaceAll(reading_start, reading_start_sub);
  text = text.replaceAll(reading_stop, reading_stop_sub);
  return text;
  


  
}

function update(text) {
  let result_element = document.querySelector("#highlighting-content");
  // Handle final newlines
  if(text[text.length-1] == "\n") {
    text += " ";
  }
  // Update code
  result_element.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
  
  // Syntax Highlight
  result_element.innerHTML = highlight(text);
  
  // update preview window
  update_preview();
}

function sync_scroll(element) {
  /* Scroll result to scroll coords of event - sync with textarea */
  let result_element = document.querySelector("#highlighting");
  // Get and set x and y
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}

function check_tab(element, event) {
  let code = element.value;
  if(event.key == "Tab") {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = before_tab + "\t" + after_tab; // add tab char
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value); // Update text to include indent
  }
}




function enable_shortcut_keys() {

  document.addEventListener('keyup', function (event) {
      if (event.ctrlKey && event.key === 'r') {
        insert_tags();
      }
  });
  
}

enable_shortcut_keys();
