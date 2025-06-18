using SimpleReactApp.Api.Logics;
using SimpleReactApp.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace SimpleReactApp.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly IAccountLogic _accountLogic;
        public AccountController(IAccountLogic accountLogic)
        {
            _accountLogic = accountLogic;
        }

        [HttpPost]
        [Route("register-google-user")]
        public async Task<IActionResult> RegisterGoogleUser(RegisterGoogleUserModel googleUserModel)
        {
            var result = await _accountLogic.RegisterGoogleUser(googleUserModel);
            return Ok(result);
        }
    }
}
