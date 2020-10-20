using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TestApp.Api.Models;

namespace TestApp.Api.Services.Impl
{
    public interface ITokenIssuer
    {
        string Audience { get; set; }
        string Issuer { get; set; }
        string SecurityKey { get; set; }

        JwtSecurityToken Issue(IEnumerable<Claim> claims);
        string Issue(User user);
        bool Validate(string token, bool ignoreLifetimeValidation = false);
        string SerializeToken(JwtSecurityToken token);
        JwtSecurityToken DeserializeToken(string token);
    }
}
