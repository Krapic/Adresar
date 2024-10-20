
using System.ComponentModel.DataAnnotations;

namespace incubis_assignment.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public ICollection<Email> Emails { get; } = new List<Email>();
        public ICollection<Phone> Phones { get; } = new List<Phone>();
        
    }
}
