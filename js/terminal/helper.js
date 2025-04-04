// helper.js

export function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
  
  export function isURL(str) {
    return (
      (str.startsWith("http") || str.startsWith("www")) &&
      !str.includes(" ") &&
      !str.includes("\n")
    );
  }
  
  export function ignoreEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  export function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  