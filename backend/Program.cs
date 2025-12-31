using Microsoft.EntityFrameworkCore;
using backend;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Ensure server listens on fixed port for frontend proxy
builder.WebHost.UseUrls("http://localhost:5000");

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Use InMemory DB for minimal CRUD demo
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("LibraryDb"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();
}

app.MapControllers();

// Seed some initial data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Books.Any())
    {
        db.Books.Add(new Book { Title = "Sample Book", Year = 2025 });
    }

    if (!db.Authors.Any())
    {
        db.Authors.Add(new Author { Name = "Unknown", Country = "" });
    }

    db.SaveChanges();
}

app.Run();
