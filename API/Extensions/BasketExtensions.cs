using System.Linq;
using API.Dtos;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class Extenstions
{
    public static BasketDto AsDto(this Basket basket)
    {
        return new BasketDto
        {
            BuyerId = basket.BuyerId,
            Id = basket.Id,
            Items = basket.Items
                .Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
        };
    }

    public static IQueryable<Basket> GetBasketWithItems(this IQueryable<Basket> query, string buyerId)
    {
        return query.Include(i => i.Items).ThenInclude(i => i.Product).Where(b => b.BuyerId == buyerId);
    }
}