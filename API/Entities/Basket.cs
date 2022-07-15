using System.Collections.Generic;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItems> Items { get; set; } = new();

    public void AddItem(Product product, int quantity)
    {
        var item = Items.Find(x => x.ProductId == product.Id);
        if (item != null)
        {
            item.Quantity += quantity;
        }
        else
        {
            Items.Add(new BasketItems { Product = product, Quantity = quantity });
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        var item = Items.Find(x => x.ProductId == productId);
        if (item == null) return;

        item.Quantity -= quantity;

        if (item.Quantity <= 0)
        {
            Items.Remove(item);
        }
    }
}