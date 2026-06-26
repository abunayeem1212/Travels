using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Domain.Common;
using SkyJourneyBD.Infrastructure.Data;
using System.Linq.Expressions;

namespace SkyJourneyBD.Infrastructure.Repositories;

public class GenericRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<T> _set;

    public GenericRepository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<T>();
    }

    public IQueryable<T> Query() => _set.AsQueryable();

    public async Task<List<T>> GetAllAsync() => await _set.ToListAsync();

    public async Task<T?> GetByIdAsync(int id) => await _set.FindAsync(id);

    public async Task<T?> FindAsync(Expression<Func<T, bool>> predicate)
        => await _set.FirstOrDefaultAsync(predicate);

    public async Task AddAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        await _set.AddAsync(entity);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _set.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _set.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        => await _set.AnyAsync(predicate);
}