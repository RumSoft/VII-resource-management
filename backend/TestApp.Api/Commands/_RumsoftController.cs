﻿using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace TestApp.Api.Commands
{
    public abstract class RumsoftController : ControllerBase
    {
        [ApiExplorerSettings(IgnoreApi = true)]
        public BadRequestObjectResult BadRequest(string message)
        {
            return BadRequest(new ResultObject
            {
                Message = message
            });
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public ObjectResult BadRequest(Exception e)
        {
            var message = new StringBuilder().AppendLine(e.Message);

            var exc = e.InnerException;
            for (var i = 0; i < 10; i++)
            {
                if (exc == null)
                    break;

                message.AppendLine(" --> ").Append(exc.Message);

                exc = exc.InnerException;
            }

            return BadRequest(new
            {
                Message = message.ToString(),
                e.StackTrace
            });
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public new ObjectResult BadRequest(ModelStateDictionary modelState)
        {
            return new ObjectResult(new
            {
                Message = ReturnMessages.Message_418_ValidationFailed,
                Errors = new SerializableError(modelState)
            })
            {
                StatusCode = 418 //I'm a teapot;
            };
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public OkObjectResult Ok(string message)
        {
            return Ok(new ResultObject
            {
                Message = message
            });
        }

        public class ResultObject
        {
            public string Message { get; set; }
        }
    }
}