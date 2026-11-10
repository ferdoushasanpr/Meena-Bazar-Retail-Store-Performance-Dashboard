using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.Data;
using Server.DTOs;
using Server.Interfaces;
using Server.Models;

namespace Server.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }
    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var exists = await _context.DemoUsers.AnyAsync(
                    u => u.user_email == request.user_email);

        if (exists)
            return null;

        var lastUser = await _context.DemoUsers.OrderByDescending(u => u.user_id).FirstOrDefaultAsync();

        int nextId = 1;

        if (lastUser != null)
        {
            nextId = int.Parse(lastUser.user_id.Substring(4)) + 1;
        }

        var user = new User
        {
            user_id = $"U{nextId:D5}",
            user_name = request.user_name,
            user_email = request.user_email,
            user_role = "user",
            user_signup = DateTime.UtcNow
        };

        user.user_password_hash =
            _passwordHasher.HashPassword(user, request.password);

        _context.DemoUsers.Add(user);

        await _context.SaveChangesAsync();

        return GenerateJwtToken(user);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.DemoUsers.FirstOrDefaultAsync(
                    u => u.user_email == request.user_email);

        if (user == null)
            return null;

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.user_password_hash,
            request.password
        );

        if (result == PasswordVerificationResult.Failed)
            return null;

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.user_password_hash =
                _passwordHasher.HashPassword(user, request.password);

            await _context.SaveChangesAsync();
        }

        return GenerateJwtToken(user);
    }

    private AuthResponse? GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                jwtSettings["Key"]!
            )
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var expiresAt = DateTime.UtcNow.AddMinutes(
            double.Parse(jwtSettings["ExpiresInMinutes"] ?? "60")
        );

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.user_id),
            new Claim(ClaimTypes.NameIdentifier, user.user_id),
            new Claim(ClaimTypes.Name, user.user_name),
            new Claim(ClaimTypes.Email, user.user_email),
            new Claim(ClaimTypes.Role, user.user_role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        return new AuthResponse
        {
            Token = new JwtSecurityTokenHandler()
                .WriteToken(token),

            UserId = user.user_id,
            UserName = user.user_name,
            UserEmail = user.user_email,
            Role = user.user_role,
            ExpiresAt = expiresAt
        };
    }
}