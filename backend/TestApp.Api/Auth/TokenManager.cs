using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TestApp.Api.Models;

namespace TestApp.Api.Auth
{
    public interface ITokenManager
    {
        AuthToken Generate(User user);
    }

    public class TokenManager : ITokenManager
    {
        public AuthToken Generate(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, user.EmailAddress),
                new Claim(ClaimTypes.Sid, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new TokenBuilder()
                .AddAudience(AppConfig.Auth_Audience)
                .AddIssuer(AppConfig.Auth_Issuer)
                .AddExpiry(AppConfig.Auth_ExpiryInMinutes)
                .AddKey(AppConfig.Auth_Key)
                .AddClaims(claims)
                .Build();

            var accessToken = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return new AuthToken
            {
                AccessToken = accessToken,
                ExpiresIn = AppConfig.Auth_ExpiryInMinutes
            };
        }
    }
}