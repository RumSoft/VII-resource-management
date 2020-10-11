using System.Collections.Generic;
using TestApp.Api.Models;
using TestApp.Api.Models.Base;

namespace TestApp.Api.Services
{
    public interface ITodoService
    {
        void Add(Todo todo);
        IEnumerable<Todo> Get();
        void Update(Todo todo);
    }

    public class TodoService : ITodoService
    {
        private readonly DataContext _context;

        public TodoService(DataContext context)
        {
            _context = context;
        }

        public void Add(Todo todo)
        {
            _context.Todos.Add(todo);
            _context.SaveChanges();
        }

        public IEnumerable<Todo> Get()
        {
            return _context.Todos;
        }

        public void Update(Todo todo)
        {
            _context.Todos.Update(todo);
            _context.SaveChanges();
        }
    }
}