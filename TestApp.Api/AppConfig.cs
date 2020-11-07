using Microsoft.Extensions.Configuration;

namespace TestApp.Api
{
    public class AppConfig
    {
        public static IConfiguration Configuration { get; set; }

        public static string Url => Configuration["Url"];
        public static string PasswordResetUrl => Configuration["PasswordResetUrl"];

        #region mailing

        private static IConfigurationSection Mail => Configuration.GetSection("Mail");
        public static string Smtp_SenderEmail => Mail["SenderEmail"];
        public static string Smtp_SenderName => Mail["SenderName"];
        public static string Smtp_Host => Mail["Host"];
        public static int Smtp_Port => Mail.GetValue<int>("Port");
        public static string Smtp_Username => Mail["Username"];
        public static string Smtp_Password => Mail["Password"];
        public static bool Smtp_EnableSsl => Mail.GetValue<bool>("EnableSsl");

        #endregion

        #region auth

        private static IConfigurationSection Auth => Configuration.GetSection("Auth");
        public static string Auth_Issuer => Auth["Issuer"];
        public static string Auth_Audience => Auth["Audience"];
        public static string Auth_Key => Auth["Key"];
        public static int Auth_ExpiryInMinutes => Auth.GetValue<int>("ExpiryInMinutes");

        #endregion
    }
}