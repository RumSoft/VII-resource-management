using FluentValidation;

namespace TestApp.Api.Models.Dto
{
    public class AttributeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateAttributeDto
    {
        public string Name { get; set; }

        public void Validate()
        {
            new CreateAttributeDtoValidator().ValidateAndThrow(this);
        }
        private class CreateAttributeDtoValidator : AbstractValidator<CreateAttributeDto>
        {
            public CreateAttributeDtoValidator()
            {
                RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(100);
            }
        }
    }

   
}