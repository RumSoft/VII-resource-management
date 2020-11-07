using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.User
{
    public class GetUsersCommand : Query<GetUsersCommand.GetUsersCommandResult[]>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetUsersCommand(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("user")]
        public override ActionResult<GetUsersCommandResult[]> Execute()
        {
            var users = _context.Users.ToArray();
            var result = _mapper.Map<GetUsersCommandResult[]>(users);
            return Ok(result);
        }

        public class GetUsersCommandResult
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string EmailAddress { get; set; }
            public Guid Id { get; set; }
        }
    }
}