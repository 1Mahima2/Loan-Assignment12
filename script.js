/* script.js
   Shared by index.html and confirm.html. It detects which page is loaded and runs appropriate code.
   The code uses sessionStorage to pass form values and OTP between pages.
*/


/**
 * Validates if the provided string is a valid email address.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates if the provided string is a valid PAN number in the format ABCDE1234F.
 * @param {string} pan - The PAN string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidPAN(pan) {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan);
}

/**
 * Validates if the provided name is a valid full name.
 * Requirements: At least two words, only alphabets and spaces, each word >= 4 characters.
 * @param {string} name - The full name string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidFullName(name) {
  if (!/^[A-Za-z\s]+$/.test(name)) return false;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return false;
  return parts.every(part => part.length >= 4);
}

/**
 * Validates if the provided amount string is a valid numeric amount up to 9 digits.
 * @param {string} amountStr - The amount string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidAmount(amountStr) {
  if (!/^\d+$/.test(amountStr)) return false;
  return amountStr.length <= 9;
}

/**
 * Converts a number to its word representation in Indian numbering system.
 * @param {number} num - The number to convert.
 * @returns {string} The word representation of the number.
 */
function numberToWordsIndian(num) {
  if (num === 0) return 'Zero Rupees';
  if (num < 0) return 'Minus ' + numberToWordsIndian(Math.abs(num));

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function twoDigitToWords(n) {
    if (n < 20) return ones[n];
    const tenPart = Math.floor(n / 10);
    const onePart = n % 10;
    return tens[tenPart] + (onePart ? ' ' + ones[onePart] : '');
  }

  function threeDigitToWords(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred) res += ones[hundred] + ' Hundred';
    if (rest) res += (res ? ' ' : '') + twoDigitToWords(rest);
    return res;
  }

  let result = '';

  const crore = Math.floor(num / 10000000);
  num = num % 10000000;
  const lakh = Math.floor(num / 100000);
  num = num % 100000;
  const thousand = Math.floor(num / 1000);
  num = num % 1000;
  const hundreds = num;

  if (crore) result += threeDigitToWords(crore) + ' Crore';
  if (lakh) result += (result ? ' ' : '') + threeDigitToWords(lakh) + ' Lakh';
  if (thousand) result += (result ? ' ' : '') + threeDigitToWords(thousand) + ' Thousand';
  if (hundreds) result += (result ? ' ' : '') + threeDigitToWords(hundreds);

  result += ' Rupees';
  return result.trim() + '.';
}

/**
 * Calculates the Equated Monthly Installment (EMI) for a loan.
 * @param {number} P - Principal loan amount.
 * @param {number} annualRate - Annual interest rate in percentage (default: 8.5).
 * @param {number} tenureYears - Loan tenure in years (default: 15).
 * @returns {number} The calculated EMI amount.
 */
function calculateEMI(P, annualRate = 8.5, tenureYears = 15) {
  const r = annualRate / 100 / 12; // Monthly interest rate
  const n = tenureYears * 12; // Total number of months
  if (r === 0) return P / n; // If no interest, simple division
  const numerator = P * r * Math.pow(1 + r, n);
  const denominator = Math.pow(1 + r, n) - 1;
  return numerator / denominator;
}

/**
 * Immediately Invoked Function Expression (IIFE) to encapsulate page-specific logic.
 * Detects whether the current page is index.html or confirm.html and runs appropriate code.
 */
