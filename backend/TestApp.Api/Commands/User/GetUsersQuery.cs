using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.User
{
    public class GetUsersQuery : Query<UserDto[]>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public GetUsersQuery(IMapper mapper, DataContext context, IUserInfo userInfo)
        {
            _mapper = mapper;
            _context = context;
            _userInfo = userInfo;
        }

        [Authorize]
        [HttpGet("user")]
        public override ActionResult<UserDto[]> Execute()
        {
            var users = _context.Users.AsQueryable();

            if (!_userInfo.IsAdmin)
                users = users.Where(x => x.Role == UserRoles.User);

            var result = _mapper.Map<UserDto[]>(users.ToArray());
            return Ok(result);
        }
    }
}