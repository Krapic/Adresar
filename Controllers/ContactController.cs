using incubis_assignment.Data;
using incubis_assignment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace incubis_assignment.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            return await _context.Contacts.Include(c => c.Emails).Include(c => c.Phones).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetOneContact(int id)
        {
            var contact = await _context.Contacts.Include(c => c.Emails).Include(c => c.Phones).FirstOrDefaultAsync(c => c.Id == id);
            if (contact == null) return NotFound();
            return contact;
        }

        [HttpPost]
        public async Task<IActionResult> PostContact([FromBody] Contact contact)
        {
            if (contact == null || string.IsNullOrWhiteSpace(contact.Address))
            {
                return BadRequest("Contact Address is required.");
            }

            _context.Contacts.Add(contact);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while saving the contact.");
            }

            return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
        }

        [HttpPost("Email")]
        public async Task<ActionResult<Email>> PostEmail([FromBody] Email email)
        {

            if (email == null || string.IsNullOrEmpty(email.EmailAddress) || string.IsNullOrEmpty(email.Category))
            {
                return BadRequest("Invalid email data.");
            }

            email.Id = 0;
            _context.Emails.Add(email);
            await _context.SaveChangesAsync();
            return Ok(email);
        }

        [HttpPost("Phone")]
        public async Task<ActionResult<Phone>> PostPhone([FromBody] Phone phone)
        {

            if (phone == null || string.IsNullOrEmpty(phone.PhoneNumber) || string.IsNullOrEmpty(phone.Category))
            {
                return BadRequest("Invalid phone data.");
            }

            phone.Id = 0;
            _context.Phones.Add(phone);
            await _context.SaveChangesAsync();
            return Ok(phone);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, [FromBody] Contact contact)
        {
            if (id != contact.Id) return BadRequest();
            _context.Entry(contact).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpPut("Email/{id}")]
        public async Task<IActionResult> PutEmail(int id, [FromBody] Email email)
        {
            if (id != email.Id) return BadRequest("Email ID mismatch.");
            if (email == null || string.IsNullOrEmpty(email.EmailAddress) || string.IsNullOrEmpty(email.Category))
            {
                return BadRequest("Invalid email data.");
            }

            _context.Entry(email).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmailExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpPut("Phone/{id}")]
        public async Task<IActionResult> PutPhone(int id, [FromBody] Phone phone)
        {
            if (id != phone.Id) return BadRequest("Phone ID mismatch.");
            if (phone == null || string.IsNullOrEmpty(phone.PhoneNumber) || string.IsNullOrEmpty(phone.Category))
            {
                return BadRequest("Invalid phone data.");
            }

            _context.Entry(phone).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PhoneExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("Email/{id}")]
        public async Task<ActionResult> DeleteEmail(int id)
        {
            var email = await _context.Emails.FindAsync(id);
            if (email == null) return NotFound();
            _context.Emails.Remove(email);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("Phone/{id}")]
        public async Task<ActionResult> DeletePhone(int id)
        {
            var phone = await _context.Phones.FindAsync(id);
            if (phone == null) return NotFound();
            _context.Phones.Remove(phone);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
        private bool EmailExists(int id)
        {
            return _context.Emails.Any(e => e.Id == id);
        }
        private bool PhoneExists(int id)
        {
            return _context.Phones.Any(e => e.Id == id);
        }
    }
}
