const checksRGB = (color) => {
  if (color <= 0.03928) {
    return (color / 12.92);
  } else {
    return (Math.pow(((color + 0.055)/1.055), 2.4));
  }
}

const getColorObject = (color) => {
  const colorObj = {
    r: checksRGB(color.r/255),
    g: checksRGB(color.g/255),
    b: checksRGB(color.b/255)
  };
  return colorObj;
};

const calculateRatio = (color1, color2) => {
  const colorOneObject = getColorObject(color1);
  const colorTwoObject = getColorObject(color2);
  const colorOneL = ((0.2126 * colorOneObject.r) + (0.7152 * colorOneObject.g) + (0.0722 * colorOneObject.b));
  const colorTwoL = ((0.2126 * colorTwoObject.r) + (0.7152 * colorTwoObject.g) + (0.0722 * colorTwoObject.b));
  if (colorOneL > colorTwoL) {
    return ((colorOneL + 0.05)/(colorTwoL + 0.05));
  } else {
    return ((colorTwoL + 0.05)/(colorOneL + 0.05));
  }
}

module.exports = calculateRatio;