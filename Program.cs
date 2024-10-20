// Svrha: Konfiguracija aplikacije i pokretanje aplikacije
// Kreiranje aplikacije, dodavanje servisa, konfiguracija aplikacije i pokretanje aplikacije
// Ovdje nisam mijenjao ništa previše... Dodao sam Swagger za svaki slučaj ako već nije bio dodan, još neke servise koji su bili potrebni i neke ekstenzije

using incubis_assignment.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => { options.AddPolicy("all", policy => { policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin(); }); });
builder.Services.AddDbContext<AppDbContext>(options => { options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")); });
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});
builder.Services.AddSwaggerGen();
var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
if (builder.Environment.IsDevelopment())
{
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("all");
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html");
app.Run();
