using PasswordGenerator;

namespace TestApp.Api.Services.Impl
{
    public class RandomPasswordGenerator : IRandomPasswordGenerator
    {
        private readonly IPassword _generator = new Password(32)
            .IncludeLowercase()
            .IncludeUppercase()
            .IncludeSpecial()
            .IncludeNumeric();

        public string Generate()
        {
            return _generator.Next();
        }
    }
}