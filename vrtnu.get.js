// From: http://stackoverflow.com/questions/3596583/javascript-detect-an-ajax-event
// Kudos Crayon Violent
// Small tweaks for this usecase.

var s_ajaxListener = new Object();
s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
s_ajaxListener.callback = function () {
  // this.method :the ajax method used
  // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
  // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)
  // print it in console
  //TODO: Debugging here
  if(this.url.startsWith("https://media-services-public.vrt.be/vualto-video-aggregator-web")){
    console.log("Resending...")
    var xhr = new XMLHttpRequest();
    xhr.myXHR = true;
    url = this.url;
    method = "GET";
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
      console.log("YES"); // WHY U NO CALL?
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };
    xhr.send();
  }
  console.log(this.method);
  console.log(this.url);
  console.log(this.data);
}

// Open for GET requests.
XMLHttpRequest.prototype.open = function(a,b) {
  console.log(this)
  if (!this.myXHR == true){
    if (!a) var a='';
    if (!b) var b='';
    s_ajaxListener.tempOpen.apply(this, arguments);
    s_ajaxListener.method = a;  
    s_ajaxListener.url = b;
    if (a.toLowerCase() == 'get') {
      s_ajaxListener.data = b.split('?');
      s_ajaxListener.data = s_ajaxListener.data[1];
    }
  }
}

// Send for POST requests
XMLHttpRequest.prototype.send = function(a,b) {
  if (!this.myXHR == true){
    if (!a) var a='';
    if (!b) var b='';
    s_ajaxListener.tempSend.apply(this, arguments);
    if(s_ajaxListener.method.toLowerCase() == 'post')s_ajaxListener.data = a;
    s_ajaxListener.callback();
  }
}
