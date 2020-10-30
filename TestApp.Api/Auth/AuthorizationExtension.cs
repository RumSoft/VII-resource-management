using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace TestApp.Api.Auth
{
    internal static class AuthorizationExtension
    {
        // Extension method for Adding 
        // JwtBearer Middleware to the Pipeline
        public static IServiceCollection AddBearerAuthentication(
            this IServiceCollection services)
        {
            var validationParams = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(TokenConstants.key)),
                ValidIssuer = TokenConstants.Issuer,
                ValidAudience = TokenConstants.Audience
            };

            var events = new JwtBearerEvents
            {
                // invoked when the token validation fails
                OnAuthenticationFailed = context =>
                {
                    Console.WriteLine(context.Exception);
                    return Task.CompletedTask;
                },

                // invoked when a request is received
                OnMessageReceived = context => Task.CompletedTask,

                // invoked when token is validated
                OnTokenValidated = context => Task.CompletedTask
            };

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme
                        = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme
                        = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = validationParams;
                    options.Events = events;
                });

            return services;
        }
    }
}