using SimpleReactApp.Api.Data;
using SimpleReactApp.Api.Data.Entities;
using SimpleReactApp.Domain.Models;
using SimpleReactApp.Api.Common;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SimpleReactApp.Api.Logics
{
    public class AccountLogic : IAccountLogic
    {
        private readonly MockAuthContext _authContext;

        private readonly TokenSettings _tokenSettings;

        public AccountLogic(MockAuthContext authContext, IOptions<TokenSettings> tokenSettings)
        {
            _authContext = authContext;
            _tokenSettings = tokenSettings.Value;
        }

        // this is just meant to check the user is allowed and assign claims
        public async Task<(bool IsAuthorized, TokenResponseModel Token)> AuthorizeGoogleUser(string userEmail)
        {
            var userRoles = new List<UserRoles>();
            if (!UserEmailIsAllowed(userEmail))
                return (false, null);
            var token = new TokenResponseModel
            {
                JwtToken = GetJWTAuthKey(userRoles)
            };
            return (true, token);
        }

        private bool UserEmailIsAllowed(string email)
        {
            return true;
        }

        public async Task<TokenResponseModel> RegisterGoogleUser(RegisterGoogleUserModel googleUserModel)
        {
            var user = _authContext.User.Where(_ => _.EmailAddress == googleUserModel.Email).FirstOrDefault();
            List<UserRoles> userRoles = new List<UserRoles>();
            if (user == null)
            {
                // create new user and default roles
                await CreateNewUser(googleUserModel, user, userRoles);
            }

            if (userRoles.Count == 0)
            {
                userRoles = _authContext.UserRoles.Where(_ => _.UserId == user.UserId).ToList();
            }

            return new TokenResponseModel
            {
                JwtToken = GetJWTAuthKey(userRoles)
            };
        }

        private async Task CreateNewUser(RegisterGoogleUserModel googleUserModel, User user, List<UserRoles> userRoles)
        {
            user = new User
            {
                EmailAddress = googleUserModel.Email,
                FirstName = googleUserModel.FirstName,
                LastName = googleUserModel.LastName,
                Password = "NA",
                RefreshToken = "NA",
                RefreshTokenExpiry = DateTime.Now,
            };
            _authContext.User.Add(user);
            await _authContext.SaveChangesAsync();

            UserRoles defaultRole = new UserRoles
            {
                Name = "admin",
                UserId = user.UserId
            };

            _authContext.UserRoles.Add(defaultRole);
            await _authContext.SaveChangesAsync();
            userRoles.Add(defaultRole);
        }

        private string GetJWTAuthKey(List<UserRoles> roles)
        {
            var securtityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSettings.Key));

            var credentials = new SigningCredentials(securtityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>();
            if ((roles?.Count ?? 0) > 0)
            {
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role.Name));
                }
            }

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _tokenSettings.Issuer,
                audience: _tokenSettings.Audience,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials,
                claims: claims
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }
    }
}
