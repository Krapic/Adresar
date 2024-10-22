using Microsoft.EntityFrameworkCore;
using incubis_assignment.Models;
using System.Reflection.Metadata;

namespace incubis_assignment.Data;

public class AppDbContext : DbContext
{

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Email> Emails { get; set; }
    public DbSet<Phone> Phones { get; set; }
    public DbSet<Category> Categories { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contact>()
            .HasMany(c => c.Emails)
            .WithOne(e => e.Contact)
            .HasForeignKey(e => e.ContactId);

        modelBuilder.Entity<Contact>()
            .HasMany(c => c.Phones)
            .WithOne(p => p.Contact)
            .HasForeignKey(p => p.ContactId);
    }
    
}