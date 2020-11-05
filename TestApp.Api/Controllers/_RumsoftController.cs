using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace TestApp.Api.Controllers
{
    public abstract class RumsoftController : ControllerBase
    {
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
        public ObjectResult BadRequest(Exception e)
        {
            if (e is ValidationException ve) 
                return ValidationFailed(ve);

            return BadRequest(new ResultObject
            {
                IsSuccess = false,
                Message = e.Message
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

        public class ResultObject
        {
            public bool IsSuccess { get; set; }
            public string Message { get; set; }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public ValidationFailedResult ValidationFailed(ValidationException ex)
        {
            return new ValidationFailedResult(new
            {
                IsSuccess = false,
                Message = ReturnMessages.Message_418_ValidationFailed,
                Errors = ex.Errors.Select(x => new
                {
                    x.PropertyName,
                    x.ErrorMessage
                })
            });
        }

        public class ValidationFailedResult : ObjectResult
        {
            public ValidationFailedResult(object value) : base(value)
            {
                StatusCode = 418; //I'm a teapot
            }
        }
    }
}