using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [Route("users")]
    [ApiController]
    public partial class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IRandomPasswordGenerator _generator;
        private readonly IHashService _hashService;
        private readonly IMapper _mapper;

        public UserController(DataContext context, IMapper mapper, IHashService hashService, IRandomPasswordGenerator generator)
        {
            _context = context;
            _mapper = mapper;
            _hashService = hashService;
            _generator = generator;
        }

        [HttpGet]
        public ActionResult<UserDto[]> GetAllUsers()
        {
            var users = _context.Users.ToList();
            var result = _mapper.Map<UserDto[]>(users);
            return Ok(result);
        }

        [OnlyAdmin]
        [HttpPost]
        public IActionResult CreateUser([FromBody] UserDto dto)
        {
            var exists = _context.Users.FirstOrDefault(x => x.EmailAddress == dto.EmailAddress);
            if (exists != null)
                return BadRequest(); // user already exists

            var user = _mapper.Map<User>(dto);

            var randomPassword = _generator.Generate();
            //todo send mail
            user.Password = _hashService.HashPassword(randomPassword);
            user.IsGeneratedPassword = true;

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok();
        }

        [OnlyAdmin]
        [HttpPut("{userId}")]
        public IActionResult UpdateUser([FromBody] UserDto dto, [FromRoute] Guid userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
                return BadRequest(); // user does not exist

            user = _mapper.Map(dto, user);

            _context.Users.Update(user);
            _context.SaveChanges();
            return Ok();
        }

        [OnlyAdmin]
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser([FromRoute] Guid userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
                return BadRequest(); // user does not exist

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok();
        }
    }
}