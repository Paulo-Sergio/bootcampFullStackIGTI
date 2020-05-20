window.addEventListener('load', start);

var rangeRed = document.querySelector('#range-red');
var rangeGreen = document.querySelector('#range-green');
var rangeBlue = document.querySelector('#range-blue');

function start() {
  rangeRed.addEventListener('input', changeRange);
  rangeGreen.addEventListener('input', changeRange);
  rangeBlue.addEventListener('input', changeRange);

  changeInputsValues('0', '0', '0');
  changeResultColor('0', '0', '0');
}

function changeRange() {
  var rangeRedValue = rangeRed.value;
  var rangeGreenValue = rangeGreen.value;
  var rangeBlueValue = rangeBlue.value;

  changeInputsValues(rangeRedValue, rangeGreenValue, rangeBlueValue);
  changeResultColor(rangeRedValue, rangeGreenValue, rangeBlueValue);
}

function changeResultColor(red, green, blue) {
  var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
  result.style.backgroundColor = color;
}

function changeInputsValues(red, green, blue) {
  document.querySelector('#text-red').value = red;
  document.querySelector('#text-green').value = green;
  document.querySelector('#text-blue').value = blue;
}