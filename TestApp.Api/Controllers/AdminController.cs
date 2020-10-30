using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Controllers
{
    //public interface IAdminService
    //{

    //}

    //public class  AdminService : IAdminService
    //{
    //    readonly DataContext _context;

    //    public AdminService(DataContext context)
    //    {
    //        _context = context;
    //    }

    //}

    //[OnlyAdmin]
    //[ApiController]
    //[Route("admin")]
    //public class AdminController : ControllerBase
    //{
    //    private readonly IAdminService _admin;

    //    public AdminController(IAdminService admin)
    //    {
    //        _admin = admin;
    //    }

    //    public ActionResult CreateNewUser(CreateNewUserDto dto)
    //    {

    //    }

    //    public ActionResult ResetUserPassword()
    //    {

    //    }

    //    public ActionResult GenerateRaport()
    //    {

    //    }
    //}
}
