// Main
(() => {
  new Validator({
    formID: "#form-1",
    formGroupSelector: ".form-group",
    errorSelector: ".form-message",
    rules: [
      Validator.isRequired("#fullname", "Vui lòng nhập tên đầy đủ"),
      Validator.isRequired("#username", "Vui lòng nhập tên đăng nhập"),
      Validator.isRequired("#email"),
      Validator.isEmail("#email"),
      Validator.isRequired("#phone"),
      Validator.isPhone("#phone"),
      Validator.isRequired("#password"),
      Validator.minLength("#password", 6),
      Validator.isRequired("#password_confirmation"),
      Validator.isConfirmed(
        "#password_confirmation",
        function () {
          const passwordElement =
            document.querySelector<HTMLInputElement>("#form-1 #password");
          return passwordElement ? passwordElement.value : "";
        },
        "Mật khẩu nhập lại không khớp"
      ),
    ],
    onSubmit: handleOnSubmitForm,
  });
})();

// Handle form submit
async function handleOnSubmitForm(
  formValues: Record<string, any>
): Promise<void> {
  console.log("Form submitted with values:", formValues);
}
