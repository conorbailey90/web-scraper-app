function nullCheck(jsSelector) {
  let selector = jsSelector == null ? "UNDEFINED" : jsSelector.innerText;
  return selector;
}

module.exports = nullCheck;
