using Microsoft.AspNetCore.SignalR;

public class PresentationHub : Hub
{
    public async Task JoinPresentation(string presentationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, presentationId);
    }

    public async Task UpdateSlide(string presentationId, string update)
    {
        await Clients.Group(presentationId).SendAsync("SlideUpdated", update);
    }
}
