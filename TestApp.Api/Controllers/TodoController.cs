using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Models;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [ApiController]
    [Route("todo")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        /// <summary>
        /// Get all todos
        /// </summary>
        [HttpGet("")]
        public ActionResult<IEnumerable<Todo>> GetAll()
        {
            return Ok(_todoService.Get());
        }

        /// <summary>
        /// Create new todo
        /// </summary>
        [HttpPost("")]
        public ActionResult Add(Todo todo)
        {
            _todoService.Add(todo);
            return Ok();
        }

        /// <summary>
        /// Update existing todo
        /// </summary>
        /// <param name="todo"></param>
        [HttpPut("")]
        public ActionResult Update(Todo todo)
        {
            _todoService.Update(todo);
            return Ok();
        }
    }
}