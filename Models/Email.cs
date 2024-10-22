using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace incubis_assignment.Models
{
    public class Email
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(Contact))]
        public int ContactId { get; set; }
        public string EmailAddress { get; set; }
        public string Category { get; set; }
        [JsonIgnore]
        public Contact Contact { get; set; }
    }
}
