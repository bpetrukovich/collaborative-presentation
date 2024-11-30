using Microsoft.AspNetCore.Components;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class UsersPanel : ComponentBase
{
    [Parameter]
    public List<User> users { get; set; } = new();

    [Parameter]
    public EventCallback<User> onUserRoleChanged { get; set; }
}
