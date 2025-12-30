using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        var books = await Task.FromResult(_context.Books.ToList());
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await Task.FromResult(_context.Books.FirstOrDefault(b => b.Id == id));
        
        if (book == null)
            return NotFound();

        return Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> CreateBook(Book book)
    {
        _context.Books.Add(book);
        await Task.FromResult(_context.SaveChanges());
        
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await Task.FromResult(_context.Books.FirstOrDefault(b => b.Id == id));
        
        if (book == null)
            return NotFound();

        _context.Books.Remove(book);
        await Task.FromResult(_context.SaveChanges());
        
        return NoContent();
    }
}
