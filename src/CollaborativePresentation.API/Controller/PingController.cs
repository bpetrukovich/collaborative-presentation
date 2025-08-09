using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/ping")]
public class HealthCheckController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("Pong");
}
