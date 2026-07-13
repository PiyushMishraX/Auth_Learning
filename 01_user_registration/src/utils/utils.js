export function generateOtp() {
    return Math.floor( 100000 + Math.random() * 900000).toString()
    // generates a random 6-digit integer (ranging from 100,000 to 999,999) and converts it into a string.
    
}

export function getOtpHtml(otp) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        }
        .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <h1>Your OTP Code</h1>
        <p>Your One-Time Password is:</p>
        <h2>${otp}</h2>
        <p>Please use this code to verify your account.</p>
    </div>
    </body>
    </html>`;
}
