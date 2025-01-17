﻿using System;
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
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppConfig.Auth_Key)),
                ValidIssuer = AppConfig.Auth_Issuer,
                ValidAudience = AppConfig.Auth_Issuer
            };

            var events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    Console.WriteLine(context.Exception);
                    return Task.CompletedTask;
                },
                OnMessageReceived = context => Task.CompletedTask,
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