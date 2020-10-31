namespace TestApp.Api.Auth
{
    public class TokenConstants
    {
        public static string Issuer = "thisismeyouknow";
        public static string Audience = "thisismeyouknow";
        public static int ExpiryInMinutes = 120;
        public static string key = "thiskeyisverylargetobreak";
    }
}