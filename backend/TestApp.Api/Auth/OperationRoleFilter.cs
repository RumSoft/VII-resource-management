using System.Linq;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TestApp.Api.Auth
{
    public class OperationRoleFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var attributes = context.MethodInfo.GetCustomAttributes(true);
            var roles = attributes.OfType<OnlyRolesAttribute>().FirstOrDefault()?.Roles;
            if (roles != null)
                operation.Summary = $"[{string.Join(", ", roles)}] {operation.Summary}";
            else
                operation.Summary = $"[All] {operation.Summary}";
        }
    }
}