using System;
using System.Security.Cryptography;

namespace TestApp.Api.Services.Impl
{
    public class PBKDF2HashSerivce : IHashService
    {
        private const int saltSize = 32;
        private const int hashSize = 64;
        private const int iterations = 10;

        public string HashPassword(string input)
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[saltSize]);
            return HashPassword(input, salt);
        }

        public bool VerifyPassword(string input, string hashedPassword)
        {
            var salt = hashedPassword.Split(':')[0];
            var saltBytes = Convert.FromBase64String(salt);
            return HashPassword(input, saltBytes) == hashedPassword;
        }

        private string HashPassword(string input, byte[] salt)
        {
            using (var pbkdf2 = new Rfc2898DeriveBytes(input, salt, iterations))
            {
                var hash = pbkdf2.GetBytes(hashSize);
                return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
            }
        }
    }
}