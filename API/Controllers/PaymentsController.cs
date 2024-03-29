﻿using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PaymentsController: BaseApiController  
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;

        public PaymentsController(PaymentService paymentService, StoreContext context)
        {
            _paymentService = paymentService;
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets.GetBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (basket is null)
            {
                return NotFound();
            }

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if (intent is null)
            {
                return BadRequest(new ProblemDetails {Title = "Problem creating payment intent"});
            }

            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;

            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;
            if (!result)
            {
                return BadRequest(new ProblemDetails {Title = "Problem updating basket with intent"});
            }

            return basket.AsDto();
        }
    }
}
