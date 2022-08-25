using API.Entities.OrderAggregate;
using System.Collections.Generic;
using System;

namespace API.Dtos;

public class OrderDto
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderedDate { get; set; } = DateTime.Now;
    public List<OrderItemDto> OrderItems { get; set; }
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public string OrderStatus { get; set; }
    public long Total { get; set; }
}