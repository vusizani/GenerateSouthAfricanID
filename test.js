// calculates the Lohn digit, see https://en.wikipedia.org/wiki/Luhn_algorithm
function calculateCheckDigit(digitsAsString) {
  //const digits = ('' + dob + gender + sequence + citizenship + eight).split('').map(d => Number(d))
  const digits = digitsAsString
    .replace(/\D/g, "")
    .split("")
    .map((d) => Number(d));
  const checkSum = digits
    .reverse()
    .map((d, ix) => {
      if (ix % 2 === 0) {
        d *= 2;
        if (d > 9) {
          d -= 9;
        }
      }
      return d;
    })
    .reduce((memo, d) => (memo += d), 0);
  return (checkSum * 9) % 10;
}

// show a valid ID number generated using the values in the form
function showIdNumber() {
  const form = document.forms.f1;

  const values = [
    form.year,
    form.month,
    form.day,
    form.gender,
    { value: form.sequence.value || "896" /* sequence */ },
    { value: form.cship.value || "0" /* citizenship */ },
    { value: "8" /* a */ },
  ];

  withoutCheckDigit = values.map((e) => e.value).join("");
  const idNumber = withoutCheckDigit + calculateCheckDigit(withoutCheckDigit);

  document.getElementById("result").innerHTML = `<p>${idNumber}</p>`;
}

function showExpertOptions() {
  document.getElementById("showExpertOptions").toggle();
  document.getElementById("expertOptions").toggle();
}

// add 'option' elements to the 'select' elements (for year, month, day)
function addOptions(id, from, to, toLabel, toValue, defaultValue) {
  const selectElement = document.getElementById(id);
  const values = [];
  for (let i = 0; i <= to - from; i++) values[i] = i + from;
  const options = values
    .map((v) => (v < 10 ? "0" : "") + v)
    .map((v) => {
      const value = toValue ? toValue(v) : v;
      const isDefault = defaultValue && defaultValue === value;
      const label = toLabel ? toLabel(v) : v;
      return `<option value=${value} ${
        isDefault ? 'selected="selected"' : ""
      }>${label}</option>`;
    });
  selectElement.innerHTML = options.join();
}

const year = new Date().getYear(); // need the current year to display age... 2016 yields 116 (thanks to funny JS)

const pad = function (n) {
  const str = "" + n;
  const pad = "000";
  return pad.substring(0, pad.length - str.length) + str;
};

addOptions("year", 20, 99, (v) => `${v} (~${year - Number(v)} years old)`);
addOptions("month", 1, 12);
addOptions("day", 1, 31);
addOptions("sequence", 0, 999, (v) => pad(v), pad, "800");
