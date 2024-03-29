﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrdersControllers: BaseApiController
{
    private readonly StoreContext _context;

    public OrdersControllers(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        return await _context.Orders.AsDto()
            .Where(x => x.BuyerId == User.Identity.Name)
            .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrder")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        return await _context.Orders.AsDto()
            .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
            .FirstOrDefaultAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        var basket = await _context.Baskets.GetBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

        if (basket is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Could not locate basket"
            });
        }

        var items = new List<OrderItem>();

        foreach (var basketItem in basket.Items)
        {
            var productItem = await _context.Products.FindAsync(basketItem.ProductId);
            var itemOrdered = new ProductItemOrdered
            {
                ProductId = productItem.Id,
                Name = productItem.Name,
                PictureUrl = productItem.PictureUrl,
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = basketItem.Quantity
            };

            items.Add(orderItem);
            productItem.QuantityInStock -= basketItem.Quantity;
        }

        var subtotal = items.Sum(x => x.Quantity * x.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        var order = new Order
        {
            OrderItems = items,
            BuyerId = User.Identity.Name,
            ShippingAddress = orderDto.ShippingAddress,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            PaymentIntentId = basket.PaymentIntentId    
        };

        _context.Orders.Add(order);
        _context.Baskets.Remove(basket);

        if (orderDto.SaveAddress)
        {
            var user = await _context.Users.Include(x=>x.UserAddress).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var address = new UserAddress
            {
                FullName = orderDto.ShippingAddress.FullName,
                Address1 = orderDto.ShippingAddress.Address1,
                Address2 = orderDto.ShippingAddress.Address2,
                City = orderDto.ShippingAddress.City,
                Country = orderDto.ShippingAddress.Country,
                State = orderDto.ShippingAddress.State,
                Zip = orderDto.ShippingAddress.Zip
            };

            user.UserAddress = address;
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (result)
        {
            return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
        }

        return BadRequest("Problem creating order");
    }
}