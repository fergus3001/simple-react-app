using SimpleReactApp.Api.Logics;
using SimpleReactApp.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace SimpleReactApp.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IAccountLogic _accountLogic;
        private readonly IConfiguration _configuration;
        public UserController(IAccountLogic accountLogic, IConfiguration configuration)
        {
            _accountLogic = accountLogic;
            _configuration = configuration;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("authenticate")]
        public async Task<IActionResult> AuthenticateGoogleUser(AuthenticationRequestModel authRequest)
        {
            var idToken = authRequest.IdToken;
            var payload = await VerifyGoogleTokenId(idToken);
            if (payload == null)
            {
                return BadRequest("Invalid token");
            }
            else if (!payload.EmailVerified)
            {
                return Unauthorized("Unverified email");
            }
            var result = await _accountLogic.AuthorizeGoogleUser(payload.Email);
            if (result.IsAuthorized)
            {
                return Ok(result.Token);
            }
            return Unauthorized($"User {payload.Email} is not authorized");
            
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenId(string token)
        {
            try
            {
                var clientId = _configuration["Authentication:Google:ClientId"];
                // uncomment these lines if you want to add settings: 
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                {
                    // shoud get this from config
                    Audience = new[] { clientId },
                };
                //Add your settings and then get the payload
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

                //// Or Get the payload without settings.
                //GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token);

                return payload;
            }
            catch (System.Exception)
            {
                Console.WriteLine("invalid google token");

            }
            return null;
        }
    }
}
