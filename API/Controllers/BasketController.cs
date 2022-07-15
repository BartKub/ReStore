using System;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
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
    public async Task<ActionResult<Basket>> Get()
    {
        var basket = await GetBasketAsync();

        if (basket is null)
        {
            return NotFound();
        }

        return basket;
    }

    [HttpPost]
    public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
    {
        var basket = await GetBasketAsync();

        if (basket == null)
        {
            basket = CreateBasket();
        }

        var product = await _context.Products.FindAsync(productId);

        if (product is null)
        {
            return NotFound();
        }
        
        basket.AddItem(product, quantity);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest();
        }
        
        return StatusCode(201);
    }

    
    
    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        //get basket
        //remove item
        //save

        return NoContent();
    }

    private async Task<Basket> GetBasketAsync()
    {
        var buyerId = Request.Cookies["buyerId"];
        
        return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }

    private Basket CreateBasket()
    {
        var buyerId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.Now.AddDays(30)
        };

        Response.Cookies.Append("buyerId", buyerId, cookieOptions);
        var basket = new Basket {BuyerId = buyerId};
        _context.Baskets.Add(basket);
        return basket;
    }
}