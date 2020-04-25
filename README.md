# REACT Auth0 with HTTP Interceptor Pattern

### Author : Geoff Niehaus <geoff_niehaus@hotmail.com>

## Files

| File             |             Context              |
| ---------------- | :------------------------------: |
| Auth.jsx         | Auth class and Axios Interceptor |
| AuthContext.jsx  |   Holds context for Auth class   |
| Callback.jsx     |   Handles /callback from AuthO   |
| PrivateRoute.jsx | Checks Auth and specific Claims  |

## Use Cases

### Securing Routes

The following will not display the Link if the User is not Authenticated.

```
 {isAuthenticated() && (
<NavItem>
<NavLink
    to="/profile"
    className="nav-link"
    onClick={this.handleNavItemClick}>
    Profile
</NavLink>
</NavItem>
)}
```

The following will not display the Link if the User is not Authenticated and the User is not in at least one of the identified Claims.

```
   {isAuthenticated() && userHasClaims(["read:courses"]) && (
                <NavItem>
                  <NavLink
                    to="/courses"
                    className="nav-link"
                    onClick={this.handleNavItemClick}>
                    Courses
                  </NavLink>
                </NavItem>
              )}
```

The following will verify if Authenticated and if the logged in User has the at least one of the identified Claims.

````
  <PrivateRoute
            path="/courses"
            component={Courses}
            claims={["read:courses"]}
          />
```

### Securing API

The following custom `axios` instance incorporates an Interceptor that includes Header information needed for interacting with secure APIs and also adds a `x-correlation-id`.

```
import { axiosinstance } from "../auth/Auth";

```

### dotnet API

Add the following in `ConfigureServices(IServiceCollection services)` in `Startup.cs`.
```
  services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = Configuration["Auth0:Authority"];
                options.Audience = Configuration["Auth0:Audience"];
            });

```
Add the following to `Configure(IApplicationBuilder app, IHostingEnvironment env)` in `Startup.cs`.

```
app.UseAuthentication();

```
````
