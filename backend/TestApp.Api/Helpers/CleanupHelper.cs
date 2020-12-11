using System.Text.RegularExpressions;

namespace TestApp.Api.Helpers
{
    public static class CleanupHelper
    {
        public static string Cleanup(this string str)
        {
            if (str == null)
                return null;

            var removeMultipleSpacesRegex = new Regex("[ ]{2,}", RegexOptions.None);

            return removeMultipleSpacesRegex
                .Replace(str, " ")
                .Trim();
        }
    }
}