using System.Linq;
using API.Dtos;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class OrderExtensions
{
    public static IQueryable<OrderDto> AsDto(this IQueryable<Order> query)
    {
        return query.Select(o => new OrderDto
        {
            Id = o.Id,
            BuyerId = o.BuyerId,
            OrderedDate = o.OrderedDate,
            ShippingAddress = o.ShippingAddress,
            OrderStatus = o.OrderStatus.ToString(),
            DeliveryFee = o.DeliveryFee,
            Subtotal = o.Subtotal,
            Total = o.GetTotal(),
            OrderItems = o.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ItemOrdered.ProductId,
                Name = oi.ItemOrdered.Name,
                PictureUrl = oi.ItemOrdered.PictureUrl,
                Price = oi.Price,
                Quantity = oi.Quantity
            }).ToList(),
        }).AsNoTracking();
    }
}