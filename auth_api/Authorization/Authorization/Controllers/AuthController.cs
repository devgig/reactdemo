using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        //[AcceptVerbs("OPTIONS")]
        //public HttpResponseMessage Options()
        //{
        //    var resp = new HttpResponseMessage(HttpStatusCode.OK);
        //    resp.Headers.Add("Access-Control-Allow-Origin", "*");
        //    resp.Headers.Add("Access-Control-Allow-Methods", "GET,DELETE");

        //    return resp;
        //}
        // GET: api/Auth
        [HttpGet]
        public ActionResult Get()
        {
            return Ok(BuildToken());

        }

        private string BuildToken()
        {

            var roles = new[] { "read:rental", "read:books" };
            var claims = new[] { new Claim(ClaimTypes.Role, "read:rental"), new Claim(ClaimTypes.Role, "read:books") };

            // get options
            var config = _configuration.GetSection("JwtIssuerOptions");

            var configKey = config["JwtKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var issuerKey = config["JwtIssuer"];
            var token = new JwtSecurityToken(issuerKey,
              config["JwtIssuer"],
              claims,
              expires: DateTime.Now.AddMinutes(30),
              signingCredentials: creds);

            var jsonCompactSerializedString = new JwtSecurityTokenHandler().WriteToken(token);
            string encodedPayload = jsonCompactSerializedString.Split('.')[1];
            string decodedPayload = Base64UrlDecode(encodedPayload);
            object jsonObject = JsonConvert.DeserializeObject(decodedPayload);
            string formattedPayload = JsonConvert.SerializeObject(jsonObject, Formatting.Indented);

            return formattedPayload;
        }

        // A helper method for properly base64url decoding the payload
        public static string Base64UrlDecode(string value, Encoding encoding = null)
        {
            string urlDecodedValue = value.Replace('_', '/').Replace('-', '+');

            switch (value.Length % 4)
            {
                case 2:
                    urlDecodedValue += "==";
                    break;
                case 3:
                    urlDecodedValue += "=";
                    break;
            }

            return Encoding.ASCII.GetString(Convert.FromBase64String(urlDecodedValue));
        }


    }
}
