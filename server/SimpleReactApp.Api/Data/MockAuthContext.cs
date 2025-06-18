using SimpleReactApp.Api.Data.Entities;

namespace SimpleReactApp.Api.Data
{
    // Simple in-memory DbSet-like class
    public class InMemoryDbSet<T> : List<T>, IQueryable<T>
    {
        public Type ElementType => typeof(T);
        public System.Linq.Expressions.Expression Expression => this.AsQueryable().Expression;
        public IQueryProvider Provider => this.AsQueryable().Provider;

        public void Add(T entity) => base.Add(entity);

        public Task AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            base.Add(entity);
            return Task.CompletedTask;
        }
    }

    public class MockAuthContext
    {
        public InMemoryDbSet<User> User { get; set; } = new InMemoryDbSet<User>
        {
            new User
            {
                UserId = 1,
                FirstName = "Test",
                LastName = "One",
                EmailAddress = "test1@test.com",
                Password = "Password1!",
                RefreshToken = "refresh_token_1",
                RefreshTokenExpiry = DateTime.UtcNow.AddDays(7)
            },
            new User
            {
                UserId = 2,
                FirstName = "Test",
                LastName = "Two",
                EmailAddress = "test2@test.com",
                Password = "Password2!",
                RefreshToken = "refresh_token_2",
                RefreshTokenExpiry = DateTime.UtcNow.AddDays(7)
            }
        };

        public InMemoryDbSet<UserRoles> UserRoles { get; set; } = new InMemoryDbSet<UserRoles>();

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // No-op for in-memory
            return Task.FromResult(0);
        }
    }
}
