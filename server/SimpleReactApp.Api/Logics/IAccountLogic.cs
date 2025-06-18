using SimpleReactApp.Domain.Models;

namespace SimpleReactApp.Api.Logics
{
    public interface IAccountLogic
    {
        Task<TokenResponseModel> RegisterGoogleUser(RegisterGoogleUserModel googleUserModel);
        Task<(bool IsAuthorized, TokenResponseModel Token)> AuthorizeGoogleUser(string userEmail);
    }
}
