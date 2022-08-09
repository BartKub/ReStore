using System.Text.Json;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, Metadata metadata)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        
        response.Headers.Add("Pagination", JsonSerializer.Serialize(metadata, options));
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}