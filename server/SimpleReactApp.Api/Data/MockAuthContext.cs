using SimpleReactApp.Api.Data.Entities;
using System.Collections;

namespace SimpleReactApp.Api.Data
{
    // Simple in-memory DbSet-like class
    public class InMemoryDbSet<T> : IQueryable<T> where T : class
    {
        private readonly HashSet<T> _data;
        private readonly IQueryable<T> _query; // Store the queryable

        public InMemoryDbSet()
        {
            _data = new HashSet<T>();
            _query = _data.AsQueryable(); // Create ONCE
        }

        // IQueryable implementation
        public Type ElementType => _query.ElementType;
        public System.Linq.Expressions.Expression Expression => _query.Expression;
        public IQueryProvider Provider => _query.Provider; // Use stored provider

        // Add items without recreating the queryable
        public void Add(T item)
        {
            _data.Add(item);
        }

        public Task AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            Add(entity);
            return Task.CompletedTask;
        }

        // Implement IEnumerable<T>.GetEnumerator
        public IEnumerator<T> GetEnumerator()
        {
            return _data.GetEnumerator();
        }

        // Implement IEnumerable.GetEnumerator
        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
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
                EmailAddress = "iferguson76@gmail.com",
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

        public InMemoryDbSet<UserRoles> UserRoles { get; set; } = new InMemoryDbSet<UserRoles>
        {
            new UserRoles{
                UserId = 1,
                Name = "admin"
            },
            new UserRoles{
                UserId = 2,
                Name = "user"
            }
        };

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // No-op for in-memory
            return Task.FromResult(0);
        }
    }
}
