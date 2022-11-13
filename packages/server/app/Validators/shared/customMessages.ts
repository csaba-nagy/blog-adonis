/**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */

export const validationErrorMessages = {
  'required': '{{ field }} is required',
  'alpha': 'Invalid characters, only alphabetic characters allowed',
  'minLength': '{{ field }} should be at least {{ options.minLength }} characters long.',
  'maxLength': '{{ field }} cannot be longer than {{ options.maxLength }} characters.',
  'email': 'Invalid email format',
  'email.unique': 'Invalid email address',
  'password.regex': 'Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
  'url': 'The given link is invalid. Only https protocol allowed.',
  'biography.minLength': 'The {{ field }} should be {{ options.minLength }} characters long at least.',
  'biography.maxLength': '{{ field }} cannot be longer than {{ options.maxLength }} characters.',
}
