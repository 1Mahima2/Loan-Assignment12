# Loan Application Assignment

## Overview
This is a simple loan application web project consisting of two main pages:
- **index.html**: The loan application form where users enter their details.
- **confirm.html**: The OTP confirmation page where users validate their application with a 4-digit OTP.

## Features
- Form validation for:
  - Full name (at least two words, alphabets and spaces only, each word >= 4 characters)
  - Email address (valid email format)
  - PAN number (format: 5 uppercase letters, 4 digits, 1 uppercase letter)
  - Loan amount (numeric, up to 9 digits)
- Loan amount is displayed in words (Indian numbering system).
- Estimated EMI calculation (8.5% p.a., 15 years) displayed dynamically.
- OTP generation and validation with 3 attempts allowed.
- Redirects to Pixel6 homepage on successful validation.
- Redirects to Pixel6 404 page on validation failure.
- Dark theme styling with responsive design.

## Technologies Used
- HTML5
- CSS3 (with CSS variables for theming)
- JavaScript (vanilla)

## How to Use
1. Open `index.html` in a modern web browser.
2. Fill in the loan application form with valid details.
3. Submit the form to navigate to the OTP confirmation page.
4. Check the browser console for the generated OTP (for demo/testing purposes).
5. Enter the OTP and validate.
6. On success, you will be redirected to https://pixel6.co/.
7. On failure after 3 attempts, you will be redirected to https://pixel6.co/404.

## Notes
- The OTP is generated and stored in `sessionStorage` and logged to the browser console for testing.
- The back button behavior after redirection is handled to prevent returning to the confirmation page.
- The project uses a dark theme for better visual comfort.

## Testing
- Validate all form fields with both valid and invalid inputs.
- Test OTP validation with correct and incorrect codes.
- Verify redirection behavior on success and failure.
- Test responsiveness on different screen sizes.

## License
This project is provided as-is for demonstration purposes.
