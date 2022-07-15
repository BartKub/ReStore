using System.Linq;
using API.Entities;

namespace API.Dtos
{
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
                        Quantity = item.Product.QuantityInStock
                    }).ToList()
            };
        }
    }
}
