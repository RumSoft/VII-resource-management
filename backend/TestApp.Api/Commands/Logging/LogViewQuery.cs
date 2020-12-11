using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Logging
{
    public class LogViewQuery : Command<LogViewQuery.LogViewParams>
    {
        private readonly DataContext _context;
        private readonly ILogger<LogViewQuery> _logger;

        private readonly string[] LogLevels = {"Trace", "Debug", "Information", "Warning", "Error", "Critical"};

        public LogViewQuery(DataContext context, ILogger<LogViewQuery> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("log")]
        [OnlyAdmin]
        public override IActionResult Execute([FromQuery] LogViewParams input)
        {
            var allowedLogLevels = LogLevels[(int) input.LogLevel..];

            return Ok(_context.Log
                .OrderByDescending(x => x.Id)
                .Take(input.Length)
                .ToList()
                .Where(x => allowedLogLevels.Contains(x.Level))
                .Select(x =>
                    new
                    {
                        x.Id,
                        x.Message,
                        x.Level,
                        x.TimeStamp,
                        x.Exception
                    }));
        }

        public class LogViewParams
        {
            /// <summary>
            ///     Trace = 0, Debug = 1, Information = 2, Warning = 3, Error = 4, Critical = 5
            /// </summary>
            public LogLevel LogLevel { get; set; } = LogLevel.Warning;

            public int Length { get; set; } = 100;
        }
    }
}