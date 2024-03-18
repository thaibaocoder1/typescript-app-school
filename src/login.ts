// Main
(() => {
  new Validator({
    formID: "#form-1",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [
      Validator.isRequired("#email"),
      Validator.isEmail("#email"),
      Validator.isRequired("#password"),
      Validator.minLength("#password", 6),
    ],
    onSubmit: handleOnSubmitForm1,
  });
})();

// Handle form submit
async function handleOnSubmitForm1(
  formValues: Record<string, any>
): Promise<void> {
  console.log("Form submitted with values:", formValues);
}
