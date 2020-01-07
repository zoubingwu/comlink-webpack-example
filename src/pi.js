//From https://trans4mind.com/personal_development/JavaScript/longnumPiMachin.htm
let mess = '';

//10^11 seems to be the maximum
//too high a figure for the base introduces errors
const Base = Math.pow(10, 11);
//num digits in each array item
const cellSize = Math.floor(Math.log(Base) / Math.LN10);
//below is not used in this script
const a = Number.MAX_VALUE;
const MaxDiv = Math.floor(Math.sqrt(a));

function makeArray(n, aX, Integer) {
  var i = 0;
  for (i = 1; i < n; i++) aX[i] = null;
  aX[0] = Integer;
}

function isEmpty(aX) {
  var empty = true;
  for (let i = 0; i < aX.length; i++)
    if (aX[i]) {
      empty = false;
      break;
    }
  return empty;
}
//junior school math
function Add(n, aX, aY) {
  let carry = 0;
  for (let i = n - 1; i >= 0; i--) {
    aX[i] += Number(aY[i]) + Number(carry);
    if (aX[i] < Base) carry = 0;
    else {
      carry = 1;
      aX[i] = Number(aX[i]) - Number(Base);
    }
  }
}
//subtract
function Sub(n, aX, aY) {
  for (let i = n - 1; i >= 0; i--) {
    aX[i] -= aY[i];
    if (aX[i] < 0) {
      if (i > 0) {
        aX[i] += Base;
        aX[i - 1]--;
      }
    }
  }
}
//multiply big number by "small" number
function Mul(n, aX, iMult) {
  let carry = 0;
  for (let i = n - 1; i >= 0; i--) {
    let prod = aX[i] * iMult;
    prod += carry;
    if (prod >= Base) {
      carry = Math.floor(prod / Base);
      prod -= carry * Base;
    } else carry = 0;
    aX[i] = prod;
  }
}
//divide big number by "small" number
function Div(n, aX, iDiv, aY) {
  let carry = 0;
  for (let i = 0; i < n; i++) {
    //add any previous carry
    const currVal = Number(aX[i]) + Number(carry * Base);
    //divide
    const theDiv = Math.floor(currVal / iDiv);
    //find next carry
    carry = currVal - theDiv * iDiv;
    //put the result of division in the current slot
    aY[i] = theDiv;
  }
}

// Calculate pi
function pi(numDec) {
  const iAng = new Array(10);
  const coeff = new Array(10);
  const arrayLength = Math.ceil(1 + numDec / cellSize);
  const aPI = new Array(arrayLength);
  const aArctan = new Array(arrayLength);
  const aAngle = new Array(arrayLength);
  const aDivK = new Array(arrayLength);

  //compute arctan
  function arctan(iAng, n, aX) {
    const iAng_squared = iAng * iAng;
    let k = 3; //k is the coefficient in the series 2n-1, 3,5..
    let sign = 0;
    makeArray(n, aX, 0); //aX is aArctan
    makeArray(n, aAngle, 1);
    Div(n, aAngle, iAng, aAngle); //aAngle = 1/iAng, eg 1/5
    Add(n, aX, aAngle); // aX = aAngle or long angle
    while (!isEmpty(aAngle)) {
      Div(n, aAngle, iAng_squared, aAngle); //aAngle=aAngle/iAng_squared, iAng_squared is iAng*iAng
      //mess+="iAng="+iAng+"; aAngle="+aAngle+"<br>";
      Div(n, aAngle, k, aDivK); /* aDivK = aAngle/k */
      if (sign) Add(n, aX, aDivK);
      /* aX = aX+aDivK */ else Sub(n, aX, aDivK); /* aX = aX-aDivK */
      k += 2;
      sign = 1 - sign;
    }
    mess += 'aArctan=' + aArctan + '<br>';
  }
  var ans = '';
  const t1 = new Date();
  numDec = Number(numDec) + 5;
  //Pi/4 = 4*arctan(1/5)-arctan(1/239)
  //coeff is an array of the coefficients
  //the last item is 0!
  coeff[0] = 4;
  coeff[1] = -1;
  coeff[2] = 0;
  //iAng holds the angles, 5 for 1/5, etc
  iAng[0] = 5;
  iAng[1] = 239;
  iAng[2] = 0;
  makeArray(arrayLength, aPI, 0);
  //Machin: Pi/4 = 4*arctan(1/5)-arctan(1/239)
  makeArray(arrayLength, aAngle, 0);
  makeArray(arrayLength, aDivK, 0);
  for (var i = 0; coeff[i] != 0; i++) {
    arctan(iAng[i], arrayLength, aArctan);
    //multiply by coefficients of arctan
    Mul(arrayLength, aArctan, Math.abs(coeff[i]));
    //mess+="mi="+coeff[i]+"<br>";
    if (coeff[i] > 0) Add(arrayLength, aPI, aArctan);
    else Sub(arrayLength, aPI, aArctan);
    //mess+="api="+aPI+"<br>";
  }
  //we have calculated pi/4, so need to finally multiply
  Mul(arrayLength, aPI, 4);
  //we have now calculated PI, and need to format the answer
  //to print it out
  let sPI = '';
  let tempPI = '';
  //put the figures in the array into the string tempPI
  for (i = 0; i < aPI.length; i++) {
    aPI[i] = String(aPI[i]);
    //ensure there are enough digits in each cell
    //if not, pad with leading zeros
    if (aPI[i].length < cellSize && i != 0) {
      while (aPI[i].length < cellSize) aPI[i] = '0' + aPI[i];
    }
    tempPI += aPI[i];
  }
  const t2 = new Date();
  const timeTaken = (t2.getTime() - t1.getTime()) / 1000;
  // console.log("It took: " + timeTaken + " seconds");
  return tempPI.slice(0, numDec);
}

export default pi;
