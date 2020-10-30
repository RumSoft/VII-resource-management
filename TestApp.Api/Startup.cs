using System;
using System.IO;
using System.Reflection;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TestApp.Api.Auth;
using TestApp.Api.Controllers;
using TestApp.Api.Data;
using TestApp.Api.Services;
using TestApp.Api.Services.Impl;
using Attribute = TestApp.Api.Models.Attribute;

namespace TestApp.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(options => options.UseLazyLoadingProxies()
                .UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Attribute, AttributeController.AttributeDto>().ReverseMap();
                cfg.CreateMap<Attribute, AttributeController.CreateAttributeDto>().ReverseMap();
            });

            services.AddAutoMapper(typeof(MappingProfile));

            services.AddBearerAuthentication();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            services.AddAuthorization(c =>
            {
                c.AddPolicy("ShouldBeAnAdmin", options =>
                {
                    options.RequireAuthenticatedUser();
                    options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                    options.Requirements.Add(new ShouldBeAnAdminRequirement());
                });
            });

            services.AddCors();
            services.AddTransient<IHashService, PBKDF2HashSerivce>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<ITokenManager, TokenManager>();
            services.AddSingleton<IRandomPasswordGenerator, RandomPasswordGenerator>();
            services.AddSingleton<IUserInfo, UserInfo>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            app.UseCors(x => x.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseSwagger()
                .UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    c.RoutePrefix = "";
                });
        }
    }
}