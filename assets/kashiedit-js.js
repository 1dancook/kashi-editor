function update_preview() {
  let text = document.querySelector("#editing").value;
  
  // regex for tags
  let ruby_start = /{rb}/g; //match {rb}
  let ruby_stop = /{\/rb}/g; // match {/rb}
  let reading_start = /{rt}/g; // match {rt}
  let reading_stop = /{\/rt}/g; // match {/rt}
  let separators = /(---\[)(.*?)(\]---\s*\n)/g; // only if new line is also there
  
  // substitutions
  let ruby_start_sub = '<ruby class="rounded bg-gray-600 px-1">';
  let ruby_stop_sub = '</ruby>';
  let reading_start_sub = '<rt class="text-green-300 text-sm">';
  let reading_stop_sub = '</rt>';
  let separator_sub = '<br><p class="block border-b-2 border-purple-500 text-gray-50 px-2 mt-4">$2</p>'

  // replacements
  text = text.replace(separators, separator_sub)
  text = text.replace(ruby_start, ruby_start_sub);
  text = text.replace(ruby_stop, ruby_stop_sub);
  text = text.replace(reading_start, reading_start_sub);
  text = text.replace(reading_stop, reading_stop_sub);
  text = text.replace(/\n/g, '<br>')
  
  let preview = document.querySelector("#preview");
  preview.innerHTML = text
  
}


function insert_separator_text(separator, n) {
  let editor = document.querySelector("#editing");
  let text = editor.value;
  let insertion = "\n" + "---[" + separator + ":" + n + "]---\n";
  editor.focus()
  let sel_start = editor.selectionStart;
  let sel_end = editor.selectionEnd;
  let beginning = text.slice(0,sel_end);
  let end = text.slice(sel_end, text.length);
  //TODO: this should ideally get to the eend of a line first and then insert
  
  editor.value = beginning + insertion + end;
  
  update(editor.value)
}

function insert_sep() {
  let separator = document.querySelector("#separator-select").value;
  let n = document.querySelector("#sep-value-input").value;
  insert_separator_text(separator, n);
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
  let separator_sub = '<span class="bg-green-50 text-green-400">$1</span>'

  let ruby_phrase_sub = '<span class="rounded-full bg-purple-50">$1</span>'
  let ruby_inner_sub = '{rb}<span class="text-purple-800 bg-purple-100 rounded">$2</span>{rt}';
  let reading_inner_sub = '{rt}<span class="text-blue-700 bg-blue-100 rounded">$2</span>{/rt}'  
  let ruby_start_sub = '<span class="text-purple-200">{rb}</span>';
  let ruby_stop_sub = '<span class="text-purple-200">{/rb}</span>';
  let reading_start_sub = '<span class="text-blue-200">{rt}</span>';
  let reading_stop_sub = '<span class="text-blue-200">{/rt}</span>';

  // replacements
  text = text.replace(separators, separator_sub)
  // must do the wrapping ones first
  text = text.replace(ruby_phrase, ruby_phrase_sub);
  text = text.replace(ruby_inner, ruby_inner_sub);  
  text = text.replace(reading_inner, reading_inner_sub);
  // then tags
  text = text.replace(ruby_start, ruby_start_sub);
  text = text.replace(ruby_stop, ruby_stop_sub);
  text = text.replace(reading_start, reading_start_sub);
  text = text.replace(reading_stop, reading_stop_sub);

  text = text.replace(/\n/g, '<br>');

  return text;
  
}


function add_new_line() {
  let highlights = document.querySelector("#highlighting");
  let newlines = document.querySelector("#newlines");
  let text = highlights.innerHTML;
  text = text.replace(/(.*?)<br>/g, '<span class="newline -m-4"></span><span style="color:transparent; background:transparent">$1</span><br>')
  newlines.innerHTML = text
}

function update(text) {
  let result_element = document.querySelector("#highlighting");
  // Handle final newlines
  //text = text.replace(/\n{1,200}$/, "")

  if(text[text.length-1] == "\n") {
    text += "\n";
  }
  // Update code
  result_element.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
  
  // Syntax Highlight
  result_element.innerHTML = highlight(text);

  //add_new_line();
  
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
      if (event.ctrlKey && event.key === '1') {
        let n = document.querySelector("#sep-value-input").value;
        insert_separator_text("バース", n);
      }
      if (event.ctrlKey && event.key === '2') {
        let n = document.querySelector("#sep-value-input").value;
        insert_separator_text("コーラス", n);
      }
      if (event.ctrlKey && event.key === '3') {
        let n = document.querySelector("#sep-value-input").value;
        insert_separator_text("ブリッジ", n);
      }
      if (event.ctrlKey && event.key === 'u') {
        let n = document.querySelector("#sep-value-input");
        let a = parseInt(n.value) + 1
        n.value = a
      }
      if (event.ctrlKey && event.key === 'd') {
        let n = document.querySelector("#sep-value-input");
        let a = parseInt(n.value) - 1
        n.value = a
        if (n.value <= 0) {
          n.value = 1
        }
      }
  });
  

}

enable_shortcut_keys();
