using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Authorization.Tests
{
    public class UnitTest1
    {

        public UnitTest1()
        {

        }

        [Fact]
        public async Task UnAuthorizedAccess()
        {
            var client = new HttpClient();
            var response = await client.GetAsync("/api/auth");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task TestGetToken()
        {
            var auth0clientId = "5y9QNlQZvL0Z0vHHXF4EeZGx8ibAY5Vl";
            var auth0clientSecret = "qjr_O_b_Lhaq4biWRYi4eb0UgkSwNzUVLW1ZqUhqH_c13M05udu6g3fnUVTtiK2O";
            var auth0Audience = "http://localhost:3001";
            var auth0Authority = "https://devgig.auth0.com";

            var auth0Client = new HttpClient();
            var bodyString = $@"{{""client_id"":""{auth0clientId}"", ""client_secret"":""{auth0clientSecret}"", ""audience"":""{auth0Audience}"", ""grant_type"":""client_credentials""}}";
            var response = await auth0Client.PostAsync($"{auth0Authority}oauth/token", new StringContent(bodyString, Encoding.UTF8, "application/json"));

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseString = await response.Content.ReadAsStringAsync();
            var responseJson = JObject.Parse(responseString);
            Assert.NotNull((string)responseJson["access_token"]);
            Assert.Equal("Bearer", (string)responseJson["token_type"]);
        }



        [Fact]
        public async Task GetClaims()
        {
            var token = await GetToken();
            var client = new HttpClient();

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/auth");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await client.SendAsync(requestMessage);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseString = await response.Content.ReadAsStringAsync();
            var responseJson = JArray.Parse(responseString);
            Assert.NotNull(responseJson);
        }

        //[Fact]
        //public async Task GetBooks()
        //{
        //    var token = await GetToken();

        //    var requestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/books");
        //    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        //    var booksResponse = await _client.SendAsync(requestMessage);

        //    Assert.Equal(HttpStatusCode.OK, booksResponse.StatusCode);

        //    var bookResponseString = await booksResponse.Content.ReadAsStringAsync();
        //    var bookResponseJson = JArray.Parse(bookResponseString);
        //    Assert.Equal(4, bookResponseJson.Count);
        //}

        public async Task<string> GetToken()
        {
            var auth0Client = new HttpClient();
            string token = "";
            var auth0clientId = "5y9QNlQZvL0Z0vHHXF4EeZGx8ibAY5Vl";
            var auth0clientSecret = "qjr_O_b_Lhaq4biWRYi4eb0UgkSwNzUVLW1ZqUhqH_c13M05udu6g3fnUVTtiK2O";
            var auth0Audience = "http://localhost:3001";
            var auth0Authority = "https://devgig.auth0.com";

            var bodyString = $@"{{""client_id"":""{auth0clientId}"", ""client_secret"":""{auth0clientSecret}"", ""audience"":""{auth0Audience}"", ""grant_type"":""client_credentials""}}";
            var response = await auth0Client.PostAsync($"{auth0Authority}oauth/token", new StringContent(bodyString, Encoding.UTF8, "application/json"));

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();
                var responseJson = JObject.Parse(responseString);
                token = (string)responseJson["access_token"];

            }

            return token;
        }
    }
}
