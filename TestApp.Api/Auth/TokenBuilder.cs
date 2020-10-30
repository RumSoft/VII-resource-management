using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TestApp.Api.Auth
{
    public class TokenBuilder
    {
        private string _audience;
        private List<Claim> _claims;
        private SigningCredentials _credentials;
        private DateTime _expires;
        private string _issuer;
        private SymmetricSecurityKey _key;

        public TokenBuilder AddClaims(List<Claim> claims)
        {
            if (_claims == null)
                _claims = claims;
            else
                _claims.AddRange(claims);
            return this;
        }

        public TokenBuilder AddClaim(Claim claim)
        {
            if (_claims == null)
                _claims = new List<Claim> {claim};
            else
                _claims.Add(claim);
            return this;
        }

        public TokenBuilder AddIssuer(string issuer)
        {
            _issuer = issuer;
            return this;
        }

        public TokenBuilder AddAudience(string audience)
        {
            _audience = audience;
            return this;
        }

        public TokenBuilder AddExpiry(int minutes)
        {
            _expires = DateTime.Now.AddMinutes(minutes);
            return this;
        }

        public TokenBuilder AddKey(string key)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            _credentials = new SigningCredentials(_key,
                SecurityAlgorithms.HmacSha256);
            return this;
        }

        public JwtSecurityToken Build()
        {
            return new JwtSecurityToken(
                _issuer,
                _audience,
                _claims,
                expires: _expires,
                signingCredentials: _credentials
            );
        }
    }
}