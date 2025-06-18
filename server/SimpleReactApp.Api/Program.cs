using SimpleReactApp.Api.Data;
using SimpleReactApp.Api.Logics;
using SimpleReactApp.Api.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Configure EF
//var connectionString = builder.Configuration.GetConnectionString("AuthContext");
//builder.Services.AddDbContext<AuthContext>(options =>
//options.UseSqlServer(connectionString));

// Setup Token Settings from config
var configuration = builder.Configuration;
builder.Services.Configure<TokenSettings>(configuration.GetSection("TokenSettings"));
// wireup account logic
builder.Services.AddScoped<IAccountLogic, AccountLogic>();
builder.Services.AddSingleton<MockAuthContext, MockAuthContext>();
// add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "corsService",
      builder =>
      {
          builder.AllowAnyOrigin();
          builder.AllowAnyHeader();
          builder.AllowAnyMethod();
      });
});

// setup authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    var tokenSettings = configuration
    .GetSection("TokenSettings").Get<TokenSettings>();
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = tokenSettings.Issuer,
        ValidateIssuer = true,
        ValidAudience = tokenSettings.Audience,
        ValidateAudience = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenSettings.Key)),
        ValidateIssuerSigningKey = true,
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseAuthentication(); // authentication must go before authorization here..
app.UseAuthorization();

app.MapControllers();

// more CORS
app.UseCors("corsService");

app.Run();