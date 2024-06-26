export default function getContrast(hexColor){
    if (hexColor.slice(0, 1) === '#') {
      hexColor = hexColor.slice(1);
    }
    var r = parseInt(hexColor.substr(0,2),16);
    var g = parseInt(hexColor.substr(2,2),16);
    var b = parseInt(hexColor.substr(4,2),16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }