using System;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.User
{
    public class GetUserDetailsQuery : Command<Guid, GetUserDetailsQuery.GetUserDetailsCommandResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetUserDetailsQuery(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("user/{id}")]
        public override ActionResult<GetUserDetailsCommandResult> Execute([FromRoute] Guid id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                var result = _mapper.Map<GetUserDetailsCommandResult>(user);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class GetUserDetailsCommandResult
        {
            public Guid Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string FullName => $"{FirstName} {LastName}";
            public string EmailAddress { get; set; }
            public DateTime RegisteredAt => DateTime.Today;
            public DateTime LastActivity => DateTime.Now;
            public string Role { get; set; }
        }
    }
}