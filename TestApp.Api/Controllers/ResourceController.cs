using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("resources")]
    public class ResourceController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public ResourceController(DataContext context, IUserInfo userInfo, IMapper mapper)
        {
            _context = context;
            _userInfo = userInfo;
            _mapper = mapper;
        }


        [HttpGet]
        public ActionResult GetMyResources()
        {
            IQueryable<Resource> resources = _context.Resources;

            if (!_userInfo.IsAdmin)
            {
                var user = _userInfo.GetCurrentUser();
                resources = resources.Where(x => x.Owner == user);
            }

            var result = _mapper.Map<ResourceDto[]>(resources);
            return Ok(result);
        }
    }
}