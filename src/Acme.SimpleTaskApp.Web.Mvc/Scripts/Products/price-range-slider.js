$(document).ready(function () {
  const rangeInput = document.querySelectorAll(".range-input input");
  const priceInput = document.querySelectorAll(".range-price input");
  const range = document.querySelector(".range-selected");
  const progress = document.querySelector(".range-slider");

  let priceGap = 100;

  priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minVal = parseInt(priceInput[0].value) || 0;
      let maxVal = parseInt(priceInput[1].value) || 1000;

      if (maxVal - minVal >= priceGap && maxVal <= 1000) {
        if (e.target.className === "min") {
          rangeInput[0].value = minVal;
        } else {
          rangeInput[1].value = maxVal;
        }
      } else {
        if (e.target.className === "min") {
          priceInput[0].value = maxVal - priceGap;
        } else {
          priceInput[1].value = minVal + priceGap;
        }
      }
      setRange();
    });
  });

  rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minVal = parseInt(rangeInput[0].value);
      let maxVal = parseInt(rangeInput[1].value);

      if (maxVal - minVal < priceGap) {
        if (e.target.className === "min") {
          rangeInput[0].value = maxVal - priceGap;
        } else {
          rangeInput[1].value = minVal + priceGap;
        }
      } else {
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;
      }
      setRange();
    });
  });

  function setRange() {
    let minVal = parseInt(rangeInput[0].value);
    let maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (rangeInput[0].value === minVal) {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    }

    priceInput[0].value = minVal;
    priceInput[1].value = maxVal;
    range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
  }

  // Initialize the range on page load
  setRange();
});
