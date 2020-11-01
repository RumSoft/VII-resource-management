﻿using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [Route("users")]
    [ApiController]
    public class UserController : RumsoftController
    {
        private const string Message_400_UserNotFound = "User does not exist.";
        private const string Message_400_UserExists = "User with same name already exists.";

        private readonly DataContext _context;
        private readonly IRandomPasswordGenerator _generator;
        private readonly IHashService _hashService;
        private readonly ILogger _logger;
        private readonly IMailerService _mailer;
        private readonly IMapper _mapper;

        public UserController(DataContext context, IMapper mapper, IHashService hashService,
            IRandomPasswordGenerator generator, IMailerService mailer, ILogger<UserController> logger)
        {
            _context = context;
            _mapper = mapper;
            _hashService = hashService;
            _generator = generator;
            _mailer = mailer;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<UserWithIdDto[]> GetAllUsers()
        {
            var users = _context.Users.ToList();
            var result = _mapper.Map<UserWithIdDto[]>(users);
            return Ok(result);
        }

        [OnlyAdmin]
        [HttpPost]
        public IActionResult CreateUser([FromBody] UserDto dto)
        {
            try
            {
                var exists = _context.Users.FirstOrDefault(x => x.EmailAddress == dto.EmailAddress);
                if (exists != null)
                    throw new Exception(Message_400_UserExists);

                var user = _mapper.Map<User>(dto);

                SetRandomPasswordAndSendMail(user);

                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return BadRequest(e);
            }
        }

        [OnlyAdmin]
        [HttpPut("{userId}")]
        public IActionResult UpdateUser([FromBody] UserDto dto, [FromRoute] Guid userId)
        {
            try
            {
                var user = _context.Users.Find(userId)
                           ?? throw new ArgumentNullException(Message_400_UserNotFound);

                //todo check if email is not used by other
                user = _mapper.Map(dto, user);

                _context.Users.Update(user);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return BadRequest(e);
            }
        }

        [OnlyAdmin]
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser([FromRoute] Guid userId)
        {
            try
            {
                var user = _context.Users.Find(userId)
                           ?? throw new ArgumentNullException(Message_400_UserNotFound);

                _context.Users.Remove(user);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [OnlyAdmin]
        [HttpPost("reset-password/{id}")]
        public IActionResult ResetPassword(Guid id)
        {
            try
            {
                var user = _context.Users.Find(id)
                           ?? throw new ArgumentNullException(Message_400_UserNotFound);

                SetRandomPasswordAndSendMail(user);

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return BadRequest(e);
            }
        }

        private void SetRandomPasswordAndSendMail(User user)
        {
            var password = _generator.Generate();
            user.Password = _hashService.HashPassword(password);
            user.IsGeneratedPassword = true;

            MailingHelper.SendPasswordMail(user, _mailer);
        }
    }
}