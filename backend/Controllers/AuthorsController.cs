using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthorsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
    {
        var authors = await Task.FromResult(_context.Authors.ToList());
        return Ok(authors);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Author>> GetAuthor(int id)
    {
        var author = await Task.FromResult(_context.Authors.FirstOrDefault(a => a.Id == id));
        
        if (author == null)
            return NotFound();

        return Ok(author);
    }

    [HttpPost]
    public async Task<ActionResult<Author>> CreateAuthor(Author author)
    {
        _context.Authors.Add(author);
        await Task.FromResult(_context.SaveChanges());
        
        return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, author);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuthor(int id)
    {
        var author = await Task.FromResult(_context.Authors.FirstOrDefault(a => a.Id == id));
        
        if (author == null)
            return NotFound();

        _context.Authors.Remove(author);
        await Task.FromResult(_context.SaveChanges());
        
        return NoContent();
    }
}