(function() {
  // Detect page type by checking for specific elements
  const isIndex = document.querySelector('#loanForm') !== null;
  const isConfirm = document.querySelector('#otpBlock') !== null;

  if (isIndex) {
    console.log("Running index.html logic");

    // Get form elements
    const form = document.getElementById('loanForm');
    const fullNameEl = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    const panEl = document.getElementById('pan');
    const loanAmountEl = document.getElementById('loanAmount');

    // Get error display elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const panError = document.getElementById('panError');
    const amountError = document.getElementById('amountError');
    const amountWords = document.getElementById('amountWords');
    const emiInfo = document.getElementById('emiInfo');

    // Handle loan amount input changes
    loanAmountEl.addEventListener('input', function () {
      // Clear previous messages
      amountWords.textContent = '';
      emiInfo.textContent = '';
      amountError.textContent = '';

      // Remove non-numeric characters
      const val = loanAmountEl.value.replace(/\D/g, '');
      loanAmountEl.value = val;

      if (!val) return;

      if (isValidAmount(val)) {
        try {
          const num = parseInt(val, 10);
          // Display amount in words
          amountWords.textContent = numberToWordsIndian(num);
        } catch (e) {
          // Fallback: calculate and display EMI
          const emi = Math.round(calculateEMI(parseInt(val, 10)));
          emiInfo.textContent = `Estimated EMI (8.5% p.a., 15 yrs): ₹ ${emi} / month`;
        }
      } else {
        amountError.textContent = 'Enter numeric amount up to 9 digits.';
      }
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log("Submit clicked");

      // Get form values
      const fullName = fullNameEl.value.trim();
      const email = emailEl.value.trim();
      const pan = panEl.value.trim().toUpperCase();
      const loanAmount = loanAmountEl.value.trim();

      console.log({ fullName, email, pan, loanAmount });

      let ok = true;

      // Validate form fields
      if (!isValidFullName(fullName)) {
        nameError.textContent = 'Enter at least two words, alphabets & spaces only, each >=4 chars.';
        ok = false;
      }
      if (!isValidEmail(email)) {
        emailError.textContent = 'Enter a valid email address.';
        ok = false;
      }
      if (!isValidPAN(pan)) {
        panError.textContent = 'PAN must be in format ABCDE1234F (uppercase).';
        ok = false;
      }
      if (!isValidAmount(loanAmount)) {
        amountError.textContent = 'Loan amount must be numeric and up to 9 digits.';
        ok = false;
      }

      console.log("Validation result:", ok);

      if (!ok) {
        return;
      }

      // Store form data in sessionStorage
      sessionStorage.setItem('loan_fullName', fullName);
      sessionStorage.setItem('loan_email', email);
      sessionStorage.setItem('loan_pan', pan);
      sessionStorage.setItem('loan_amount', loanAmount);

      console.log("Redirecting to confirm.html");
      window.location.href = 'confirm.html';
    });

  } else if (isConfirm) {
    console.log("Running confirm.html logic");

    // Get page elements
    const messageBlock = document.getElementById('messageBlock');
    const otpBlock = document.getElementById('otpBlock');
    const otpInput = document.getElementById('otpInput');
    const validateBtn = document.getElementById('validateBtn');
    const otpError = document.getElementById('otpError');
    const attemptsLeft = document.getElementById('attemptsLeft');
    const resultBlock = document.getElementById('resultBlock');

    // Retrieve stored form data
    const fullName = sessionStorage.getItem('loan_fullName') || '';
    const email = sessionStorage.getItem('loan_email') || '';

    if (!fullName || !email) {
      messageBlock.textContent = 'Required application data missing. Please fill the form first.';
      otpBlock.style.display = 'none';
      return;
    }

    // Display personalized message
    const firstName = fullName.trim().split(/\s+/)[0];
    messageBlock.innerHTML = `
      <p>Dear <strong>${firstName}</strong>,</p>
      <p>Thank you for your inquiry. A 4 digit verification number has been sent to your email: <strong>${email}</strong></p>
      <p>Please enter it below and submit for confirmation.</p>
    `;

    // Generate and store OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem('loan_otp', otp);
    console.log('Verification OTP (for test/demo only):', otp);

    let attempts = 0;
    const maxAttempts = 3;
    attemptsLeft.textContent = `Attempts left: ${maxAttempts - attempts}`;

    // Handle OTP validation
    validateBtn.addEventListener('click', function () {
      otpError.textContent = '';
      resultBlock.textContent = '';

      const entered = (otpInput.value || '').trim();
      if (!/^\d{4}$/.test(entered)) {
        otpError.textContent = 'Enter the 4-digit code sent to your email.';
        return;
      }

      attempts++;
      if (entered === sessionStorage.getItem('loan_otp')) {
        // Success case
        otpBlock.style.display = 'none';
        resultBlock.className = 'result-block result-success';
        resultBlock.textContent = 'Validation Successful!';
        setTimeout(() => {
          window.location.href = 'https://pixel6.co/';
        }, 2000);
      } else {
        if (attempts >= maxAttempts) {
          // Failure case after max attempts
          otpBlock.style.display = 'none';
          resultBlock.className = 'result-block result-fail';
          resultBlock.textContent = 'Validation Failed!';
          setTimeout(() => {
            window.location.href = 'https://pixel6.co/404';
          }, 2000);
        } else {
          // Retry case
          otpError.textContent = 'Incorrect code. Please try again.';
          attemptsLeft.textContent = `Attempts left: ${maxAttempts - attempts}`;
          otpInput.value = '';
          otpInput.focus();
        }
      }
    });
  }
})();
