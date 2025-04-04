// utils.js

export function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }
  
  export function isURL(str) {
    return (str.startsWith("http") || str.startsWith("www")) &&
           !str.includes(" ") &&
           !str.includes("\n");
  }
  