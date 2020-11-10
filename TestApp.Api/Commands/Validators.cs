using System.Text.RegularExpressions;
using FluentValidation;

namespace TestApp.Api.Commands
{
    public static class Validators
    {
        public static IRuleBuilderOptions<T, string> RoomNameValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotEmpty()
                .MinimumLength(5)
                .MaximumLength(100);
        }

        public static IRuleBuilderOptions<T, string> AttributeNameValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotEmpty()
                .MinimumLength(5)
                .MaximumLength(100);
        }

        public static IRuleBuilderOptions<T, string> PasswordValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotEmpty()
                .MinimumLength(5);
        }

        public static IRuleBuilderOptions<T, string> EmailAddressValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotEmpty()
                .EmailAddress()
                .MinimumLength(5);
        }

        public static IRuleBuilderOptions<T, string> NameValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotEmpty()
                .MinimumLength(5)
                .MaximumLength(100);
        }

        public static IRuleBuilderOptions<T, string> ResourceNameValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule
                .NotEmpty()
                .MinimumLength(5)
                .MaximumLength(150);
        }

        public static IRuleBuilderOptions<T, string> HexColorValidator<T>(this IRuleBuilder<T, string> rule)
        {
            return rule.Must(x => string.IsNullOrEmpty(x)
                                  || Regex.IsMatch(x, "^((#[0-9a-fA-F]{3})|(#[0-9a-fA-F]{6})(#[0-9a-fA-F]{8}))$"));
        }
    }
}