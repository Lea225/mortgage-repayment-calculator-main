document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mortgageForm');
  const clearAllBtn = document.getElementById('clearAll');

  const amountInput = document.getElementById('amount');
  const termInput = document.getElementById('term');
  const rateInput = document.getElementById('rate');

  const resultsInfo = document.querySelector('.results-info');
  const resultsDisplay = document.querySelector('.results-display');
  const monthlyRepayment = document.getElementById('monthlyRepayment');
  const totalRepayment = document.getElementById('totalRepayment');

  const radioContainers = document.querySelectorAll('.radio-container');
  const radios = document.querySelectorAll('input[name="mortgageType"]');

  radios.forEach(radio => {
    if (radio.checked) {
      radio.closest('.radio-container').classList.add('active');
    }
    radio.addEventListener('change', () => {
      radioContainers.forEach(container => container.classList.remove('active'));
      if (radio.checked) {
        radio.closest('.radio-container').classList.add('active');
      }
    });
  });

  const inputs = document.querySelectorAll(".input-group input");

  inputs.forEach(input => {
    input.addEventListener("input", function() {
      const span = this.nextElementSibling;
      if (span && this.value) {
        span.classList.add("filled");
        span.classList.remove("error");
        this.classList.remove("error");
        const errorMessage = this.parentElement.nextElementSibling;
        if (errorMessage) {
          errorMessage.classList.remove("visible");
        }
      } else if (span) {
        span.classList.remove("filled");
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if form is invalid
    }

    const amount = parseFloat(amountInput.value);
    const term = parseFloat(termInput.value) * 12; // convert years to months
    const rate = parseFloat(rateInput.value) / 100 / 12; // convert annual rate to monthly

    const mortgageType = document.querySelector('input[name="mortgageType"]:checked').value;

    let monthlyPayment = 0;
    let totalPayment = 0;

    if (mortgageType === 'repayment') {
      if (rate === 0) {
        monthlyPayment = amount / term;
      } else {
        monthlyPayment = amount * rate / (1 - Math.pow(1 + rate, -term));
      }
      totalPayment = monthlyPayment * term;
    } else if (mortgageType === 'interestOnly') {
      monthlyPayment = amount * rate;
      totalPayment = monthlyPayment * term;
    }

    resultsInfo.classList.add('hidden');
    resultsDisplay.classList.remove('hidden');

    monthlyRepayment.textContent = monthlyPayment.toFixed(2);
    totalRepayment.textContent = totalPayment.toFixed(2);
  });

  clearAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    form.reset();
    resultsInfo.classList.remove('hidden');
    resultsDisplay.classList.add('hidden');
    resetErrors();

    inputs.forEach(input => {
      const span = input.nextElementSibling;
      if (span) {
        span.classList.remove("filled", "error");
      }
      input.classList.remove("error");
      const errorMessage = input.parentElement.nextElementSibling;
      if (errorMessage) {
        errorMessage.classList.remove("visible");
      }
    });

    radioContainers.forEach(container => container.classList.remove('active'));
  });

  function validateForm() {
    let formIsValid = true;
  
    inputs.forEach(input => {
      const span = input.nextElementSibling;
      const errorMessage = input.parentElement.nextElementSibling;
  
      if (!input.value) {
        if (span) {
          span.classList.add("error");
        }
        input.classList.add("error");
        if (errorMessage) {
          errorMessage.classList.add("visible");
        }
        formIsValid = false;
      } else {
        if (span) {
          span.classList.remove("error");
        }
        input.classList.remove("error");
        if (errorMessage) {
          errorMessage.classList.remove("visible");
        }
      }
    });
  
    // Custom validation for mortgageType radios
    const selectedRadio = Array.from(radios).find(radio => radio.checked);
    const typeError = document.getElementById("typeError");
    if (!selectedRadio && typeError) {
      typeError.classList.add("visible");
      formIsValid = false;
    } else if (typeError) {
      typeError.classList.remove("visible");
    }
  
    return formIsValid;
  }  

  function resetErrors() {
    inputs.forEach(input => {
      const span = input.nextElementSibling;
      if (span) {
        span.classList.remove("error");
      }
      input.classList.remove("error");
      const errorMessage = input.parentElement.nextElementSibling;
      if (errorMessage) {
        errorMessage.classList.remove("visible");
      }
    });

    const typeError = document.getElementById("typeError");
    if (typeError) {
      typeError.classList.remove("visible");
    }
  }
});