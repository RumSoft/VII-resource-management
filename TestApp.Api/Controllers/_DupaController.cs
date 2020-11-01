using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    /// <summary>
    ///     to sie usunie xdd
    /// </summary>
    [ApiController]
    [Route("dupa")]
    public class DupaController : RumsoftController
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;

        public DupaController(DataContext context, IHashService hashService)
        {
            _context = context;
            _hashService = hashService;
        }

        [Route("dodaj_admina")]
        [HttpPost]
        public IActionResult DodajAdmina(CreateUserDto dto)
        {
            try
            {
                CreateUser(dto, Roles.Admin);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok("dodano");
        }

        [Route("dodaj_konto")]
        [HttpPost]
        public IActionResult DodajKonto(CreateUserDto dto)
        {
            try
            {
                CreateUser(dto, Roles.User);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok("dodano");
        }

        private void CreateUser(CreateUserDto dto, string role)
        {
            var mail = dto.EmailAddress.ToLowerInvariant();
            if(_context.Users.Any(x => x.EmailAddress == mail))
                throw new ArgumentException("taki uzytkownik juz istnieje kurwa");

            var user = new User
            {
                EmailAddress =  dto.EmailAddress,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Password = _hashService.HashPassword(dto.Password),
                IsGeneratedPassword = false,
                Role = role
            };
            _context.Users.Add(user);
            _context.SaveChanges();
        }
    }
}