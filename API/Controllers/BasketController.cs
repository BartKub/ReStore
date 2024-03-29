﻿using System;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController: BaseApiController
{
    private readonly StoreContext _context;
        
    public BasketController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<BasketDto>> Get()
    {
        var basket = await GetBasketAsync(GetBuyerId());

        if (basket is null)
        {
            return NotFound();
        }

        return basket.AsDto();
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
    {
        var basket = await GetBasketAsync(GetBuyerId());

        if (basket == null)
        {
            basket = CreateBasket();
        }

        var product = await _context.Products.FindAsync(productId);

        if (product is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Product not found"
            });
        }
        
        basket.AddItem(product, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest();
        }

        return CreatedAtAction(nameof(Get), basket.AsDto());
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        var basket = await GetBasketAsync(GetBuyerId());

        if (basket is null)
        {
            return NotFound();
        }

        basket.RemoveItem(productId, quantity);

        var result =  await _context.SaveChangesAsync()>0;

        if (!result)
        {
            return BadRequest(new ProblemDetails{Title = "Problem removing item from the basket"});
        }
        
        return NoContent();
    }

    private async Task<Basket> GetBasketAsync(string buyerId)
    {
        if (string.IsNullOrEmpty(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }
       
        return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }

    private string GetBuyerId()
    {
        return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }

    private Basket CreateBasket()
    {
        var buyerId = User.Identity?.Name;

        if (string.IsNullOrEmpty(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };

            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
        }
      
        var basket = new Basket {BuyerId = buyerId};
        _context.Baskets.Add(basket);
        return basket;
    }
}