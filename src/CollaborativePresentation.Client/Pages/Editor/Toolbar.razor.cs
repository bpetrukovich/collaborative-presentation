using Microsoft.AspNetCore.Components;

namespace CollaborativePresentation.Client.Pages.Editor;

public partial class Toolbar : ComponentBase
{
    [Parameter]
    public EventCallback onTextAdded { get; set; }

    [Parameter]
    public EventCallback onRectangleAdded { get; set; }

    [Parameter]
    public EventCallback onCircleAdded { get; set; }

    [Parameter]
    public EventCallback onPresenterModeToggle { get; set; }
}
