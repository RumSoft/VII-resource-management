using Microsoft.AspNetCore.Mvc;

namespace TestApp.Api.Commands
{
    public interface ICommand
    {
        IActionResult Execute();
    }

    public interface IQuery<TOutput>
    {
        ActionResult<TOutput> Execute();
    }

    public interface ICommand<in TInput>
    {
        IActionResult Execute(TInput input);
    }

    public interface ICommand<in TInput, TOutput>
    {
        ActionResult<TOutput> Execute(TInput input);
    }

    //impl
    public abstract class Command : RumsoftController, ICommand
    {
        public abstract IActionResult Execute();
    }

    public abstract class Command<TInput> : RumsoftController, ICommand<TInput>
    {
        public abstract IActionResult Execute(TInput input);
    }

    public abstract class Command<TInput, TOutput> : RumsoftController, ICommand<TInput, TOutput>
    {
        public abstract ActionResult<TOutput> Execute(TInput input);
    }

    public abstract class Query<TOutput> : RumsoftController, IQuery<TOutput>
    {
        public abstract ActionResult<TOutput> Execute();
    }
}