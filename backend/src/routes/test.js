import validator from 'validator';

const password = 'StrongPassword123';

// Debugging the password validation
console.log('Testing password:', password);
console.log('Has min length (6):', password.length >= 6);
console.log('Has lowercase:', /[a-z]/.test(password));
console.log('Has uppercase:', /[A-Z]/.test(password));
console.log('Has number:', /\d/.test(password));

const isValid = validator.isStrongPassword(password, {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
});

console.log('Password validation result:', isValid);
