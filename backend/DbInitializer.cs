using backend.Models;

namespace backend
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if already seeded
            if (context.Authors.Any() || context.Books.Any())
            {
                return;
            }

            // Add sample authors
            var authors = new Author[]
            {
                new Author { Name = "Лев Толстой", Country = "Россия" },
                new Author { Name = "Федор Достоевский", Country = "Россия" },
                new Author { Name = "Иван Тургенев", Country = "Россия" },
                new Author { Name = "Антон Чехов", Country = "Россия" },
            };

            foreach (var author in authors)
            {
                context.Authors.Add(author);
            }

            context.SaveChanges();

            // Add sample books
            var books = new Book[]
            {
                new Book { Title = "Война и мир", Year = 1869 },
                new Book { Title = "Преступление и наказание", Year = 1866 },
                new Book { Title = "Дворянское гнездо", Year = 1859 },
                new Book { Title = "Вишневый сад", Year = 1904 },
                new Book { Title = "Анна Каренина", Year = 1877 },
            };

            foreach (var book in books)
            {
                context.Books.Add(book);
            }

            context.SaveChanges();
        }
    }
}
