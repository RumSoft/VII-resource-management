using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace TestApp.Api.Controllers
{
    public abstract class RumsoftController : ControllerBase
    {
        public class ResultObject
        {
            public bool IsSuccess { get; set; }
            public string Message { get; set; }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public BadRequestObjectResult BadRequest(string message)
        {
            return BadRequest(new ResultObject
            {
                IsSuccess = false,
                Message = message
            });
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public BadRequestObjectResult BadRequest(Exception e)
        { 
            return BadRequest(new 
            {
                IsSuccess = false,
                Message = e.Message,
                Exception = e
            });
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public OkObjectResult Ok(string message)
        {
            return Ok(new ResultObject
            {
                IsSuccess = true,
                Message = message
            });
        }
    }
}