interface ValidatorRule {
  selector: string;
  test: (value: string) => string | undefined;
}

interface ValidatorOptions {
  formID: string;
  formGroupSelector: string;
  errorSelector: string;
  rules: ValidatorRule[];
  onSubmit?: (formValues: Record<string, any>) => Promise<void>;
}

class Validator {
  private selectorRules: Record<
    string,
    ((value: string) => string | undefined)[]
  > = {};

  constructor(private options: ValidatorOptions) {
    const formElement = document.querySelector(
      this.options.formID
    ) as HTMLFormElement;

    if (formElement) {
      let submitting = false;

      formElement.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (submitting) return;

        let isFormValid = true;

        this.options.rules.forEach((rule) => {
          const inputElement = formElement.querySelector<HTMLInputElement>(
            rule.selector
          );
          if (inputElement) {
            const isValid = this.validate(inputElement, rule, formElement);
            if (!isValid) isFormValid = false;
          }
        });

        if (isFormValid) {
          if (typeof this.options.onSubmit === "function") {
            submitting = true;
            const enableInputs = formElement.querySelectorAll<HTMLInputElement>(
              "[name]:not([disabled])"
            );
            const formValues: Record<string, any> = {};

            enableInputs.forEach((input) => {
              switch (input.type) {
                case "radio":
                  formValues[input.name] =
                    formElement.querySelector<HTMLInputElement>(
                      `input[name='${input.name}']:checked`
                    )?.value;
                  break;
                case "checkbox":
                  if (!input.matches(":checked")) {
                    formValues[input.name] = "";
                    return;
                  }
                  if (!Array.isArray(formValues[input.name])) {
                    formValues[input.name] = [];
                  }
                  formValues[input.name].push(input.value);
                  break;
                case "file":
                  formValues[input.name] = input.files ? input.files[0] : null;
                  break;
                default:
                  formValues[input.name] = input.value;
              }
            });

            await this.options.onSubmit(formValues);
            submitting = false;
          } else {
            formElement.submit();
          }
        }
      });

      this.options.rules.forEach((rule) => {
        const inputElements = formElement.querySelectorAll<HTMLInputElement>(
          rule.selector
        );

        inputElements.forEach((inputElement) => {
          inputElement.addEventListener("blur", () => {
            this.validate(inputElement, rule, formElement);
          });

          inputElement.addEventListener("input", () => {
            const parentElement = this.getParent(
              inputElement,
              this.options.formGroupSelector
            ) as HTMLDivElement;
            const errorElement = parentElement.querySelector<HTMLElement>(
              this.options.errorSelector
            ) as HTMLSpanElement;

            parentElement.classList.remove("invalid");
            errorElement.innerText = "";
          });
        });

        if (Array.isArray(this.selectorRules[rule.selector])) {
          this.selectorRules[rule.selector].push(rule.test);
        } else {
          this.selectorRules[rule.selector] = [rule.test];
        }
      });
    }
  }

  private getParent(
    element: HTMLElement,
    selector: string
  ): HTMLElement | null {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
    return null;
  }

  private validate(
    inputElement: HTMLInputElement,
    rule: ValidatorRule,
    formElement: HTMLFormElement
  ): boolean {
    const parentElement = this.getParent(
      inputElement,
      this.options.formGroupSelector
    ) as HTMLDivElement;
    const errorElement = parentElement.querySelector<HTMLElement>(
      this.options.errorSelector
    );
    let errorMessage: string | undefined = undefined;

    const rules = this.selectorRules[rule.selector];

    for (let i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](
            formElement.querySelector<HTMLInputElement>(
              rule.selector + ":checked"
            )?.value || ""
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
          break;
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      parentElement.classList.add("invalid");
      errorElement!.innerText = errorMessage;
    } else {
      parentElement.classList.remove("invalid");
      errorElement!.innerText = "";
    }

    return !errorMessage;
  }

  static isRequired(selector: string, message?: string): ValidatorRule {
    return {
      selector,
      test(value) {
        return value ? undefined : message || "Vui lòng nhập trường này";
      },
    };
  }

  static isEmail(selector: string, message?: string): ValidatorRule {
    return {
      selector,
      test(value) {
        const regexEmail =
          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        return regexEmail.test(value)
          ? undefined
          : message || "Trường này phải là email";
      },
    };
  }

  static isPhone(selector: string, message?: string): ValidatorRule {
    return {
      selector,
      test(value) {
        const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        return regex.test(value)
          ? undefined
          : message || "Trường này phải là số điện thoại";
      },
    };
  }

  static minLength(
    selector: string,
    min: number,
    message?: string
  ): ValidatorRule {
    return {
      selector,
      test(value) {
        return value.length >= min
          ? undefined
          : message || `Vui lòng tối thiểu ${min} ký tự`;
      },
    };
  }

  static isConfirmed(
    selector: string,
    getConfirmValue: () => string,
    message?: string
  ): ValidatorRule {
    return {
      selector,
      test(value) {
        return value === getConfirmValue()
          ? undefined
          : message || "Giá trị nhập lại không khớp";
      },
    };
  }
}
export { Validator };
