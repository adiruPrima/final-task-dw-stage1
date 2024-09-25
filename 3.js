drawImage(9);

function drawImage(length) {
  if (length % 2 === 0) {
    console.log("Length must be an odd number");
  } else {
    for (let i = 0; i < length; i++) {
      let pattern = "";
      for (let j = 0; j < length; j++) {
        // top and bottom pattern
        if (i === 0 || i === length - 1) {
          if (j === 0 || j === Math.floor(length / 2) || j === length - 1) {
            pattern += "*";
          } else {
            pattern += "#";
          }
        }
        // middle pattern
        else if (i === Math.floor(length / 2)) {
          if (j === Math.floor(length / 2)) {
            pattern += "#";
          } else {
            pattern += "*";
          }
        }
        // rest of pattern
        else {
          if (j === Math.floor(length / 2)) {
            pattern += "*";
          } else {
            pattern += "#";
          }
        }
      }
      console.log(pattern);
    }
  }
}
